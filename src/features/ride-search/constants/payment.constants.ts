import type {
  BookedRideDetails,
  PaymentBankOption,
  PaymentMethodOption,
  RideType,
} from '../types';

export const PAYMENT_SCREEN = {
  title: 'Payment Options',
  walletTitle: 'Wallet',
  upiTitle: 'UPI Payments',
  cardsTitle: 'Saved Cards',
  bankingTitle: 'Net Banking',
  payAfterTitle: 'Pay After Ride',
  addUpiLabel: 'Add New UPI ID',
  addCardLabel: 'Add New Card',
  seeAllBanksLabel: 'See All Banks',
  secureLabel: 'PCI-DSS SECURE PAYMENT',
  continueLabel: 'Continue',
} as const;

export const BOOKED_SCREEN = {
  title: 'Ride Booked Successfully!',
  rideDetailsLabel: 'Ride Details',
  pickupLabel: 'Pickup',
  dropLabel: 'Drop',
  vehicleLabel: 'Vehicle',
  dateTimeLabel: 'Date & Time',
  addToCalendarLabel: 'Add to Calendar',
  trackLabel: 'Track My Ride',
  rideDetailsActionLabel: 'Ride Details',
  assuredRefundNote:
    'Note: Your assured booking amount will be refunded after the trip ends.',
  assuredCancelNote:
    'Note: You have booked an assured ride. If you cancel this ride, booking amount will be not refunded!',
} as const;

export const WALLET_BALANCE = 450;

export const PAYMENT_METHODS: readonly PaymentMethodOption[] = [
  {
    id: 'wallet',
    kind: 'wallet',
    label: 'BhaiWay Wallet',
    icon: 'wallet',
  },
  {
    id: 'gpay',
    kind: 'upi',
    label: 'Google Pay',
    icon: 'ellipse-outline',
  },
  {
    id: 'phonepe',
    kind: 'upi',
    label: 'PhonePe',
    icon: 'cash-outline',
  },
  {
    id: 'visa',
    kind: 'card',
    label: 'Visa Debit Card',
    subtitle: '•••• •••• •••• 4242',
    icon: 'card-outline',
  },
  {
    id: 'pay-after-ride',
    kind: 'pay-after',
    label: 'Pay After Ride',
    subtitle: 'Pay directly to the driver after trip completion',
    icon: 'repeat-outline',
  },
] as const;

export const POPULAR_BANKS: readonly PaymentBankOption[] = [
  { id: 'sbi', label: 'SBI', color: '#003366' },
  { id: 'hdfc', label: 'HDFC', color: '#1C3F94' },
  { id: 'icici', label: 'ICICI', color: '#EF3A24' },
] as const;

export const getPaymentPath = (params: {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
}) => ({
  pathname: '/ride-search/payment' as const,
  params: {
    rideId: params.rideId,
    rideType: params.rideType,
    origin: params.origin ?? '',
    destination: params.destination ?? '',
    driverName: params.driverName ?? '',
    carModel: params.carModel ?? '',
    price: params.price != null ? String(params.price) : '',
  },
});

export const getBookedPath = (params: {
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
  pathname: '/ride-search/booked' as const,
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

export const getBookedRideMock = (params: {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
}): BookedRideDetails => ({
  rideId: params.rideId,
  rideType: params.rideType,
  driverName: params.driverName || 'Vikram K.',
  driverSubtitle: 'Altus Mindstream',
  pickup: shortName(params.origin) || 'Saket',
  dropoff: shortName(params.destination) || 'Cyber City',
  vehicle: params.carModel || 'Honda City',
  plateNumber: 'DL 3C AB 1234',
  dateTimeLabel: 'Oct 24, 2023 | 08:45 AM',
  meetTimeLabel: '08:45 AM',
});

const shortName = (value?: string): string => {
  if (!value) {
    return '';
  }
  return value.split(',')[0]?.trim() || value;
};
