/**
 * BankAccounts sheet row types.
 * Headers / IDs live in `src/DemoData/files/demoData.common.ts`.
 */

export type { BankAccountsSheetHeader } from './files/demoData.common';

export {
  BANK_ACCOUNTS_SHEET_HEADERS,
  BANK_ACCOUNTS_SHEET_FIELD_KEYS,
  BANK_ACCOUNTS_SHEET_ID_START,
  bankAccountsSheetHeaderCsv,
} from './files/demoData.common';

export type BankAccountSheetStatus = 'active' | 'inactive';

export interface BankAccountsSheetRow {
  row_id: number;
  bankAccountId: number;
  userId: number;
  mobile: string;
  holderName: string;
  bankName: string;
  accountNumber: string;
  accountLast4: string;
  ifsc: string;
  accountType: string;
  status: BankAccountSheetStatus;
  createdAt: string;
  updated_at: string;
}

export type BankAccountsSheetPatch = Partial<Omit<BankAccountsSheetRow, 'updated_at'>> & {
  mobile?: string;
};
