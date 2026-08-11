import { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { bhaiwayApi } from '@/services/api/apiSlice';
import { REALTIME_EVENTS, realtimeService } from '@/services/realtime';
import { authSession } from '@/store/auth';
import { clearAuthSession, setAuthSession } from '@/store/slices/authSlice';
import { setNetworkStatus } from '@/store/slices/connectionSlice';

import { store } from './store';

// Ensure injected endpoints are registered before cache helpers run.
import '@/services/api/usersApi';
import '@/services/api/ridesApi';
import '@/services/api/bookingsApi';
import '@/services/api/paymentsApi';
import '@/services/api/notificationsApi';
import '@/services/api/trackingApi';
import '@/services/api/ratingsApi';

const syncAuthFromSession = (): void => {
  const token = authSession.getToken();
  const user = authSession.getUser();
  const isAuthed = Boolean(token && user);
  const wasAuthed = store.getState().auth.isAuthenticated;

  if (isAuthed && token && user) {
    store.dispatch(
      setAuthSession({
        token,
        user,
        role: authSession.getRole(),
      }),
    );
    return;
  }

  store.dispatch(clearAuthSession());
  if (wasAuthed) {
    store.dispatch(bhaiwayApi.util.resetApiState());
  }
};

/** Bridges existing authSession + realtime events into the Redux/RTK Query layer. */
export const bootstrapReduxRuntime = (): (() => void) => {
  realtimeService.bindDispatch(store.dispatch);
  syncAuthFromSession();
  void realtimeService.connect();

  const unsubscribeAuth = authSession.subscribe(() => {
    syncAuthFromSession();
  });

  const unsubscribeRealtime = realtimeService.subscribe('*', (envelope) => {
    switch (envelope.event) {
      case REALTIME_EVENTS.RIDE_CREATED:
      case REALTIME_EVENTS.RIDE_UPDATED:
      case REALTIME_EVENTS.RIDE_CANCELLED:
        store.dispatch(
          bhaiwayApi.util.invalidateTags([
            { type: 'Ride', id: 'LIST' },
            { type: 'Ride', id: 'SEARCH' },
          ]),
        );
        break;
      case REALTIME_EVENTS.BOOKING_CREATED:
      case REALTIME_EVENTS.BOOKING_ACCEPTED:
      case REALTIME_EVENTS.BOOKING_REJECTED:
      case REALTIME_EVENTS.BOOKING_CANCELLED:
        store.dispatch(
          bhaiwayApi.util.invalidateTags([
            { type: 'Booking', id: 'LIST' },
            { type: 'Ride', id: 'SEARCH' },
            { type: 'Ride', id: 'LIST' },
          ]),
        );
        break;
      case REALTIME_EVENTS.PAYMENT_SUCCESS:
      case REALTIME_EVENTS.PAYMENT_FAILED:
        store.dispatch(
          bhaiwayApi.util.invalidateTags([
            { type: 'Payment', id: 'LIST' },
            { type: 'Booking', id: 'LIST' },
            { type: 'Notification', id: 'LIST' },
          ]),
        );
        break;
      case REALTIME_EVENTS.NOTIFICATION_CREATED:
        store.dispatch(bhaiwayApi.util.invalidateTags([{ type: 'Notification', id: 'LIST' }]));
        break;
      case REALTIME_EVENTS.RIDE_LOCATION_UPDATED: {
        const payload = envelope.payload as {
          rideId?: string;
          location?: { latitude: number; longitude: number; updatedAt: string };
        };
        if (payload.rideId) {
          store.dispatch(
            bhaiwayApi.util.invalidateTags([{ type: 'Tracking', id: payload.rideId }]),
          );
        }
        break;
      }
      case REALTIME_EVENTS.RATING_CREATED:
        store.dispatch(
          bhaiwayApi.util.invalidateTags([
            { type: 'Rating', id: 'LIST' },
            { type: 'User', id: 'ME' },
          ]),
        );
        break;
      default:
        break;
    }
  });

  const onAppState = (next: AppStateStatus): void => {
    if (next === 'active') {
      store.dispatch(setNetworkStatus('online'));
      void realtimeService.connect();
      store.dispatch(
        bhaiwayApi.util.invalidateTags([
          { type: 'Ride', id: 'SEARCH' },
          { type: 'Booking', id: 'LIST' },
          { type: 'Notification', id: 'LIST' },
        ]),
      );
      return;
    }
    if (next === 'background') {
      // Keep demo bus alive; disconnect remote sockets only.
      // realtimeService.disconnect() is reserved for logout.
    }
  };

  const appSub = AppState.addEventListener('change', onAppState);

  return () => {
    unsubscribeAuth();
    unsubscribeRealtime();
    appSub.remove();
    realtimeService.disconnect();
  };
};
