export interface PaymentSummaryRow {
  label: string;
  value: string;
  hint?: string;
}

export interface PaymentSummaryCardProps {
  rows: PaymentSummaryRow[];
  totalLabel: string;
  totalValue: string;
}
