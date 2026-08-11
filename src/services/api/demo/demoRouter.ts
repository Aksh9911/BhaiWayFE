import type { FetchArgs } from '@reduxjs/toolkit/query';
import type { BaseQueryApi } from '@reduxjs/toolkit/query';

import { handleBookingsDemo } from './bookingsDemo';
import { handleNotificationsDemo } from './notificationsDemo';
import { handlePaymentsDemo } from './paymentsDemo';
import { handleRatingsDemo } from './ratingsDemo';
import { handleRidesDemo } from './ridesDemo';
import { handleTrackingDemo } from './trackingDemo';
import { handleUsersDemo } from './usersDemo';

export interface NormalizedRequest {
  method: string;
  url: string;
  body?: unknown;
  params?: Record<string, unknown>;
}

export const normalizeArgs = (args: string | FetchArgs): NormalizedRequest => {
  if (typeof args === 'string') {
    return { method: 'GET', url: args };
  }

  const method = (args.method ?? 'GET').toUpperCase();
  const url = typeof args.url === 'string' ? args.url : '';
  return {
    method,
    url,
    body: args.body,
    params: (args.params as Record<string, unknown> | undefined) ?? undefined,
  };
};

/** Route RTK Query requests to DemoData stores while DEMO_MODE is on. */
export const handleDemoRequest = async (
  args: string | FetchArgs,
  _api: BaseQueryApi,
): Promise<unknown> => {
  const request = normalizeArgs(args);
  const path = request.url.split('?')[0] ?? request.url;

  if (path.startsWith('/users') || path.startsWith('/auth')) {
    return handleUsersDemo(request);
  }
  if (/\/rides\/[^/]+\/ratings$/.test(path) || path.startsWith('/ratings')) {
    return handleRatingsDemo(request);
  }
  if (path.startsWith('/tracking') || /\/rides\/[^/]+\/location$/.test(path)) {
    return handleTrackingDemo(request);
  }
  if (path.startsWith('/rides')) {
    return handleRidesDemo(request);
  }
  if (path.startsWith('/bookings')) {
    return handleBookingsDemo(request);
  }
  if (path.startsWith('/payments')) {
    return handlePaymentsDemo(request);
  }
  if (path.startsWith('/notifications')) {
    return handleNotificationsDemo(request);
  }

  throw new Error(`Demo route not implemented: ${request.method} ${path}`);
};
