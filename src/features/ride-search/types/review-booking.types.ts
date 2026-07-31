import type { RideType } from './ride-result.types';

export interface BookingLocation {
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface BookingDriver {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  totalRides: number;
  avatarUri?: string;
}

export interface CoPassenger {
  id: string;
  name: string;
  company: string;
  verified: boolean;
}

export interface BookingFareBreakdown {
  rideFare: number;
  platformFee: number;
  promoDiscount: number;
  assuredFee: number;
  total: number;
}

export interface ReviewBookingData {
  rideId: string;
  rideType: RideType;
  pickup: BookingLocation;
  dropoff: BookingLocation;
  distanceLabel: string;
  durationLabel: string;
  driver: BookingDriver;
  coPassengers: CoPassenger[];
  maxPassengers: number;
  promoCode: string;
  fare: BookingFareBreakdown;
}
