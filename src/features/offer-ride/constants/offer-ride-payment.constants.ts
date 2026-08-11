import { ROUTES } from '@/config';

export const OFFER_RIDE_PAYMENT_SCREEN = {
  title: 'Payment Options',
  continueLabel: 'Pay Now & Publish!',
  secureLabel: 'PCI-DSS SECURE PAYMENT',
  missingVehicleTitle: 'Select a vehicle',
  missingVehicleMessage: 'Please choose a vehicle before publishing.',
} as const;

export const getOfferRidePaymentPath = () => ROUTES.offerRidePayment;
