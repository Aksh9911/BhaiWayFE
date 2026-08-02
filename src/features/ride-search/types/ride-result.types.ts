export type RideResultFilterId = 'regular' | 'assured';

export type RideResultSortId =
  | 'price-asc'
  | 'price-desc'
  | 'departure'
  | 'rating'
  | 'duration';

export type RideType = 'regular' | 'assured';

export type SeatUrgency = 'available' | 'limited' | 'last';

export interface RideDriver {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  yearsDriving: number;
  avatarUri?: string;
}

export interface RidePreference {
  id: string;
  label: string;
  icon: string;
}

export interface RideFeature {
  id: string;
  label: string;
  icon: string;
}

export interface RideResultItem {
  id: string;
  rideType: RideType;
  driver: RideDriver;
  price: number;
  originalPrice?: number;
  departureTime: string;
  carModel: string;
  seatsLeft: number;
  ac: boolean;
  luggage: string;
  originCity: string;
  destinationCity: string;
  distanceKm: number;
  durationMinutes: number;
  durationLabel: string;
  preferences: RidePreference[];
  features: RideFeature[];
}

export interface RideSearchSummary {
  originCity: string;
  destinationCity: string;
  dateLabel: string;
  passengers: number;
  passengerLabel: string;
}

export interface RideResultFilterOption {
  id: RideResultFilterId;
  label: string;
}

export interface RideResultSortOption {
  id: RideResultSortId;
  label: string;
}
