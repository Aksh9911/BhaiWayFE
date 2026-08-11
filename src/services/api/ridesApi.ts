import type { RideResultItem } from '@/features/ride-search/types';
import type { PublishedRidesSheetRow } from '@/DemoData';

import { bhaiwayApi } from './apiSlice';

export interface SearchRidesParams {
  from?: string;
  destination?: string;
  date?: string;
  passengers?: number;
}

export interface SearchRidesResponse {
  rides: RideResultItem[];
  total: number;
}

export interface RideDetailResponse {
  ride: RideResultItem;
  row: PublishedRidesSheetRow;
}

export interface CreateRideBody {
  rideType?: 'regular' | 'assured';
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: string;
  preferences?: string;
  notes?: string;
  vehicleName?: string;
  vehiclePlate?: string;
  maxTwoInBack?: boolean;
  womenOnly?: boolean;
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
}

export const ridesApi = bhaiwayApi.injectEndpoints({
  endpoints: (build) => ({
    searchRides: build.query<SearchRidesResponse, SearchRidesParams | void>({
      query: (params) => ({
        url: '/rides/search',
        params: params ?? {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.rides.map((ride) => ({ type: 'Ride' as const, id: ride.id })),
              { type: 'Ride' as const, id: 'SEARCH' },
            ]
          : [{ type: 'Ride', id: 'SEARCH' }],
    }),
    getRides: build.query<
      { rides: RideResultItem[]; rows: PublishedRidesSheetRow[]; total: number },
      { mine?: boolean } | void
    >({
      query: (params) => ({
        url: '/rides',
        params: { mine: params?.mine ? '1' : '0' },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.rides.map((ride) => ({ type: 'Ride' as const, id: ride.id })),
              { type: 'Ride' as const, id: 'LIST' },
            ]
          : [{ type: 'Ride', id: 'LIST' }],
    }),
    getRide: build.query<RideDetailResponse, string>({
      query: (rideId) => `/rides/${rideId}`,
      providesTags: (_result, _error, rideId) => [{ type: 'Ride', id: rideId }],
    }),
    createRide: build.mutation<RideDetailResponse, CreateRideBody>({
      query: (body) => ({
        url: '/rides',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Ride', id: 'LIST' },
        { type: 'Ride', id: 'SEARCH' },
      ],
    }),
    updateRide: build.mutation<RideDetailResponse, { rideId: string; body: Record<string, unknown> }>({
      query: ({ rideId, body }) => ({
        url: `/rides/${rideId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Ride', id: arg.rideId },
        { type: 'Ride', id: 'LIST' },
        { type: 'Ride', id: 'SEARCH' },
      ],
    }),
    deleteRide: build.mutation<{ ok: boolean; rideId: number }, string>({
      query: (rideId) => ({
        url: `/rides/${rideId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'Ride', id: 'LIST' },
        { type: 'Ride', id: 'SEARCH' },
      ],
    }),
  }),
});

export const {
  useSearchRidesQuery,
  useLazySearchRidesQuery,
  useGetRidesQuery,
  useGetRideQuery,
  useCreateRideMutation,
  useUpdateRideMutation,
  useDeleteRideMutation,
} = ridesApi;
