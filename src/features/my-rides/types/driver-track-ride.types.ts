export interface DriverTrackConfirmedPassenger {
  id: string;
  name: string;
  subtitle: string;
  verified: boolean;
  avatarUri: string;
  seatsBooked: number;
}

export interface DriverTrackPendingRequest {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  ridesCount: number;
  idVerified: boolean;
  avatarUri: string;
  seatsBooked: number;
}

export interface DriverTrackRideSummary {
  rideId: string;
  listingId: string;
  routeTitle: string;
  dateLabel: string;
  seatsConfirmed: number;
  seatsTotal: number;
  confirmed: readonly DriverTrackConfirmedPassenger[];
  pending: readonly DriverTrackPendingRequest[];
}
