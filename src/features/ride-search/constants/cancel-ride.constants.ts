import type { CancelReasonOption, CancelRideSummary, RideType } from '../types';

export const CANCEL_RIDE_SCREEN = {
  title: 'Cancel Ride',
  heading: 'Why do you need to cancel?',
  subtitle: 'Your feedback helps us improve the community experience.',
  rideDetailsLabel: 'Ride Details',
  reasonLabel: 'Select a reason',
  commentsLabel: 'Tell us more (optional)',
  commentsPlaceholder: 'Share more details about your cancellation...',
  confirmLabel: 'Confirm Cancellation',
  confirmingLabel: 'Processing...',
  confirmedLabel: 'Cancellation Confirmed',
  goBackLabel: 'Go Back',
  assuredNotePrefix: 'Note:',
  assuredNote:
    'You have booked an assured ride. If you cancel this ride, the booking amount will not be refunded!',
  reasonRequiredTitle: 'Reason required',
  reasonRequiredMessage: 'Please select a reason for cancellation.',
} as const;

export const CANCEL_REASONS: readonly CancelReasonOption[] = [
  { id: 'plan-changed', label: 'Plan changed' },
  { id: 'wait-time', label: 'Wait time too long' },
  { id: 'another-ride', label: 'Found another ride' },
  { id: 'driver-not-responding', label: 'Driver not responding' },
  { id: 'other', label: 'Other' },
] as const;

export const getCancelRideSummary = (params: {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
}): CancelRideSummary => {
  const pickup = shortName(params.origin) || 'Saket';
  const dropoff = shortName(params.destination) || 'Cyber City';

  return {
    rideId: params.rideId,
    rideType: params.rideType,
    routeLabel: `${pickup} to ${dropoff}`,
    dateLabel: 'Oct 24, 2023',
    timeLabel: '08:45 AM',
  };
};

export const getCancelRidePath = (params: {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
}) => ({
  pathname: '/ride-search/cancel-ride' as const,
  params: {
    rideId: params.rideId,
    rideType: params.rideType,
    origin: params.origin ?? '',
    destination: params.destination ?? '',
  },
});

const shortName = (value?: string): string => {
  if (!value) {
    return '';
  }
  return value.split(',')[0]?.trim() || value;
};
