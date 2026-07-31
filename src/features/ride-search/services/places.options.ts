import type { MapCoordinate } from '../types';

export interface SearchPlacesOptions {
  signal?: AbortSignal;
  sessionToken?: string;
}

export interface PlacesConfigStatus {
  hasApiKey: boolean;
  placesKeyConfigured: boolean;
  mapsKeyConfigured: boolean;
  keySourceHint: string;
  requiredApis: readonly string[];
}

export type { MapCoordinate };
