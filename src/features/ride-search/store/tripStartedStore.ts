type TripStartedListener = () => void;

const startedRideIds = new Set<string>();
/** Session-level flag so rider Live Tracking unlocks after driver start OTP in mock flows. */
let sessionStarted = false;
const listeners = new Set<TripStartedListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener());
};

/**
 * Tracks when the driver has started a ride (start OTP verified).
 * Live Tracking shows the map only after the ride has started.
 */
export const tripStartedStore = {
  isStarted: (rideId?: string): boolean => {
    if (sessionStarted) {
      return true;
    }
    const id = rideId?.trim();
    if (!id) {
      return false;
    }
    return startedRideIds.has(id);
  },

  markStarted: (rideId?: string): void => {
    sessionStarted = true;
    const id = rideId?.trim();
    if (id) {
      startedRideIds.add(id);
    }
    notify();
  },

  clear: (): void => {
    sessionStarted = false;
    startedRideIds.clear();
    notify();
  },

  subscribe: (listener: TripStartedListener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
