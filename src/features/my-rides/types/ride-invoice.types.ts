export interface RideInvoiceFareLine {
  id: string;
  label: string;
  amountLabel: string;
  tone?: 'default' | 'discount';
}

export interface RideInvoiceDriver {
  name: string;
  vehicleLabel: string;
  plateNumber: string;
  avatarUri: string;
  verified: boolean;
}

export interface RideInvoiceSummary {
  id: string;
  invoiceId: string;
  dateLabel: string;
  statusLabel: string;
  totalAmountLabel: string;
  paidAmountLabel: string;
  pickupLabel: string;
  pickupTimeLabel: string;
  dropoffLabel: string;
  dropoffTimeLabel: string;
  driver: RideInvoiceDriver;
  fareLines: readonly RideInvoiceFareLine[];
  paymentMethodLabel: string;
  avatarUri: string;
}
