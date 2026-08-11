import { ROUTES } from '@/config';
import type { AppMode } from '@/store';

export type CancelRideReasonId =
  | 'plan-changed'
  | 'wait-time'
  | 'found-another'
  | 'driver-not-responding'
  | 'other';

export interface CancelRideReasonOption {
  id: CancelRideReasonId;
  label: string;
}

export const CANCEL_UPCOMING_RIDE_SCREEN = {
  title: 'Cancel Ride',
  heading: 'Are you sure you want to cancel your ride?',
  subtitleRiding: 'Your ride is currently confirmed and the driver is on their way.',
  subtitleDriving: 'Your ride is published. Confirmed riders will be notified if you cancel.',
  rideDetailsLabel: 'Ride Details',
  assuredBadge: 'Assured',
  regularBadge: 'Regular',
  scheduleIconLabel: 'Schedule',
  policyTitle: 'Cancellation Policy',
  policyAssured:
    'Note: This is an Assured Ride. The booking fee of 50 is non-refundable upon cancellation.',
  policyRegular:
    'Note: This is a Regular Ride. No Assured booking fee applies. Refunds follow BhaiWay cancellation policy based on timing.',
  policyDriving: 'Note: Riders with confirmed seats will receive a cancellation update.',
  reasonTitle: 'Reason for Cancellation',
  otherPlaceholder: 'Please tell us more (optional)',
  keepLabel: 'Keep Ride',
  confirmLabel: 'Confirm Cancellation',
  noteLabel: 'Note',
  noteRiding: 'Any paid amount will be refunded as per cancellation policy.',
  noteDriving: 'Riders with confirmed seats will receive a cancellation update.',
} as const;

export const CANCEL_RIDE_REASONS: readonly CancelRideReasonOption[] = [
  { id: 'plan-changed', label: 'Plan changed' },
  { id: 'wait-time', label: 'Wait time too long' },
  { id: 'found-another', label: 'Found another ride' },
  { id: 'driver-not-responding', label: 'Driver not responding' },
  { id: 'other', label: 'Other' },
] as const;

export const CANCEL_UPCOMING_CONFIRMED_SCREEN = {
  title: 'Ride Cancelled',
  heading: 'Ride cancelled',
  subtitleRiding: 'Your upcoming ride has been cancelled successfully.',
  subtitleDriving: 'Your published ride has been cancelled. Riders have been notified.',
  backLabel: 'Back to My Rides',
} as const;

export const getCancelUpcomingRidePath = (params: {
  rideId: string;
  dateLabel: string;
  title: string;
  pickupLabel: string;
  dropoffLabel: string;
  mode: AppMode;
  assured?: boolean;
}) => ({
  pathname: ROUTES.myRidesCancel,
  params: {
    rideId: params.rideId,
    dateLabel: params.dateLabel,
    title: params.title,
    pickupLabel: params.pickupLabel,
    dropoffLabel: params.dropoffLabel,
    mode: params.mode,
    assured: params.assured ? '1' : '0',
  },
});
