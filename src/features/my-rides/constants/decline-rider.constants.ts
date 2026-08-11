import { ROUTES } from '@/config';

export type DeclineRiderReasonId =
  | 'seats-filled'
  | 'route-mismatch'
  | 'plan-change'
  | 'low-rating'
  | 'other';

export interface DeclineRiderReasonOption {
  id: DeclineRiderReasonId;
  label: string;
}

export const DECLINE_RIDER_SCREEN = {
  brandName: 'BhaiWay',
  title: 'Decline Request',
  subtitle: (name: string) => `Please select a reason for declining ${name}'s request.`,
  reasonsLabel: 'Reason for Decline',
  notesLabel: 'Tell us more (optional)',
  notesPlaceholder: 'Add additional details...',
  confirmLabel: 'Confirm Decline',
  goBackLabel: 'Go Back',
  selectReasonMessage: 'Please select a reason before confirming.',
} as const;

export const DECLINE_RIDER_REASONS: readonly DeclineRiderReasonOption[] = [
  { id: 'seats-filled', label: 'Seats already filled' },
  { id: 'route-mismatch', label: 'Route mismatch' },
  { id: 'plan-change', label: 'Change in plan' },
  { id: 'low-rating', label: 'Rider rating too low' },
  { id: 'other', label: 'Other' },
] as const;

export const getDeclineRiderPath = (params: {
  rideId: string;
  riderId: string;
  name: string;
}) => ({
  pathname: ROUTES.myRidesDeclineRider,
  params: {
    rideId: params.rideId,
    riderId: params.riderId,
    name: params.name,
  },
});
