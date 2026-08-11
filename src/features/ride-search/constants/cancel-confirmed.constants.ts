import type { RideType } from '../types';

export const CANCEL_CONFIRMED_SCREEN = {
  title: 'Ride Status',
  heading: 'Ride Cancelled Successfully',
  subtitleAssured:
    'Your Assured booking has been cancelled. The 50 Assured booking fee is non-refundable as per policy.',
  subtitleRegular:
    'Your Regular booking has been cancelled. Any applicable refunds will be processed as per BhaiWay policy.',
  bookNewRideLabel: 'Book a New Ride',
} as const;

export const getCancelConfirmedPath = (params?: { rideType?: RideType }) => ({
  pathname: '/ride-search/cancel-confirmed' as const,
  params: {
    rideType: params?.rideType ?? 'regular',
  },
});
