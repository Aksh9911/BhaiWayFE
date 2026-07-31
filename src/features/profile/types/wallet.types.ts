export type WalletTransactionType = 'credit' | 'debit';

export type WalletTransactionFilter = 'all' | 'credit' | 'debit';

export interface WalletTransaction {
  id: string;
  title: string;
  dateLabel: string;
  amountLabel: string;
  type: WalletTransactionType;
  icon: 'car' | 'card' | 'business' | 'star';
}

export interface WalletSummary {
  balanceLabel: string;
  walletId: string;
  walletName: string;
}
