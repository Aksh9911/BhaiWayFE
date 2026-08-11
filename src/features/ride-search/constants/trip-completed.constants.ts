import type {
  TripCompletedData,
  TripCompletedPaymentOption,
  RideType,
} from '../types';
import { DEFAULT_MAP_COORDINATE } from './ride-search.constants';
import { formatBhaiWayCoins } from '@/shared/utils';

export const TRIP_COMPLETED_SCREEN = {
  heading: 'Trip Completed!',
  subtitle: "Thank you for riding with BhaiWay. Here's your journey overview.",
  summaryLabel: 'Trip Summary',
  statusLabel: 'COMPLETED',
  pickupLabel: 'PICKUP',
  destinationLabel: 'DESTINATION',
  driverLabel: 'DRIVER',
  amountLabel: 'AMOUNT TO PAY',
  paymentTitle: 'Payment Method',
  payCta: 'Pay Now & Rate Driver',
  secureNote: 'Secure transaction processed by BhaiWay Pay',
  paidTitle: 'Payment Successful',
  paidMessage: 'Thank you! You can rate your driver next.',
} as const;

export const TRIP_COMPLETED_PAYMENT_OPTIONS: readonly TripCompletedPaymentOption[] = [
  {
    id: 'wallet',
    label: 'BhaiWay Coins Wallet',
    subtitle: 'Balance: 1,450',
    icon: 'wallet',
  },
  {
    id: 'upi',
    label: 'UPI (Google Pay, PhonePe)',
    subtitle: 'Instant bank transfer',
    icon: 'business',
  },
  {
    id: 'cash',
    label: 'Pay Driver in BhaiWay Coins',
    subtitle: 'Settle the driver directly in coins',
    icon: 'cash',
  },
] as const;

export const getTripCompletedMock = (params: {
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
}): TripCompletedData => {
  const total = params.price != null && Number.isFinite(params.price) ? params.price : 240;
  const pickupTitle = shortName(params.origin) || 'Saket';
  const dropoffTitle = shortName(params.destination) || 'Cyber City';
  const driver = params.driverName || 'Rajesh Kumar';
  const car = params.carModel || 'Swift Dzire';

  return {
    rideId: params.rideId,
    rideType: params.rideType,
    dateLabel: 'Oct 24, 2023',
    statusLabel: TRIP_COMPLETED_SCREEN.statusLabel,
    pickupTitle,
    pickupAddress: params.origin?.includes(',')
      ? params.origin
      : 'Metro Station Gate 2, New Delhi',
    dropoffTitle,
    dropoffAddress: params.destination?.includes(',')
      ? params.destination
      : 'DLF Phase 3, Gurugram',
    driverName: driver,
    driverMeta: `4.9 • ${car} (DL 1C AB 1234)`,
    amountLabel: formatBhaiWayCoins(Math.round(total), { spaced: false }),
    totalAmount: total,
    distanceLabel: '18.4 km total distance',
    fareLines: [
      { label: 'Base Fare', amountLabel: formatBhaiWayCoins(180, { spaced: false }) },
      { label: 'Distance (18.4 km)', amountLabel: formatBhaiWayCoins(45, { spaced: false }) },
      { label: 'Taxes & Fees', amountLabel: formatBhaiWayCoins(15, { spaced: false }) },
    ],
    pickup: {
      latitude: params.originLat ?? DEFAULT_MAP_COORDINATE.latitude,
      longitude: params.originLng ?? DEFAULT_MAP_COORDINATE.longitude,
    },
    dropoff: {
      latitude: params.destinationLat ?? DEFAULT_MAP_COORDINATE.latitude + 0.04,
      longitude: params.destinationLng ?? DEFAULT_MAP_COORDINATE.longitude - 0.06,
    },
  };
};

export const getTripCompletedPath = (params: {
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
  pathname: '/ride-search/trip-completed' as const,
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
