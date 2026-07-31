import type { MapCoordinate } from './map.types';
import type { RideType } from './ride-result.types';

export interface LiveTrackingDriver {
  name: string;
  vehicleLabel: string;
  plateNumber: string;
  rating: number;
  avatarUri?: string;
}

export interface LiveTrackingData {
  rideId: string;
  rideType: RideType;
  statusLabel: string;
  etaMinutes: number;
  startOtp: string;
  driver: LiveTrackingDriver;
  pickupLabel: string;
  pickupAddress: string;
  dropoffLabel: string;
  dropoffAddress: string;
  pickup: MapCoordinate;
  dropoff: MapCoordinate;
}
