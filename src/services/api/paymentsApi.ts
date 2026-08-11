import { bhaiwayApi } from './apiSlice';

export const paymentsApi = bhaiwayApi.injectEndpoints({
  endpoints: (build) => ({
    createPayment: build.mutation<
      { payment: Record<string, unknown> },
      { bookingId?: string | number; rideId?: string | number; amount: number; method?: string }
    >({
      query: (body) => ({
        url: '/payments',
        method: 'POST',
        body,
      }),
      invalidatesTags: [
        { type: 'Payment', id: 'LIST' },
        { type: 'Booking', id: 'LIST' },
        { type: 'Notification', id: 'LIST' },
      ],
    }),
  }),
});

export const { useCreatePaymentMutation } = paymentsApi;
