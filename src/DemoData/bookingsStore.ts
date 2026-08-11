import { DEMO_STORAGE_KEYS } from '@/DemoData/files';

import type { DemoBooking, DemoBookingInput, DemoBookingStatus } from './types';
import { createLocalListStore } from './localStore';

const store = createLocalListStore<DemoBooking, 'booking_id'>(
  DEMO_STORAGE_KEYS.bookings,
  'booking_id',
);

export const demoBookingsStore = {
  hydrate: store.hydrate,
  getAll: store.getAll,
  getById: store.getById,
  subscribe: store.subscribe,
  removeById: store.removeById,
  clear: store.clear,

  add: async (input: DemoBookingInput): Promise<DemoBooking> => {
    await store.hydrate();
    const booking: DemoBooking = {
      booking_id: store.nextId(),
      ride_id: input.ride_id,
      passenger_id: input.passenger_id,
      seats_booked: input.seats_booked,
      amount: input.amount,
      booking_status: input.booking_status,
      payment_status: input.payment_status,
      booked_at: input.booked_at ?? new Date().toISOString(),
    };
    return store.save(booking);
  },

  update: async (
    bookingId: number,
    patch: Partial<DemoBookingInput>,
  ): Promise<DemoBooking | null> => {
    await store.hydrate();
    const existing = store.getById(bookingId);
    if (!existing) {
      return null;
    }
    const next: DemoBooking = {
      ...existing,
      ...patch,
      booking_id: existing.booking_id,
    };
    return store.save(next);
  },

  getByRideId: (rideId: number) =>
    store.getAll().filter((booking) => booking.ride_id === rideId),

  getByPassengerId: (passengerId: number) =>
    store.getAll().filter((booking) => booking.passenger_id === passengerId),

  getByStatus: (status: DemoBookingStatus) =>
    store.getAll().filter((booking) => booking.booking_status === status),
};
