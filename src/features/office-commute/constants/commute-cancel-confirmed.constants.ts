export const COMMUTE_CANCEL_CONFIRMED_SCREEN = {
  title: 'Ride Status',
  heading: 'Ride Cancelled Successfully',
  subtitle:
    'Your office commute booking has been cancelled. Any applicable refunds will be processed as per BhaiWay policy.',
  homeLabel: 'Back to Home',
  bookAgainLabel: 'Book Another Commute',
} as const;

export const getCommuteCancelConfirmedPath = () => ({
  pathname: '/office-commute/cancel-confirmed' as const,
});
