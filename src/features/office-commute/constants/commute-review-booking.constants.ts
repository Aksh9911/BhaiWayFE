import type { CommuteReviewBookingData } from '../types/commute-review-booking.types';
import { formatBhaiWayCoins } from '@/shared/utils';

export const COMMUTE_REVIEW_BOOKING_SCREEN = {
  title: 'Review Booking',
  distanceLabel: 'Distance',
  etaLabel: 'ETA',
  matchCaption: 'Pickup En Route',
  rideAlongsTitle: 'Ride Alongs',
  rideAlongsCount: (count: number) =>
    count === 1 ? '1 co-passenger' : `${count} co-passengers`,
  paymentTitle: 'Payment Summary',
  promoPlaceholder: 'Apply Promo Code',
  applyLabel: 'APPLY',
  baseFareLabel: 'Base Fare',
  platformFeeLabel: 'Platform Fee',
  taxesLabel: 'Taxes & GST',
  promoDiscountLabel: 'Promo Discount',
  totalLabel: 'Total Payable',
  confirmLabel: 'Confirm & Pay',
  confirmingLabel: 'Processing...',
  confirmedLabel: 'Booking Success!',
  promoSuccess: 'Promo applied',
} as const;

const DEFAULT_PICKUP = {
  label: 'Cyber City',
  address: 'DLF Cyber City, Gurugram',
  latitude: 28.4949,
  longitude: 77.0881,
};

const DEFAULT_DROPOFF = {
  label: 'Noida Sector 62',
  address: 'Sector 62, Noida',
  latitude: 28.6274,
  longitude: 77.3649,
};

export const getCommuteReviewBookingMock = (overrides?: {
  rideId?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
  origin?: string;
  destination?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}): CommuteReviewBookingData => {
  const baseFare = overrides?.price ?? 180;
  const platformFee = 15;
  const taxes = 12.5;
  const total = baseFare + platformFee + taxes;

  return {
    rideId: overrides?.rideId ?? 'commute-ride-1',
    driverName: overrides?.driverName ?? 'Arjun Sharma',
    carModel: overrides?.carModel ?? 'Honda City',
    distanceLabel: '12.4 km',
    durationLabel: '24 mins',
    matchPercent: 95,
    matchCaption: COMMUTE_REVIEW_BOOKING_SCREEN.matchCaption,
    pickup: {
      ...DEFAULT_PICKUP,
      label: overrides?.origin?.trim() || DEFAULT_PICKUP.label,
      latitude: overrides?.originLat ?? DEFAULT_PICKUP.latitude,
      longitude: overrides?.originLng ?? DEFAULT_PICKUP.longitude,
    },
    dropoff: {
      ...DEFAULT_DROPOFF,
      label: overrides?.destination?.trim() || DEFAULT_DROPOFF.label,
      latitude: overrides?.destinationLat ?? DEFAULT_DROPOFF.latitude,
      longitude: overrides?.destinationLng ?? DEFAULT_DROPOFF.longitude,
    },
    rideAlongs: [
      {
        id: 'along-1',
        name: 'Arjun S.',
        rating: 4.9,
        verificationLabel: 'Google Verified',
        seatLabel: 'Front Seat',
        verified: true,
        avatarUri:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBm3yno7XB8Q1vugR_jLzMzp8YUSj8rTtlY7S4X8HibIvLtTHuR_TbdUdXsPSJ09g0ttsDUtuk4u7SqMta2j_mSiYpeHubK2xADTatCtcnlHDmSWsPueqnzDaewGwYy5NC-ymntUpC-MHd8d671oc94V60mVLrtZq7RGSTbzvG667KpeZVcmqT7IGxS4lAG1AhwZRoZiaAcgsxiEvgQS-n4EXuiH7T_G5yPibCRDAOUdyjQgHbiwnYzaOL9n0RpwjzjMNc4L1BPS38',
      },
      {
        id: 'along-2',
        name: 'Priya V.',
        rating: 4.8,
        verificationLabel: 'Microsoft Verified',
        seatLabel: 'Rear Seat',
        verified: true,
        avatarUri:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAmHFC6kOkF_UdsgDe2I9Ao86aqthto4CkKgimCIzIul9wenFhRhOwf7mXqGfpV5z4z4PnQ5tMmQwziftJSxKLJ-Y9AgQ-p4M1bmdrR_oD6hGqsu_1vP450Z-ZRo8y8hi2J6w_sjAkzr22JgRiAu0ugno7JDHVuvbPrmyQeZwe5Qh0afjSm7DSO9PEQvC2s46H3cLcoKaaRp5FD-T5_cJqbV0HE_x-NqTly7NctMM9lTXzVot7pNZwHnbmQqmyc08WA5mXadzVuyy8',
      },
    ],
    fare: {
      baseFare,
      platformFee,
      taxes,
      promoDiscount: 0,
      total,
    },
  };
};

export const formatCommuteAmount = (value: number): string =>
  formatBhaiWayCoins(value, { spaced: false, minimumFractionDigits: 2 });

export const getCommuteReviewBookingPath = (params: {
  rideId: string;
  origin: string;
  destination: string;
  driverName: string;
  carModel: string;
  price: number;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}) => ({
  pathname: '/office-commute/review-booking' as const,
  params: {
    rideId: params.rideId,
    origin: params.origin,
    destination: params.destination,
    driverName: params.driverName,
    carModel: params.carModel,
    price: String(params.price),
    originLat: params.originLat != null ? String(params.originLat) : '',
    originLng: params.originLng != null ? String(params.originLng) : '',
    destinationLat: params.destinationLat != null ? String(params.destinationLat) : '',
    destinationLng: params.destinationLng != null ? String(params.destinationLng) : '',
  },
});
