export type AddMoneyPaymentSourceType = 'bank' | 'upi';

export interface AddMoneyPaymentSource {
  id: string;
  type: AddMoneyPaymentSourceType;
  title: string;
  subtitle: string;
  icon: 'business' | 'card';
}

export interface AddMoneyQuickAmount {
  id: string;
  amount: number;
  label: string;
}
