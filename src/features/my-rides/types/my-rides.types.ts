export type MyRidesTab = 'upcoming' | 'past';

export interface MyRidesCoordinate {
  latitude: number;
  longitude: number;
}

export interface UpcomingRidePeer {
  name: string;
  vehicleLabel: string;
  plateNumber: string;
  avatarUri: string;
  verified: boolean;
}

/** @deprecated Use UpcomingRidePeer */
export type UpcomingRideDriver = UpcomingRidePeer;

export interface UpcomingRideSummary {
  id: string;
  dateLabel: string;
  title: string;
  assured: boolean;
  otp: string;
  pickupLabel: string;
  dropoffLabel: string;
  pickup: MyRidesCoordinate;
  dropoff: MyRidesCoordinate;
  /** @deprecated Prefer live MapView route from pickup/dropoff */
  mapImageUri?: string;
  /** Driver when riding; lead passenger when driving. */
  peer: UpcomingRidePeer;
  /** @deprecated Prefer peer */
  driver: UpcomingRidePeer;
}

export interface HistoryRideItem {
  id: string;
  title: string;
  routeLabel: string;
  dateLabel: string;
  statusLabel: string;
  pickupLabel: string;
  dropoffLabel: string;
  pickup: MyRidesCoordinate;
  dropoff: MyRidesCoordinate;
}

/** @deprecated Prefer UpcomingRideSummary — kept for any residual imports. */
export type ActiveRideSummary = UpcomingRideSummary;
