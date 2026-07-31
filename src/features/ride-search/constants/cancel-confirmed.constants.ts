export const CANCEL_CONFIRMED_SCREEN = {
  title: 'Ride Status',
  heading: 'Ride Cancelled Successfully',
  subtitle:
    'Your booking has been cancelled as requested. Any applicable refunds will be processed as per our policy.',
  bookNewRideLabel: 'Book a New Ride',
} as const;

export const getCancelConfirmedPath = () => ({
  pathname: '/ride-search/cancel-confirmed' as const,
});
