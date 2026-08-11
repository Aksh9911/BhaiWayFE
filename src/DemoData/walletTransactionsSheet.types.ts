/**
 * WalletTransactions sheet row types.
 * Headers / IDs live in `src/DemoData/files/demoData.common.ts`.
 */

export type { WalletTransactionsSheetHeader } from './files/demoData.common';

export {
  WALLET_TRANSACTIONS_SHEET_HEADERS,
  WALLET_TRANSACTIONS_SHEET_FIELD_KEYS,
  WALLET_TRANSACTIONS_SHEET_ID_START,
  walletTransactionsSheetHeaderCsv,
} from './files/demoData.common';

export type WalletTransactionSheetType = 'credit' | 'debit';
export type WalletTransactionSheetIcon = 'car' | 'card' | 'business' | 'star';

export interface WalletTransactionsSheetRow {
  row_id: number;
  transactionId: number;
  userId: number;
  mobile: string;
  title: string;
  amount: number;
  type: WalletTransactionSheetType;
  icon: WalletTransactionSheetIcon;
  dateLabel: string;
  reference: string;
  createdAt: string;
  updated_at: string;
}

export type WalletTransactionsSheetPatch = Partial<
  Omit<WalletTransactionsSheetRow, 'updated_at'>
> & {
  mobile?: string;
};
