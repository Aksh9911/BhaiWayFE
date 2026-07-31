import type { ServiceCardVariant } from '@/features/home/types';

import type { MapCoordinate } from './map.types';

export type RideSearchMode = ServiceCardVariant;

export type PassengerCount = 1 | 2 | 3;

export type LocationFieldType = 'origin' | 'destination';

export interface AddressLevels {
  /** Street / building / precise locality when zoomed in. */
  precise?: string;
  /** Neighbourhood / sector / area. */
  area?: string;
  /** City / town. */
  city?: string;
  /** District / county / subregion. */
  district?: string;
}

export interface SelectedDestination {
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
  /** Optional place perimeter (e.g. area / precise address viewport). */
  boundary?: MapCoordinate[];
  /** Hierarchy used to pick a label based on map zoom. */
  addressLevels?: AddressLevels;
}

export type SelectedLocation = SelectedDestination;

export interface PlaceViewport {
  northeast: MapCoordinate;
  southwest: MapCoordinate;
}

export interface RideSearchFormValues {
  origin: SelectedLocation | null;
  passengers: PassengerCount;
  journeyDate: Date | null;
  journeyTime: Date | null;
  destination: SelectedLocation | null;
}

export interface RouteInfo {
  distanceKm: number;
  durationMinutes: number;
  distanceLabel: string;
  durationLabel: string;
}

export interface SavedPlace {
  id: string;
  label: string;
  emoji: string;
  location: SelectedLocation;
}

export interface RideSearchModeConfig {
  mode: RideSearchMode;
  title: string;
  subtitle: string;
  actionLabel: string;
  defaultOrigin: string;
  destinationPlaceholder: string;
  originPlaceholder?: string;
  originLabel?: string;
  destinationLabel?: string;
  showTimePicker?: boolean;
  showPassengers?: boolean;
  verifyBanner?: {
    title: string;
    body: string;
    actionLabel: string;
  };
  recentVariant?: 'list' | 'cards';
  emptyRecentLabel?: string;
}

export interface RecentSearchItem {
  id: string;
  origin: string;
  destination: string;
  dateLabel: string;
  originLocation?: SelectedLocation;
  destinationLocation?: SelectedLocation;
}

export interface PassengerOption {
  value: PassengerCount;
  label: string;
}

export interface PlacesAutocompletePrediction {
  placeId: string;
  placeName: string;
  address: string;
}
