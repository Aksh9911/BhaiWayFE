import { REALTIME_EVENTS, realtimeService } from '@/services/realtime';

import type { NormalizedRequest } from './demoRouter';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** In-memory tracking positions for demo mode (per ride). */
const locations = new Map<string, { latitude: number; longitude: number; updatedAt: string }>();

export const handleTrackingDemo = async (request: NormalizedRequest): Promise<unknown> => {
  await wait(40);
  const { method, url, body } = request;
  const path = url.split('?')[0] ?? url;

  const rideLocationMatch = path.match(/^\/tracking\/rides\/([^/]+)\/location$/);
  const rideTrackMatch = path.match(/^\/tracking\/rides\/([^/]+)$/);

  if (method === 'POST' && rideLocationMatch) {
    const rideId = rideLocationMatch[1];
    const payload = (body ?? {}) as { latitude?: number; longitude?: number };
    const next = {
      latitude: Number(payload.latitude) || 0,
      longitude: Number(payload.longitude) || 0,
      updatedAt: new Date().toISOString(),
    };
    locations.set(rideId, next);
    realtimeService.publish(REALTIME_EVENTS.RIDE_LOCATION_UPDATED, {
      rideId,
      location: next,
    });
    return { ok: true, rideId, location: next };
  }

  if (method === 'GET' && (rideLocationMatch || rideTrackMatch)) {
    const rideId = (rideLocationMatch ?? rideTrackMatch)?.[1] ?? '';
    return {
      rideId,
      location: locations.get(rideId) ?? null,
    };
  }

  throw new Error(`Demo tracking route not implemented: ${method} ${path}`);
};
