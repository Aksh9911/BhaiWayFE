import type { CommuteBookingFare } from '../../types/commute-review-booking.types';

export interface CommutePaymentSummaryProps {
  fare: CommuteBookingFare;
  promoValue: string;
  promoApplied: boolean;
  onPromoChange: (value: string) => void;
  onApplyPromo: () => void;
  onPromoFocus?: () => void;
  onPromoBlur?: () => void;
}
