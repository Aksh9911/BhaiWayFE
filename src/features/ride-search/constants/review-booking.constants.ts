import type { ReviewBookingData, RideType } from '../types';
import { formatBhaiWayCoins } from '@/shared/utils';

export const REVIEW_BOOKING_SCREEN = {
  title: 'Review Booking',
  pickupLabel: 'PICKUP',
  dropoffLabel: 'DROP-OFF',
  editLabel: 'Edit',
  coPassengersLabel: 'CO-PASSENGERS',
  promoTitle: 'APPLY PROMO CODE',
  promoPlaceholder: 'Enter promo code',
  applyLabel: 'Apply',
  promoSuccess: 'Promo code BHAIWAY10 applied successfully!',
  assuredTitle: 'Assured Booking',
  assuredSubtitle: 'Refundable fee',
  assuredSelected: 'SELECTED',
  assuredNote:
    'Note: You are booking an assured ride, if you cancel, the assured booking amount will not be refunded.',
  fareTitle: 'FARE DETAILS',
  rideFareLabel: 'Ride Fare',
  platformFeeLabel: 'Platform Fee',
  promoDiscountLabel: 'Promo Discount',
  assuredFeeLabel: 'Assured Booking Fee',
  totalLabel: 'Total Amount',
  confirmLabel: 'Confirm & Pay',
} as const;

export const ASSURED_BOOKING_FEE = 50;
export const DEFAULT_PROMO_CODE = 'BHAIWAY10';
export const DEFAULT_PROMO_DISCOUNT = 24;

const BASE_MOCK: Omit<ReviewBookingData, 'rideId' | 'rideType' | 'coPassengers' | 'fare'> = {
  pickup: {
    label: 'PICKUP',
    address: 'Tech Park South Gate, Sector 5',
    latitude: 12.9352,
    longitude: 77.6245,
  },
  dropoff: {
    label: 'DROP-OFF',
    address: 'Central Business District, Tower A',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  distanceLabel: '12.4 km',
  durationLabel: '24 mins',
  driver: {
    id: 'driver-booking-1',
    name: 'Arjun Sharma',
    subtitle: 'Altus Mindstream',
    rating: 4.9,
    totalRides: 1240,
  },
  maxPassengers: 4,
  promoCode: '',
};

const REGULAR_PASSENGERS = [
  { id: 'cp-1', name: 'Rohan M.', company: 'Google', verified: true },
  { id: 'cp-2', name: 'Priya S.', company: 'Microsoft', verified: true },
];

const ASSURED_PASSENGERS = [
  ...REGULAR_PASSENGERS,
  { id: 'cp-3', name: 'Karan D.', company: 'Amazon', verified: true },
];

const buildFare = (rideType: RideType): ReviewBookingData['fare'] => {
  const rideFare = 240;
  const platformFee = 15;
  const promoDiscount = 0;
  const assuredFee = rideType === 'assured' ? ASSURED_BOOKING_FEE : 0;

  return {
    rideFare,
    platformFee,
    promoDiscount,
    assuredFee,
    total: rideFare + platformFee + assuredFee - promoDiscount,
  };
};

export const getReviewBookingMock = (
  rideId: string,
  rideType: RideType,
): ReviewBookingData => ({
  rideId,
  rideType,
  ...BASE_MOCK,
  coPassengers: rideType === 'assured' ? ASSURED_PASSENGERS : REGULAR_PASSENGERS,
  fare: buildFare(rideType),
});

export const formatBookingAmount = (value: number): string =>
  formatBhaiWayCoins(value, { spaced: false, minimumFractionDigits: 2 });

export const getReviewBookingPath = (params: {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
  dateLabel?: string;
  departureTime?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}) => ({
  pathname: '/ride-search/review-booking' as const,
  params: {
    rideId: params.rideId,
    rideType: params.rideType,
    origin: params.origin ?? '',
    destination: params.destination ?? '',
    driverName: params.driverName ?? '',
    carModel: params.carModel ?? '',
    price: params.price != null ? String(params.price) : '',
    dateLabel: params.dateLabel ?? '',
    departureTime: params.departureTime ?? '',
    originLat: params.originLat != null ? String(params.originLat) : '',
    originLng: params.originLng != null ? String(params.originLng) : '',
    destinationLat: params.destinationLat != null ? String(params.destinationLat) : '',
    destinationLng: params.destinationLng != null ? String(params.destinationLng) : '',
  },
});
