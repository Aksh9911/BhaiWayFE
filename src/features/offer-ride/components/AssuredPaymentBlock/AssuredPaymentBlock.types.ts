export interface AssuredPaymentBlockProps {
  promoCode: string;
  onPromoChange: (code: string) => void;
  onApplyPromo: () => void;
  refundableAmountLabel: string;
  totalToPayLabel: string;
}
