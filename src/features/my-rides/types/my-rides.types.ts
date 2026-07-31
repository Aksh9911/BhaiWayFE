export type MyRidesTab = 'upcoming' | 'past';

export interface UpcomingRideDriver {
  name: string;
  vehicleLabel: string;
  plateNumber: string;
  avatarUri: string;
  verified: boolean;
}

export interface UpcomingRideSummary {
  id: string;
  dateLabel: string;
  title: string;
  assured: boolean;
  otp: string;
  pickupLabel: string;
  dropoffLabel: string;
  mapImageUri: string;
  driver: UpcomingRideDriver;
}

export interface HistoryRideItem {
  id: string;
  title: string;
  routeLabel: string;
  dateLabel: string;
  statusLabel: string;
}

/** @deprecated Prefer UpcomingRideSummary — kept for any residual imports. */
export type ActiveRideSummary = UpcomingRideSummary;
