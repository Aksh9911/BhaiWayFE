import type { MapCoordinate } from './map.types';
import type { RideType } from './ride-result.types';

export interface OngoingTripDriver {
  name: string;
  rating: number;
  ridesCountLabel: string;
  vehicleLabel: string;
  plateNumber: string;
  avatarUri?: string;
}

export interface OngoingTripData {
  rideId: string;
  rideType: RideType;
  dropoffEtaLabel: string;
  remainingLabel: string;
  estimatedFareLabel: string;
  driver: OngoingTripDriver;
  pickup: MapCoordinate;
  dropoff: MapCoordinate;
}
