import type { RideDetailsData, RideType } from '../types';

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
  cancelLabel: 'Cancel Ride',
  verifiedAtPrefix: 'Verified at',
  cancelConfirmTitle: 'Cancel Ride',
  cancelConfirmMessage: 'Are you sure you want to cancel this ride?',
  cancelConfirmAction: 'Yes, Cancel',
  keepRideAction: 'Keep Ride',
} as const;

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
  };
};

export const formatRideDetailsAmount = (value: number): string =>
  `₹${value.toFixed(2)}`;

export const getRideDetailsPath = (params: {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}) => ({
  pathname: '/ride-search/ride-details' as const,
  params: {
    rideId: params.rideId,
    rideType: params.rideType,
    origin: params.origin ?? '',
    destination: params.destination ?? '',
    driverName: params.driverName ?? '',
    carModel: params.carModel ?? '',
    price: params.price != null ? String(params.price) : '',
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
