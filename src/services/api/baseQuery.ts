import type { BaseQueryApi, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { env } from '@/config';

import { handleDemoRequest } from './demo/demoRouter';

export type AppFetchArgs = string | FetchArgs;

type AuthAwareState = {
  auth?: { token?: string | null };
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.apiBaseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as AuthAwareState).auth?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
  timeout: env.apiTimeoutMs,
});

export const bhaiwayBaseQuery: BaseQueryFn<
  AppFetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (env.demoMode || env.useMocks) {
    try {
      const data = await handleDemoRequest(args, api as BaseQueryApi);
      return { data };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Demo request failed';
      return {
        error: {
          status: 'CUSTOM_ERROR',
          error: message,
          data: { message },
        },
      };
    }
  }

  return rawBaseQuery(args, api, extraOptions);
};
