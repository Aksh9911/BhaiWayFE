import { ROUTES } from '@/config';
import type { AppMode } from '@/store';

export const CANCEL_UPCOMING_RIDE_SCREEN = {
  title: 'Cancel Ride',
  heading: 'Cancel this ride?',
  subtitleRiding:
    'Are you sure you want to cancel your upcoming ride? This action cannot be undone.',
  subtitleDriving:
    'Are you sure you want to cancel this published ride? Booked riders will be notified.',
  rideDetailsLabel: 'Ride details',
  keepLabel: 'Keep Ride',
  confirmLabel: 'Yes, Cancel Ride',
  noteLabel: 'Note',
  noteRiding: 'Any paid amount will be refunded as per cancellation policy.',
  noteDriving: 'Riders with confirmed seats will receive a cancellation update.',
} as const;

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
}) => ({
  pathname: ROUTES.myRidesCancel,
  params: {
    rideId: params.rideId,
    dateLabel: params.dateLabel,
    title: params.title,
    pickupLabel: params.pickupLabel,
    dropoffLabel: params.dropoffLabel,
    mode: params.mode,
  },
});
