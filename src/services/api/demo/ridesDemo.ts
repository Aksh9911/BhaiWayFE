import { publishedRidesSheetStore, publishedRidesSheetSync } from '@/DemoData';
import { getPublishedRidesForSearch, mapPublishedRideToResult } from '@/features/ride-search/utils';
import { REALTIME_EVENTS, realtimeService } from '@/services/realtime';

import type { NormalizedRequest } from './demoRouter';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleRidesDemo = async (request: NormalizedRequest): Promise<unknown> => {
  await wait(120);
  const { method, url, body, params } = request;
  const path = url.split('?')[0] ?? url;

  if (method === 'GET' && path === '/rides/search') {
    const origin = String(params?.from ?? params?.origin ?? '');
    const destination = String(params?.destination ?? '');
    const rides = getPublishedRidesForSearch().map((ride) => ({
      ...ride,
      originCity: origin ? origin.split(',')[0]?.trim() || ride.originCity : ride.originCity,
      destinationCity: destination
        ? destination.split(',')[0]?.trim() || ride.destinationCity
        : ride.destinationCity,
    }));
    return { rides, total: rides.length };
  }

  if (method === 'GET' && path === '/rides') {
    const mine = String(params?.mine ?? '') === '1' || String(params?.mine ?? '') === 'true';
    const rows = mine
      ? publishedRidesSheetStore.getForCurrentUser()
      : publishedRidesSheetStore.getAll().filter((row) => row.status === 'published');
    return {
      rides: rows.map(mapPublishedRideToResult),
      rows,
      total: rows.length,
    };
  }

  const rideMatch = path.match(/^\/rides\/([^/]+)$/);
  if (method === 'GET' && rideMatch) {
    const rawId = rideMatch[1];
    const numericId = Number(String(rawId).replace(/^pub-/, ''));
    const row =
      publishedRidesSheetStore.findByRideId(numericId) ??
      publishedRidesSheetStore.getAll().find((item) => String(item.rideId) === rawId);
    if (!row) {
      throw new Error('Ride not found');
    }
    return { ride: mapPublishedRideToResult(row), row };
  }

  if (method === 'POST' && path === '/rides') {
    const payload = (body ?? {}) as Record<string, unknown>;
    const result = await publishedRidesSheetSync.upsertAndSync({
      rideType: (payload.rideType as 'regular' | 'assured') ?? 'regular',
      origin: String(payload.origin ?? ''),
      destination: String(payload.destination ?? ''),
      departureDate: String(payload.departureDate ?? ''),
      departureTime: String(payload.departureTime ?? ''),
      availableSeats: Number(payload.availableSeats) || 1,
      pricePerSeat: String(payload.pricePerSeat ?? ''),
      preferences: String(payload.preferences ?? ''),
      notes: String(payload.notes ?? ''),
      vehicleName: String(payload.vehicleName ?? ''),
      vehiclePlate: String(payload.vehiclePlate ?? ''),
      maxTwoInBack: Boolean(payload.maxTwoInBack),
      womenOnly: Boolean(payload.womenOnly),
      originLat: Number(payload.originLat) || 0,
      originLng: Number(payload.originLng) || 0,
      destLat: Number(payload.destLat) || 0,
      destLng: Number(payload.destLng) || 0,
      status: 'published',
      publishedAt: new Date().toISOString(),
    });
    const row = publishedRidesSheetStore.findByRideId(result.rideId);
    if (!row) {
      throw new Error('Ride was saved but could not be loaded');
    }
    realtimeService.publish(REALTIME_EVENTS.RIDE_CREATED, { rideId: row.rideId, row });
    return { ride: mapPublishedRideToResult(row), row };
  }

  if (method === 'PUT' && rideMatch) {
    const rawId = rideMatch[1];
    const numericId = Number(String(rawId).replace(/^pub-/, ''));
    const existing = publishedRidesSheetStore.findByRideId(numericId);
    if (!existing) {
      throw new Error('Ride not found');
    }
    const payload = (body ?? {}) as Record<string, unknown>;
    const result = await publishedRidesSheetSync.upsertAndSync({
      ...existing,
      ...payload,
      rideId: existing.rideId,
      availableSeats:
        payload.availableSeats != null
          ? Number(payload.availableSeats)
          : existing.availableSeats,
    });
    const row = publishedRidesSheetStore.findByRideId(result.rideId) ?? existing;
    realtimeService.publish(REALTIME_EVENTS.RIDE_UPDATED, { rideId: row.rideId, row });
    return { ride: mapPublishedRideToResult(row), row };
  }

  if (method === 'DELETE' && rideMatch) {
    const rawId = rideMatch[1];
    const numericId = Number(String(rawId).replace(/^pub-/, ''));
    const existing = publishedRidesSheetStore.findByRideId(numericId);
    if (!existing) {
      throw new Error('Ride not found');
    }
    await publishedRidesSheetSync.upsertAndSync({
      ...existing,
      status: 'cancelled',
    });
    realtimeService.publish(REALTIME_EVENTS.RIDE_CANCELLED, { rideId: existing.rideId });
    return { ok: true, rideId: existing.rideId };
  }

  throw new Error(`Demo rides route not implemented: ${method} ${path}`);
};
