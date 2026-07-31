import type { RideResultFilterOption, RideResultItem } from '../types';

export const RIDE_RESULT_SCREEN = {
  title: 'Available Rides',
  emptyTitle: 'No Rides Available',
  emptySubtitle: 'Try changing the date or destination to find matching rides.',
  modifySearchLabel: 'Modify Search',
  refreshLabel: 'Refresh',
  bookLabel: 'Book Ride',
} as const;

export const RIDE_RESULT_FILTERS: readonly RideResultFilterOption[] = [
  { id: 'regular', label: 'Regular' },
  { id: 'assured', label: 'Assured' },
] as const;

export const MOCK_RIDE_RESULTS: readonly RideResultItem[] = [
  {
    id: 'ride-1',
    rideType: 'regular',
    driver: {
      id: 'driver-1',
      name: 'Rahul Sharma',
      rating: 4.8,
      verified: true,
      yearsDriving: 6,
    },
    price: 1200,
    originalPrice: 1450,
    departureTime: '08:00 AM',
    carModel: 'Honda City',
    seatsLeft: 2,
    ac: true,
    luggage: 'Medium',
    originCity: 'Bengaluru',
    destinationCity: 'Mumbai',
    distanceKm: 840,
    durationLabel: '12 hrs',
    preferences: [],
    features: [],
  },
  {
    id: 'ride-2',
    rideType: 'regular',
    driver: {
      id: 'driver-2',
      name: 'Priya Patel',
      rating: 4.9,
      verified: true,
      yearsDriving: 4,
    },
    price: 1350,
    departureTime: '09:30 AM',
    carModel: 'Toyota Innova',
    seatsLeft: 4,
    ac: true,
    luggage: 'Large',
    originCity: 'Bengaluru',
    destinationCity: 'Mumbai',
    distanceKm: 840,
    durationLabel: '11 hrs',
    preferences: [],
    features: [],
  },
  {
    id: 'ride-3',
    rideType: 'regular',
    driver: {
      id: 'driver-3',
      name: 'Amit Kumar',
      rating: 4.5,
      verified: true,
      yearsDriving: 8,
    },
    price: 1100,
    departureTime: '11:00 AM',
    carModel: 'Maruti Swift',
    seatsLeft: 1,
    ac: true,
    luggage: 'Small',
    originCity: 'Bengaluru',
    destinationCity: 'Mumbai',
    distanceKm: 840,
    durationLabel: '12 hrs',
    preferences: [],
    features: [],
  },
  {
    id: 'ride-4',
    rideType: 'assured',
    driver: {
      id: 'driver-4',
      name: 'Sneha Kapoor',
      rating: 5.0,
      verified: true,
      yearsDriving: 3,
    },
    price: 980,
    departureTime: '07:00 AM',
    carModel: 'Hyundai Creta',
    seatsLeft: 3,
    ac: true,
    luggage: 'Large',
    originCity: 'Bengaluru',
    destinationCity: 'Mumbai',
    distanceKm: 840,
    durationLabel: '11 hrs',
    preferences: [],
    features: [],
  },
];

export const getSeatUrgency = (seatsLeft: number): 'available' | 'limited' | 'last' => {
  if (seatsLeft <= 1) {
    return 'last';
  }
  if (seatsLeft <= 2) {
    return 'limited';
  }
  return 'available';
};

export const formatRidePrice = (value: number): string =>
  `₹${value.toLocaleString('en-IN')}`;

export const getRideResultPath = (params: {
  origin: string;
  destination: string;
  dateLabel: string;
  passengers: number;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}) => ({
  pathname: '/ride-search/result' as const,
  params: {
    origin: params.origin,
    destination: params.destination,
    dateLabel: params.dateLabel,
    passengers: String(params.passengers),
    originLat: params.originLat != null ? String(params.originLat) : '',
    originLng: params.originLng != null ? String(params.originLng) : '',
    destinationLat: params.destinationLat != null ? String(params.destinationLat) : '',
    destinationLng: params.destinationLng != null ? String(params.destinationLng) : '',
  },
});
