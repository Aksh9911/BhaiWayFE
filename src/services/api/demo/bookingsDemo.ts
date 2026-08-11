import { rideBookingsSheetStore, rideBookingsSheetSync } from '@/DemoData';
import { REALTIME_EVENTS, realtimeService } from '@/services/realtime';

import type { NormalizedRequest } from './demoRouter';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleBookingsDemo = async (request: NormalizedRequest): Promise<unknown> => {
  await wait(100);
  const { method, url, body, params } = request;
  const path = url.split('?')[0] ?? url;

  if (method === 'GET' && path === '/bookings') {
    const mine = String(params?.mine ?? '1') !== '0';
    const rows = mine ? rideBookingsSheetStore.getForCurrentUser() : rideBookingsSheetStore.getAll();
    return { bookings: rows, total: rows.length };
  }

  const bookingMatch = path.match(/^\/bookings\/([^/]+)$/);
  const actionMatch = path.match(/^\/bookings\/([^/]+)\/(cancel|accept|reject)$/);

  if (method === 'GET' && bookingMatch) {
    const id = Number(bookingMatch[1]);
    const row = rideBookingsSheetStore.findByBookingId(id);
    if (!row) {
      throw new Error('Booking not found');
    }
    return { booking: row };
  }

  if (method === 'POST' && path === '/bookings') {
    const payload = (body ?? {}) as Record<string, unknown>;
    const result = await rideBookingsSheetSync.upsertAndSync({
      rideId: String(payload.rideId ?? ''),
      origin: String(payload.origin ?? ''),
      destination: String(payload.destination ?? ''),
      departureLabel: String(payload.departureLabel ?? payload.departureDate ?? ''),
      driverName: String(payload.driverName ?? ''),
      vehicleLabel: String(payload.vehicleLabel ?? ''),
      seatsBooked: Number(payload.seats ?? payload.seatsBooked) || 1,
      amount: Number(payload.amount) || 0,
      paymentStatus: (payload.paymentStatus as 'paid' | 'pending') ?? 'pending',
      status: (payload.status as 'confirmed' | 'cancelled' | 'completed') ?? 'confirmed',
      originLat: Number(payload.originLat) || 0,
      originLng: Number(payload.originLng) || 0,
      destLat: Number(payload.destLat) || 0,
      destLng: Number(payload.destLng) || 0,
    });
    const row = rideBookingsSheetStore.findByBookingId(result.bookingId);
    realtimeService.publish(REALTIME_EVENTS.BOOKING_CREATED, {
      bookingId: result.bookingId,
      rideId: payload.rideId,
      row,
    });
    return { booking: row, bookingId: result.bookingId };
  }

  if (method === 'POST' && actionMatch) {
    const bookingId = Number(actionMatch[1]);
    const action = actionMatch[2];
    const existing = rideBookingsSheetStore.findByBookingId(bookingId);
    if (!existing) {
      throw new Error('Booking not found');
    }

    if (action === 'cancel') {
      const result = await rideBookingsSheetSync.upsertAndSync({
        ...existing,
        bookingId,
        status: 'cancelled',
      });
      const row = rideBookingsSheetStore.findByBookingId(result.bookingId);
      realtimeService.publish(REALTIME_EVENTS.BOOKING_CANCELLED, { bookingId, row });
      return { booking: row };
    }

    if (action === 'accept') {
      realtimeService.publish(REALTIME_EVENTS.BOOKING_ACCEPTED, { bookingId, row: existing });
      return { booking: existing, status: 'accepted' };
    }

    if (action === 'reject') {
      const result = await rideBookingsSheetSync.upsertAndSync({
        ...existing,
        bookingId,
        status: 'cancelled',
      });
      const row = rideBookingsSheetStore.findByBookingId(result.bookingId);
      realtimeService.publish(REALTIME_EVENTS.BOOKING_REJECTED, { bookingId, row });
      return { booking: row, status: 'rejected' };
    }
  }

  if (method === 'PUT' && bookingMatch) {
    const bookingId = Number(bookingMatch[1]);
    const existing = rideBookingsSheetStore.findByBookingId(bookingId);
    if (!existing) {
      throw new Error('Booking not found');
    }
    const payload = (body ?? {}) as Record<string, unknown>;
    const result = await rideBookingsSheetSync.upsertAndSync({
      ...existing,
      ...payload,
      bookingId,
      origin: String(payload.origin ?? existing.origin),
      destination: String(payload.destination ?? existing.destination),
    });
    const row = rideBookingsSheetStore.findByBookingId(result.bookingId);
    return { booking: row };
  }

  throw new Error(`Demo bookings route not implemented: ${method} ${path}`);
};
