import type { MapCoordinate } from './map.types';
import type { RideType } from './ride-result.types';

export type TripCompletedPaymentId = 'wallet' | 'upi' | 'cash';

export interface TripCompletedPaymentOption {
  id: TripCompletedPaymentId;
  label: string;
  subtitle: string;
  icon: 'wallet' | 'business' | 'cash';
}

export interface TripCompletedFareLine {
  label: string;
  amountLabel: string;
}

export interface TripCompletedData {
  rideId: string;
  rideType: RideType;
  dateLabel: string;
  statusLabel: string;
  pickupTitle: string;
  pickupAddress: string;
  dropoffTitle: string;
  dropoffAddress: string;
  driverName: string;
  driverMeta: string;
  amountLabel: string;
  totalAmount: number;
  distanceLabel: string;
  fareLines: TripCompletedFareLine[];
  pickup: MapCoordinate;
  dropoff: MapCoordinate;
}
