import { REALTIME_EVENTS, realtimeService } from '@/services/realtime';

import type { NormalizedRequest } from './demoRouter';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ratings: Array<Record<string, unknown>> = [];

export const handleRatingsDemo = async (request: NormalizedRequest): Promise<unknown> => {
  await wait(80);
  const { method, url, body } = request;
  const path = url.split('?')[0] ?? url;

  if (method === 'POST' && path === '/ratings') {
    const payload = (body ?? {}) as Record<string, unknown>;
    const rating = {
      id: `rating_${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };
    ratings.push(rating);
    realtimeService.publish(REALTIME_EVENTS.RATING_CREATED, rating);
    return { rating };
  }

  const rideRatingsMatch = path.match(/^\/rides\/([^/]+)\/ratings$/);
  if (method === 'GET' && rideRatingsMatch) {
    const rideId = rideRatingsMatch[1];
    const list = ratings.filter((item) => String(item.rideId) === rideId);
    return { ratings: list, total: list.length };
  }

  throw new Error(`Demo ratings route not implemented: ${method} ${path}`);
};
