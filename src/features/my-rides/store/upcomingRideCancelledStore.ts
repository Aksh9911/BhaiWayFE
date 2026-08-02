type CancelListener = (cancelled: boolean) => void;

let cancelled = false;
const listeners = new Set<CancelListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener(cancelled));
};

export const upcomingRideCancelledStore = {
  get: (): boolean => cancelled,

  setCancelled: (value = true): void => {
    cancelled = value;
    notify();
  },

  clear: (): void => {
    cancelled = false;
    notify();
  },

  subscribe: (listener: CancelListener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
