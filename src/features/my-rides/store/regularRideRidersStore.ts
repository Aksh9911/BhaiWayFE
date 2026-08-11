import type { UpcomingRideRider } from '../types';

type RidersListener = (riders: readonly UpcomingRideRider[]) => void;

/** Confirmed riders for regular rides (accepted from Track My Ride). */
const ridersByRideId = new Map<string, UpcomingRideRider[]>();
/** Declined request ids so they stay hidden after Confirm Decline. */
const declinedByRideId = new Map<string, Set<string>>();
const listeners = new Set<RidersListener>();

const snapshot = (): UpcomingRideRider[] => {
  const all: UpcomingRideRider[] = [];
  ridersByRideId.forEach((list) => {
    all.push(...list);
  });
  return all;
};

const notify = (): void => {
  const current = snapshot();
  listeners.forEach((listener) => listener(current));
};

export const regularRideRidersStore = {
  getForRide: (rideId: string): readonly UpcomingRideRider[] =>
    ridersByRideId.get(rideId) ?? [],

  getDeclinedIds: (rideId: string): ReadonlySet<string> =>
    declinedByRideId.get(rideId) ?? new Set(),

  accept: (rideId: string, rider: UpcomingRideRider): void => {
    const current = ridersByRideId.get(rideId) ?? [];
    if (current.some((item) => item.id === rider.id)) {
      return;
    }
    ridersByRideId.set(rideId, [...current, rider]);
    notify();
  },

  decline: (rideId: string, riderId: string): void => {
    const declined = declinedByRideId.get(rideId) ?? new Set();
    declined.add(riderId);
    declinedByRideId.set(rideId, declined);
    // Also drop from confirmed if present.
    const current = ridersByRideId.get(rideId) ?? [];
    ridersByRideId.set(
      rideId,
      current.filter((item) => item.id !== riderId),
    );
    notify();
  },

  remove: (rideId: string, riderId: string): void => {
    const current = ridersByRideId.get(rideId) ?? [];
    ridersByRideId.set(
      rideId,
      current.filter((item) => item.id !== riderId),
    );
    notify();
  },

  clear: (rideId?: string): void => {
    if (rideId) {
      ridersByRideId.delete(rideId);
      declinedByRideId.delete(rideId);
    } else {
      ridersByRideId.clear();
      declinedByRideId.clear();
    }
    notify();
  },

  subscribe: (listener: RidersListener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
