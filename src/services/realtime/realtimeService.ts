import { env } from '@/config';
import { setConnectionError, setRealtimeStatus } from '@/store/slices/connectionSlice';

import type { RealtimeEnvelope, RealtimeEventName, RealtimeHandler } from './realtimeEvents';

type StoreDispatch = (action: unknown) => unknown;

const handlers = new Map<string, Set<RealtimeHandler>>();
const globalHandlers = new Set<RealtimeHandler>();

let dispatchRef: StoreDispatch | null = null;
let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let intentionallyClosed = false;
let connected = false;

const emitLocal = (envelope: RealtimeEnvelope): void => {
  globalHandlers.forEach((handler) => {
    try {
      handler(envelope);
    } catch (error) {
      if (env.enableLogging) {
        console.warn('[realtime] handler error', error);
      }
    }
  });

  const keyed = handlers.get(envelope.event);
  keyed?.forEach((handler) => {
    try {
      handler(envelope);
    } catch (error) {
      if (env.enableLogging) {
        console.warn('[realtime] keyed handler error', error);
      }
    }
  });
};

const clearReconnectTimer = (): void => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

const scheduleReconnect = (): void => {
  if (intentionallyClosed || env.realtimeTransport !== 'websocket') {
    return;
  }
  clearReconnectTimer();
  dispatchRef?.(setRealtimeStatus('reconnecting'));
  reconnectTimer = setTimeout(() => {
    void realtimeService.connect();
  }, 2500);
};

const connectWebSocket = (): void => {
  if (!env.realtimeUrl) {
    dispatchRef?.(setRealtimeStatus('offline'));
    dispatchRef?.(setConnectionError('EXPO_PUBLIC_REALTIME_URL is not configured'));
    return;
  }

  intentionallyClosed = false;
  dispatchRef?.(setRealtimeStatus('reconnecting'));

  try {
    socket = new WebSocket(env.realtimeUrl);
  } catch (error) {
    dispatchRef?.(setRealtimeStatus('offline'));
    dispatchRef?.(
      setConnectionError(error instanceof Error ? error.message : 'WebSocket connect failed'),
    );
    scheduleReconnect();
    return;
  }

  socket.onopen = () => {
    connected = true;
    dispatchRef?.(setRealtimeStatus('connected'));
    dispatchRef?.(setConnectionError(null));
  };

  socket.onmessage = (message) => {
    try {
      const parsed = JSON.parse(String(message.data)) as RealtimeEnvelope;
      if (parsed?.event) {
        emitLocal({
          event: parsed.event,
          payload: parsed.payload,
          at: parsed.at ?? new Date().toISOString(),
        });
      }
    } catch (error) {
      if (env.enableLogging) {
        console.warn('[realtime] invalid message', error);
      }
    }
  };

  socket.onerror = () => {
    dispatchRef?.(setConnectionError('Realtime socket error'));
  };

  socket.onclose = () => {
    connected = false;
    socket = null;
    if (!intentionallyClosed) {
      dispatchRef?.(setRealtimeStatus('offline'));
      scheduleReconnect();
    }
  };
};

export const realtimeService = {
  bindDispatch: (dispatch: StoreDispatch): void => {
    dispatchRef = dispatch;
  },

  connect: async (): Promise<void> => {
    if (env.realtimeTransport === 'none') {
      dispatchRef?.(setRealtimeStatus('offline'));
      return;
    }

    if (env.realtimeTransport === 'demo') {
      connected = true;
      dispatchRef?.(setRealtimeStatus('connected'));
      dispatchRef?.(setConnectionError(null));
      return;
    }

    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    connectWebSocket();
  },

  disconnect: (): void => {
    intentionallyClosed = true;
    clearReconnectTimer();
    connected = false;
    if (socket) {
      socket.close();
      socket = null;
    }
    dispatchRef?.(setRealtimeStatus('offline'));
  },

  isConnected: (): boolean => connected,

  subscribe: (event: RealtimeEventName | string | '*', handler: RealtimeHandler): (() => void) => {
    if (event === '*') {
      globalHandlers.add(handler);
      return () => {
        globalHandlers.delete(handler);
      };
    }

    const set = handlers.get(event) ?? new Set<RealtimeHandler>();
    set.add(handler);
    handlers.set(event, set);
    return () => {
      set.delete(handler);
      if (set.size === 0) {
        handlers.delete(event);
      }
    };
  },

  /** Publish an event locally (demo mode / optimistic fan-out). */
  publish: (event: RealtimeEventName | string, payload: unknown): void => {
    emitLocal({
      event,
      payload,
      at: new Date().toISOString(),
    });
  },
};
