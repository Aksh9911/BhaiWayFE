import { ROUTES } from '@/config';

import type { LocationFieldType, OutstationRideTypeId, PublishRideDraft } from '../types';

export const DEFAULT_PUBLISH_DRAFT: PublishRideDraft = {
  rideType: 'regular',
  origin: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  maxTwoInBackSeat: false,
  availableSeats: 1,
  womenOnly: false,
  pricePerSeat: '0.00',
  originLocation: null,
  destinationLocation: null,
};

export const PUBLISH_RIDE_SCREEN = {
  title: 'Publish Carpool Ride',
  intro: {
    title: 'Publish Carpool Ride',
    subtitle: 'Fill in the details to share your journey.',
  },
} as const;

export const SELECT_LOCATION_SCREEN = {
  origin: {
    title: 'Starting point',
    mapLabel: 'Set starting point',
    confirmLabel: 'Confirm Starting Point',
    placeholder: 'Leaving from',
  },
  destination: {
    title: 'Destination',
    mapLabel: 'Set destination',
    confirmLabel: 'Confirm Destination',
    placeholder: 'Going to',
  },
  hint: 'Drag the map to refine the exact point',
  searchPlaceholder: 'Search for a place',
} as const;

export const PUBLISH_SEAT_LIMITS = {
  min: 1,
  max: 6,
} as const;

export const getPublishRidePath = (rideType: OutstationRideTypeId) => ({
  pathname: ROUTES.offerRidePublish,
  params: { rideType },
});

export const getSelectLocationPath = (field: LocationFieldType) => ({
  pathname: ROUTES.offerRideLocation,
  params: { field },
});
