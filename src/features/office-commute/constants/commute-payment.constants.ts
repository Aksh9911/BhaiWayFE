export const COMMUTE_PAYMENT_SCREEN = {
  title: 'Payment Options',
  continueLabel: 'Continue',
  secureLabel: 'Your payment is secured with bank-grade encryption.',
} as const;

export const getCommutePaymentPath = (params: {
  rideId: string;
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
  pathname: '/office-commute/payment' as const,
  params: {
    rideId: params.rideId,
    rideType: 'regular',
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
