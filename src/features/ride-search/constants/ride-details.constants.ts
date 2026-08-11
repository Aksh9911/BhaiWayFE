import type { RideDetailsData, RideDetailsMode, RideRule, RideType } from '../types';
import { formatBhaiWayCoins } from '@/shared/utils';

export const RIDE_DETAILS_SCREEN = {
  title: 'Ride Details',
  pickupLabel: 'Pickup',
  dropoffLabel: 'Drop-off',
  coPassengersLabel: 'Co-Passengers',
  seatsLeftLabel: 'seat left',
  seatsLeftPluralLabel: 'seats left',
  fareTitle: 'Fare Details',
  rideFareLabel: 'Ride Fare',
  totalLabel: 'Total Amount',
  rulesTitle: 'Ride Rules',
  rulesSubtitle: 'Please follow these guidelines for a smooth trip.',
  bookLabel: 'Book Ride',
  contactDriverLabel: 'Contact Driver',
  cancelLabel: 'Cancel Ride',
  verifiedAtPrefix: 'Verified at',
  cancelConfirmTitle: 'Cancel Ride',
  cancelConfirmMessage: 'Are you sure you want to cancel this ride?',
  cancelConfirmAction: 'Yes, Cancel',
  keepRideAction: 'Keep Ride',
  previewFooterHint: 'Review fare and rules, then book your seat.',
} as const;

export const DEFAULT_RIDE_RULES: readonly RideRule[] = [
  { id: 'no-smoking', label: 'No smoking inside the vehicle', icon: 'ban' },
  { id: 'ac-on', label: 'AC will be available throughout the ride', icon: 'snow' },
  { id: 'on-time', label: 'Please arrive 5 minutes before departure', icon: 'time' },
  { id: 'luggage', label: '1 cabin bag per passenger allowed', icon: 'bag' },
  { id: 'seats', label: 'Seat belts must be worn at all times', icon: 'checkmark-circle' },
  { id: 'no-pets', label: 'Pets are not allowed', icon: 'paw' },
] as const;

const CO_PASSENGERS = [
  { id: 'cp-as', name: 'Amit S.', company: 'Google', verified: true },
  { id: 'cp-ps', name: 'Priya S.', company: 'Microsoft', verified: true },
] as const;

export const getRideDetailsMock = (params: {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
  price?: number;
  distanceLabel?: string;
  durationLabel?: string;
}): RideDetailsData => {
  const rideFare = params.price != null && params.price > 0 ? params.price : 240;
  const pickupTitle = shortName(params.origin) || 'Saket';
  const dropoffTitle = shortName(params.destination) || 'Cyber City';

  return {
    rideId: params.rideId,
    rideType: params.rideType,
    dateTimeLabel: 'Oct 24, 2023 | 08:45 AM',
    pickup: {
      title: pickupTitle,
      address: params.origin || 'Select Citywalk, New Delhi',
      latitude: params.originLat ?? 28.5245,
      longitude: params.originLng ?? 77.2066,
    },
    dropoff: {
      title: dropoffTitle,
      address: params.destination || 'Building 10C, DLF Phase 2, Gurgaon',
      latitude: params.destinationLat ?? 28.4946,
      longitude: params.destinationLng ?? 77.0888,
    },
    driver: {
      name: params.driverName || 'Vikram K.',
      company: 'Altus Mindstream',
      rating: 4.9,
      verified: true,
      vehicleColor: 'White',
      vehicleModel: params.carModel || 'Honda City',
      plateNumber: 'DL 3C AB 1234',
    },
    coPassengers: [...CO_PASSENGERS],
    maxPassengers: 3,
    seatsLeft: 1,
    fare: {
      rideFare,
      total: rideFare,
    },
    rules: [...DEFAULT_RIDE_RULES],
    distanceLabel: params.distanceLabel || '12.4 km',
    durationLabel: params.durationLabel || '24 mins',
  };
};

export const formatRideDetailsAmount = (value: number): string =>
  formatBhaiWayCoins(value, { spaced: false, minimumFractionDigits: 2 });

export const getRideDetailsPath = (params: {
  rideId: string;
  rideType: RideType;
  mode?: RideDetailsMode;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
  distanceLabel?: string;
  durationLabel?: string;
  dateLabel?: string;
  departureTime?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}) => ({
  pathname: '/ride-search/ride-details' as const,
  params: {
    rideId: params.rideId,
    rideType: params.rideType,
    mode: params.mode ?? 'preview',
    origin: params.origin ?? '',
    destination: params.destination ?? '',
    driverName: params.driverName ?? '',
    carModel: params.carModel ?? '',
    price: params.price != null ? String(params.price) : '',
    distanceLabel: params.distanceLabel ?? '',
    durationLabel: params.durationLabel ?? '',
    dateLabel: params.dateLabel ?? '',
    departureTime: params.departureTime ?? '',
    originLat: params.originLat != null ? String(params.originLat) : '',
    originLng: params.originLng != null ? String(params.originLng) : '',
    destinationLat: params.destinationLat != null ? String(params.destinationLat) : '',
    destinationLng: params.destinationLng != null ? String(params.destinationLng) : '',
  },
});

const shortName = (value?: string): string => {
  if (!value) {
    return '';
  }
  return value.split(',')[0]?.trim() || value;
};
