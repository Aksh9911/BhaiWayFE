import type { ButtonVariant } from '@/shared/components/Button/Button.types';

export type OutstationRideTypeId = 'regular' | 'assured';

export type LocationFieldType = 'origin' | 'destination';

export interface OutstationRideTypeOption {
  id: OutstationRideTypeId;
  title: string;
  icon: string;
  iconVariant: 'muted' | 'dark';
  description: string;
  buttonLabel: string;
  buttonVariant: ButtonVariant;
  highlighted?: boolean;
  badge?: string;
  note?: string;
}

export interface SelectedLocation {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface PublishRideFormValues {
  rideType: OutstationRideTypeId;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  maxTwoInBackSeat: boolean;
  availableSeats: number;
  womenOnly: boolean;
  pricePerSeat: string;
}

export type RidePreferenceId = 'noSmoking' | 'noPets' | 'luggage' | 'music';

export interface PublishRidePreferences {
  noSmoking: boolean;
  noPets: boolean;
  luggage: boolean;
  music: boolean;
}

export interface PublishRideVehicleOption {
  id: string;
  name: string;
  plateNumber: string;
  icon: 'car' | 'car-sport';
}

export interface PublishRideDraft extends PublishRideFormValues {
  originLocation: SelectedLocation | null;
  destinationLocation: SelectedLocation | null;
  preferences: PublishRidePreferences;
  notes: string;
  selectedVehicleId: string | null;
  /** Assured rides only. */
  promoCode: string;
  promoApplied: boolean;
}
