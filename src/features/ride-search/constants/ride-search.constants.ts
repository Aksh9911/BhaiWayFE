import type {
  RecentSearchItem,
  RideSearchMode,
  RideSearchModeConfig,
  SavedPlace,
} from '../types';

export const RIDE_SEARCH_PASSENGER_LIMITS = {
  min: 1,
  max: 6,
} as const;

export const DEFAULT_PASSENGER_COUNT = RIDE_SEARCH_PASSENGER_LIMITS.min;

export const RIDE_SEARCH_MODE_CONFIG: Record<RideSearchMode, RideSearchModeConfig> = {
  outstation: {
    mode: 'outstation',
    title: 'Find Ride',
    subtitle: 'Where are you going today?',
    actionLabel: 'Search Ride',
    defaultOrigin: 'HSR Layout, Bengaluru',
    destinationPlaceholder: 'Destination',
  },
  office: {
    mode: 'office',
    title: 'Find Your Commute',
    subtitle: 'Secure and reliable office rides for your team.',
    actionLabel: 'Search Rides',
    defaultOrigin: 'HSR Layout, Bengaluru',
    originLabel: 'Pickup Location',
    destinationLabel: 'Drop-off Location',
    originPlaceholder: 'Enter office or home',
    destinationPlaceholder: 'Where are you heading?',
    showTimePicker: true,
    showPassengers: false,
    recentVariant: 'cards',
    emptyRecentLabel: 'No recent commute searches yet.',
    verifyBanner: {
      title: 'Identity Verified Rides',
      body: 'Upgrade your trust score by verifying your employee ID for faster commute matching.',
      actionLabel: 'Verify Now',
    },
  },
  publish: {
    mode: 'publish',
    title: 'Publish Office Commute',
    subtitle: 'Offer your empty seats to colleagues on your office route.',
    actionLabel: 'Publish Ride',
    defaultOrigin: 'HSR Layout, Bengaluru',
    destinationPlaceholder: 'Office destination',
  },
};

export const RECENT_SEARCHES: readonly RecentSearchItem[] = [];

export const SAVED_PLACES: readonly SavedPlace[] = [
  {
    id: 'saved-home',
    label: 'Home',
    emoji: '🏠',
    location: {
      placeName: 'Home',
      address: 'HSR Layout, Bengaluru, Karnataka, India',
      latitude: 12.9121,
      longitude: 77.6446,
    },
  },
  {
    id: 'saved-work',
    label: 'Work',
    emoji: '💼',
    location: {
      placeName: 'Work',
      address: 'Embassy Tech Village, Outer Ring Road, Bengaluru, India',
      latitude: 12.9304,
      longitude: 77.6931,
    },
  },
  {
    id: 'saved-favourite',
    label: 'Favourite',
    emoji: '⭐',
    location: {
      placeName: 'Kempegowda Airport',
      address: 'Kempegowda International Airport, Bengaluru, India',
      latitude: 13.1986,
      longitude: 77.7066,
    },
  },
];

/** Average speed used to estimate travel time from straight-line distance. */
export const ROUTE_AVERAGE_SPEED_KMPH = 45;

/** Minimum straight-line gap between start and destination for office commute. */
export const MIN_OFFICE_COMMUTE_DISTANCE_KM = 1.5;

/**
 * Minimum straight-line gap for outstation / Find Ride.
 * `0` = no minimum distance between starting point and destination.
 */
export const MIN_OUTSTATION_DISTANCE_KM = 0;

export const SELECT_DESTINATION_SCREEN = {
  title: 'Destination',
  searchPlaceholder: 'Search destination',
  emptyTitle: 'Search destinations',
  emptySubtitle: 'Start typing to see place suggestions.',
  mapLabel: 'Set destination',
  confirmLabel: 'Confirm Destination',
  hint: 'Drag the map to refine the exact point',
} as const;

export const SELECT_ORIGIN_SCREEN = {
  title: 'Starting point',
  searchPlaceholder: 'Search starting point',
  emptyTitle: 'Search starting points',
  emptySubtitle: 'Start typing to see place suggestions.',
  mapLabel: 'Set starting point',
  confirmLabel: 'Confirm Starting Point',
  hint: 'Drag the map to refine the exact point',
} as const;

export const getLocationPickerCopy = (field: 'origin' | 'destination') =>
  field === 'origin' ? SELECT_ORIGIN_SCREEN : SELECT_DESTINATION_SCREEN;

export const getSelectLocationPath = (field: 'origin' | 'destination') => ({
  pathname: '/ride-search/destination' as const,
  params: { field },
});

export const DEFAULT_MAP_COORDINATE = {
  latitude: 28.6315,
  longitude: 77.2167,
} as const;

export const DEFAULT_MAP_DELTA = {
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
} as const;

/** Tight street-level zoom used when the user taps current location. */
export const CURRENT_LOCATION_MAP_DELTA = {
  latitudeDelta: 0.005,
  longitudeDelta: 0.005,
} as const;

export const getPassengerLabel = (count: number): string =>
  count === 1 ? '1 Passenger' : `${count} Passengers`;
