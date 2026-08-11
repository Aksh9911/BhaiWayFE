import { bhaiwayApi } from './apiSlice';

export interface TrackingLocation {
  latitude: number;
  longitude: number;
  updatedAt: string;
}

export const trackingApi = bhaiwayApi.injectEndpoints({
  endpoints: (build) => ({
    getRideTracking: build.query<
      { rideId: string; location: TrackingLocation | null },
      string
    >({
      query: (rideId) => `/tracking/rides/${rideId}`,
      providesTags: (_result, _error, rideId) => [{ type: 'Tracking', id: rideId }],
    }),
    postDriverLocation: build.mutation<
      { ok: boolean; rideId: string; location: TrackingLocation },
      { rideId: string; latitude: number; longitude: number }
    >({
      query: ({ rideId, latitude, longitude }) => ({
        url: `/tracking/rides/${rideId}/location`,
        method: 'POST',
        body: { latitude, longitude },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Tracking', id: arg.rideId }],
    }),
  }),
});

export const { useGetRideTrackingQuery, usePostDriverLocationMutation } = trackingApi;
