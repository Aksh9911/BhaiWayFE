import { REALTIME_EVENTS, realtimeService } from '@/services/realtime';

import type { NormalizedRequest } from './demoRouter';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handlePaymentsDemo = async (request: NormalizedRequest): Promise<unknown> => {
  await wait(150);
  const { method, url, body } = request;
  const path = url.split('?')[0] ?? url;

  if (method === 'POST' && path === '/payments') {
    const payload = (body ?? {}) as Record<string, unknown>;
    const payment = {
      id: `pay_${Date.now()}`,
      bookingId: payload.bookingId ?? null,
      rideId: payload.rideId ?? null,
      amount: Number(payload.amount) || 0,
      method: String(payload.method ?? 'wallet'),
      status: 'success' as const,
      createdAt: new Date().toISOString(),
    };
    realtimeService.publish(REALTIME_EVENTS.PAYMENT_SUCCESS, payment);
    return { payment };
  }

  throw new Error(`Demo payments route not implemented: ${method} ${path}`);
};
