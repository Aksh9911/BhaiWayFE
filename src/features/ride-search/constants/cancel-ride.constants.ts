import type { CancelReasonOption, CancelRideSummary, RideType } from '../types';

export const CANCEL_RIDE_SCREEN = {
  title: 'Cancel Ride',
  heading: 'Are you sure you want to cancel your ride?',
  subtitleAssured: 'Your Assured ride is confirmed and the driver is on their way.',
  subtitleRegular: 'Your Regular ride is confirmed. You can cancel before the trip starts.',
  rideDetailsLabel: 'Ride Details',
  assuredBadge: 'Assured',
  regularBadge: 'Regular',
  policyTitle: 'Cancellation Policy',
  policyAssuredPrefix: 'Note: This is an ',
  policyAssuredHighlight: 'Assured Ride',
  policyAssuredMid: '. The booking fee of ',
  policyAssuredFee: '50',
  policyAssuredSuffix: ' is non-refundable upon cancellation.',
  policyRegular:
    'Note: This is a Regular Ride. No Assured booking fee applies. Refunds follow BhaiWay cancellation policy based on timing.',
  reasonTitle: 'Reason for Cancellation',
  otherPlaceholder: 'Please tell us more (optional)',
  confirmLabel: 'Confirm Cancellation',
  confirmingLabel: 'Processing...',
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
    pickupLabel: pickup,
    dropoffLabel: dropoff,
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
