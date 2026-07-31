export type BankAccountType = 'savings' | 'current';

export interface WithdrawBankAccount {
  id: string;
  bankName: string;
  accountTypeLabel: string;
  maskedNumber: string;
}

export interface WithdrawQuickAmount {
  id: string;
  amount: number;
  label: string;
}
