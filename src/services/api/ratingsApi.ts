import { bhaiwayApi } from './apiSlice';

export const ratingsApi = bhaiwayApi.injectEndpoints({
  endpoints: (build) => ({
    getRideRatings: build.query<{ ratings: Record<string, unknown>[]; total: number }, string>({
      query: (rideId) => `/rides/${rideId}/ratings`,
      providesTags: (_result, _error, rideId) => [{ type: 'Rating', id: rideId }],
    }),
    createRating: build.mutation<
      { rating: Record<string, unknown> },
      { rideId: string | number; score: number; comment?: string; targetUserId?: string }
    >({
      query: (body) => ({
        url: '/ratings',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Rating', id: String(arg.rideId) },
        { type: 'User', id: 'ME' },
      ],
    }),
  }),
});

export const { useGetRideRatingsQuery, useCreateRatingMutation } = ratingsApi;
