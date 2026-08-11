import type { RideBookingsSheetRow } from '@/DemoData';

import { bhaiwayApi } from './apiSlice';

export const bookingsApi = bhaiwayApi.injectEndpoints({
  endpoints: (build) => ({
    getBookings: build.query<{ bookings: RideBookingsSheetRow[]; total: number }, { mine?: boolean } | void>({
      query: (params) => ({
        url: '/bookings',
        params: { mine: params?.mine === false ? '0' : '1' },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.bookings.map((booking) => ({
                type: 'Booking' as const,
                id: booking.bookingId,
              })),
              { type: 'Booking' as const, id: 'LIST' },
            ]
          : [{ type: 'Booking', id: 'LIST' }],
    }),
    getBooking: build.query<{ booking: RideBookingsSheetRow }, string | number>({
      query: (bookingId) => `/bookings/${bookingId}`,
      providesTags: (_result, _error, bookingId) => [{ type: 'Booking', id: bookingId }],
    }),
    createBooking: build.mutation<
      { booking: RideBookingsSheetRow | null; bookingId: number },
      Record<string, unknown>
    >({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Booking', id: 'LIST' },
        { type: 'Ride', id: 'SEARCH' },
        { type: 'Ride', id: 'LIST' },
      ],
    }),
    updateBooking: build.mutation<
      { booking: RideBookingsSheetRow | null },
      { bookingId: string | number; body: Record<string, unknown> }
    >({
      query: ({ bookingId, body }) => ({
        url: `/bookings/${bookingId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Booking', id: arg.bookingId },
        { type: 'Booking', id: 'LIST' },
      ],
    }),
    cancelBooking: build.mutation<{ booking: RideBookingsSheetRow | null }, string | number>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, bookingId) => [
        { type: 'Booking', id: bookingId },
        { type: 'Booking', id: 'LIST' },
        { type: 'Ride', id: 'SEARCH' },
      ],
    }),
    acceptBooking: build.mutation<{ booking: RideBookingsSheetRow | null; status: string }, string | number>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/accept`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, bookingId) => [
        { type: 'Booking', id: bookingId },
        { type: 'Booking', id: 'LIST' },
        { type: 'Ride', id: 'LIST' },
      ],
      async onQueryStarted(bookingId, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          bookingsApi.util.updateQueryData('getBooking', bookingId, (draft) => {
            if (draft.booking) {
              draft.booking = { ...draft.booking, status: 'confirmed' };
            }
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),
    rejectBooking: build.mutation<{ booking: RideBookingsSheetRow | null; status: string }, string | number>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/reject`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, bookingId) => [
        { type: 'Booking', id: bookingId },
        { type: 'Booking', id: 'LIST' },
        { type: 'Ride', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useAcceptBookingMutation,
  useRejectBookingMutation,
} = bookingsApi;
