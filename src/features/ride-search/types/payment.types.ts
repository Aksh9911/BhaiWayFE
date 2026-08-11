export type PaymentMethodId =
  | 'wallet'
  | 'gpay'
  | 'phonepe'
  | 'visa'
  | 'pay-after-ride'
  | (string & {});

export type PaymentMethodKind = 'wallet' | 'upi' | 'card' | 'pay-after';

export interface PaymentMethodOption {
  id: PaymentMethodId;
  kind: PaymentMethodKind;
  label: string;
  subtitle?: string;
  icon: string;
  iconColor?: string;
}

export interface PaymentBankOption {
  id: string;
  label: string;
  color: string;
}

export interface BookedRideDetails {
  rideId: string;
  rideType: 'regular' | 'assured';
  driverName: string;
  driverSubtitle: string;
  pickup: string;
  dropoff: string;
  vehicle: string;
  plateNumber: string;
  dateTimeLabel: string;
  meetTimeLabel: string;
}
