import { createApi } from '@reduxjs/toolkit/query/react';

import { bhaiwayBaseQuery } from './baseQuery';

export const API_TAG_TYPES = [
  'User',
  'Ride',
  'Booking',
  'Payment',
  'Notification',
  'Tracking',
  'Rating',
] as const;

export const bhaiwayApi = createApi({
  reducerPath: 'bhaiwayApi',
  baseQuery: bhaiwayBaseQuery,
  tagTypes: [...API_TAG_TYPES],
  endpoints: () => ({}),
});
