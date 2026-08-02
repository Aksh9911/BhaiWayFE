import type { RideType } from './ride-result.types';
import type { CoPassenger } from './review-booking.types';

export type RideDetailsMode = 'preview' | 'booked';

export interface RideDetailsLocation {
  title: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface RideDetailsDriver {
  name: string;
  company: string;
  rating: number;
  verified: boolean;
  vehicleColor: string;
  vehicleModel: string;
  plateNumber: string;
  avatarUri?: string;
}

export interface RideDetailsFare {
  rideFare: number;
  total: number;
}

export interface RideRule {
  id: string;
  label: string;
  icon: 'ban' | 'snow' | 'time' | 'bag' | 'people' | 'musical-notes' | 'paw' | 'checkmark-circle';
}

export interface RideDetailsData {
  rideId: string;
  rideType: RideType;
  dateTimeLabel: string;
  pickup: RideDetailsLocation;
  dropoff: RideDetailsLocation;
  driver: RideDetailsDriver;
  coPassengers: CoPassenger[];
  maxPassengers: number;
  seatsLeft: number;
  fare: RideDetailsFare;
  rules: RideRule[];
  distanceLabel: string;
  durationLabel: string;
}
