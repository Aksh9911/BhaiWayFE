import type { DriverRideKind } from './my-rides.types';

export interface TripDetailsEarningsLine {
  id: string;
  name: string;
  initials: string;
  tag: string;
  amountLabel: string;
  kind: 'passenger' | 'bonus';
}

export interface TripDetailsVehicle {
  name: string;
  plateNumber: string;
}

export interface TripDetailsSummary {
  rideId: string;
  rideType: DriverRideKind;
  origin: string;
  destination: string;
  dateLabel: string;
  durationLabel: string;
  distanceLabel: string;
  statusLabel: string;
  vehicle: TripDetailsVehicle;
  earningsLines: readonly TripDetailsEarningsLine[];
  totalEarningsLabel: string;
  mapImageUri: string;
  avatarUri: string;
}
