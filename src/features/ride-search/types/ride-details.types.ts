import type { CoPassenger, RideType } from '../types';

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
}
