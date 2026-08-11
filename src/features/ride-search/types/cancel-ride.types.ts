export type CancelReasonId =
  | 'plan-changed'
  | 'wait-time'
  | 'another-ride'
  | 'driver-not-responding'
  | 'other';

export interface CancelReasonOption {
  id: CancelReasonId;
  label: string;
}

export interface CancelRideSummary {
  rideId: string;
  rideType: 'regular' | 'assured';
  routeLabel: string;
  pickupLabel: string;
  dropoffLabel: string;
  dateLabel: string;
  timeLabel: string;
}
