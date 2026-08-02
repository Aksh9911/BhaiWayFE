export interface DriverTripCompletedPassenger {
  id: string;
  name: string;
  avatarUri: string;
  fareLabel: string;
}

export interface DriverTripCompletedFareLine {
  label: string;
  amountLabel: string;
}

export interface DriverTripCompletedCoordinate {
  latitude: number;
  longitude: number;
}

export interface DriverTripCompletedSummary {
  rideId: string;
  dateLabel: string;
  statusLabel: string;
  pickupTitle: string;
  pickupAddress: string;
  dropoffTitle: string;
  dropoffAddress: string;
  distanceLabel: string;
  earningsLabel: string;
  earningsAmount: number;
  passengers: readonly DriverTripCompletedPassenger[];
  fareLines: readonly DriverTripCompletedFareLine[];
  pickup: DriverTripCompletedCoordinate;
  dropoff: DriverTripCompletedCoordinate;
}
