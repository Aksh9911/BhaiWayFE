export type MyRidesTab = 'upcoming' | 'past';

/** How My Rides should render for the current product entry. */
export type MyRidesSurface = 'standard' | 'office-commute';

/** Role of the current user on a ride card (office commute can mix both). */
export type MyRidesRideRole = 'rider' | 'driver';

/** Driver outstation publish kind used across pickup → trip → earnings. */
export type DriverRideKind = 'regular' | 'assured';

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

/** Confirmed rider on a driver-published upcoming ride. */
export interface UpcomingRideRider {
  id: string;
  name: string;
  /** Optional workplace / note under the name. */
  subtitle?: string;
  /** Seats this rider booked (one rider can book multiple seats). */
  seatsBooked: number;
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
  /** Driver mode: confirmed riders shown under "Your Riders". */
  riders?: readonly UpcomingRideRider[];
  /**
   * Explicit card role. Used by office-commute My Rides to mix rider + driver cards.
   * When omitted, My Rides falls back to the global app mode.
   */
  role?: MyRidesRideRole;
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
  /** Used by office-commute My Rides to decide invoice vs driver trip details. */
  role?: MyRidesRideRole;
}

/** @deprecated Prefer UpcomingRideSummary — kept for any residual imports. */
export type ActiveRideSummary = UpcomingRideSummary;
