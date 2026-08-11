import { env } from '@/config';
import {
  BANK_ACCOUNTS_SHEET_FIELD_KEYS,
  BANK_ACCOUNTS_SHEET_HEADERS,
  BANK_ACCOUNTS_SHEET_ID_START,
  DEMO_BANK_ACCOUNTS_SHEET_GID,
  DEMO_GOOGLE_SHEET_ID,
  DEMO_SHEET_LINKS,
} from '@/DemoData/files';
import { authSession } from '@/store';

import { userDetailsSheetStore } from '../userDetailsSheetStore';
import type { BankAccountsSheetRow } from '../bankAccountsSheet.types';
import { bankAccountsSheetStore } from '../bankAccountsSheetStore';
import { normalizeHeader, parseCsv } from './csv';

export interface RemoteBankAccountRow {
  bankAccountId: number;
  userId: number;
  mobile: string;
  holderName: string;
  bankName: string;
  accountNumber: string;
  accountLast4: string;
  ifsc: string;
  accountType: string;
  status: string;
  createdAt: string;
}

export interface BankAccountSyncInput {
  bankAccountId?: number;
  userId?: number;
  mobile?: string;
  holderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountType?: string;
  status?: string;
  createdAt?: string;
}

export interface BankAccountSyncResult {
  localRowSaved: boolean;
  remoteSynced: boolean;
  mode: 'insert' | 'update';
  bankAccountId: number;
  message: string;
}

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const headerMap: Record<string, keyof RemoteBankAccountRow> = {
  bankaccountid: 'bankAccountId',
  userid: 'userId',
  mobile: 'mobile',
  holdername: 'holderName',
  bankname: 'bankName',
  accountnumber: 'accountNumber',
  accountlast4: 'accountLast4',
  ifsc: 'ifsc',
  accounttype: 'accountType',
  status: 'status',
  createdat: 'createdAt',
  'bank account id': 'bankAccountId',
  'user id': 'userId',
  'holder name': 'holderName',
  'bank name': 'bankName',
  'account number': 'accountNumber',
  'account last4': 'accountLast4',
  'account type': 'accountType',
  'created at': 'createdAt',
  phone: 'mobile',
};

const emptyRemote = (): RemoteBankAccountRow => ({
  bankAccountId: 0,
  userId: 0,
  mobile: '',
  holderName: '',
  bankName: '',
  accountNumber: '',
  accountLast4: '',
  ifsc: '',
  accountType: 'Savings Account',
  status: 'active',
  createdAt: '',
});

const sheetCsvUrl = (): string =>
  DEMO_SHEET_LINKS.bankAccountsCsv(
    env.googleSheetId || DEMO_GOOGLE_SHEET_ID,
    env.googleSheetBankAccountsGid || DEMO_BANK_ACCOUNTS_SHEET_GID,
  );

const assignCell = (
  row: RemoteBankAccountRow,
  key: keyof RemoteBankAccountRow,
  raw: string,
): void => {
  if (key === 'bankAccountId' || key === 'userId') {
    const amount = Number(String(raw).replace(/[^\d]/g, ''));
    row[key] = Number.isFinite(amount) ? Math.floor(amount) : 0;
    return;
  }
  row[key] = raw;
};

const mapCsvToRemoteRows = (csv: string): RemoteBankAccountRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }
  const headers = table[0].map(normalizeHeader);
  const expected = BANK_ACCOUNTS_SHEET_HEADERS.map(normalizeHeader);
  const ordered =
    expected.every((name, index) => headers[index] === name)
      ? BANK_ACCOUNTS_SHEET_FIELD_KEYS.map((key) => key)
      : null;

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyRemote();
      if (ordered) {
        ordered.forEach((key, index) => {
          assignCell(row, key as keyof RemoteBankAccountRow, cells[index] ?? '');
        });
        return row;
      }
      headers.forEach((header, index) => {
        const key = headerMap[header];
        if (key) {
          assignCell(row, key, cells[index] ?? '');
        }
      });
      return row;
    })
    .filter((row) => row.bankAccountId > 0 || row.bankName || row.accountNumber);
};

const localToRemote = (row: BankAccountsSheetRow): RemoteBankAccountRow => ({
  bankAccountId: row.bankAccountId,
  userId: row.userId,
  mobile: row.mobile,
  holderName: row.holderName,
  bankName: row.bankName,
  accountNumber: row.accountNumber,
  accountLast4: row.accountLast4,
  ifsc: row.ifsc,
  accountType: row.accountType,
  status: row.status,
  createdAt: row.createdAt,
});

const resolveOwner = () => {
  const phone = normalizeMobile(authSession.getUser()?.phone);
  return (
    (phone ? userDetailsSheetStore.findByMobile(phone) : undefined) ||
    userDetailsSheetStore.getAll()[0]
  );
};

export const bankAccountsSheetSync = {
  fetchRemoteRows: async (): Promise<RemoteBankAccountRow[] | null> => {
    const url = sheetCsvUrl();
    console.log('[BankAccounts Sheet] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    console.log('[BankAccounts Sheet] fetch response', {
      httpStatus: response.status,
      bytes: text.length,
      preview: text.slice(0, 240),
    });
    if (!response.ok) {
      throw new Error('Unable to read BankAccounts sheet. Create the tab or check gid.');
    }
    if (
      text.trim().startsWith('<') ||
      !normalizeHeader(text.split('\n')[0] ?? '').includes('bankaccount')
    ) {
      console.log('[BankAccounts Sheet] tab missing or wrong gid');
      return null;
    }
    return mapCsvToRemoteRows(text);
  },

  pullIntoLocal: async (): Promise<RemoteBankAccountRow[]> => {
    await bankAccountsSheetStore.hydrate();
    let remoteRows: RemoteBankAccountRow[] = [];
    try {
      const remote = await bankAccountsSheetSync.fetchRemoteRows();
      if (remote) {
        remoteRows = remote;
      }
    } catch (error) {
      console.log('[BankAccounts Sheet] pull skipped', error);
    }

    const sessionPhone = normalizeMobile(authSession.getUser()?.phone);
    for (const remote of remoteRows) {
      if (
        sessionPhone &&
        normalizeMobile(remote.mobile) &&
        normalizeMobile(remote.mobile) !== sessionPhone
      ) {
        continue;
      }
      await bankAccountsSheetStore.upsert({
        bankAccountId: remote.bankAccountId > 0 ? remote.bankAccountId : undefined,
        userId: remote.userId > 0 ? remote.userId : undefined,
        mobile: remote.mobile || sessionPhone || undefined,
        holderName: remote.holderName,
        bankName: remote.bankName,
        accountNumber: remote.accountNumber,
        accountLast4: remote.accountLast4,
        ifsc: remote.ifsc,
        accountType: remote.accountType,
        status: remote.status === 'inactive' ? 'inactive' : 'active',
        createdAt: remote.createdAt,
      });
    }
    return remoteRows;
  },

  pushRemote: async (
    row: RemoteBankAccountRow,
    mode: 'insert' | 'update',
  ): Promise<boolean> => {
    const webhook = env.googleSheetWebhookUrl;
    if (!webhook) {
      console.log('[BankAccounts Sheet] push skipped (no webhook)', { mode, row });
      return false;
    }
    const body = { entity: 'bankAccount', action: mode, row };
    console.log('[BankAccounts Sheet] push request', { webhook, body });
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('[BankAccounts Sheet] push response', {
      httpStatus: response.status,
      body: text,
    });
    return response.ok;
  },

  upsertAndSync: async (input: BankAccountSyncInput): Promise<BankAccountSyncResult> => {
    const holderName = input.holderName.trim();
    const bankName = input.bankName.trim();
    const accountNumber = input.accountNumber.replace(/\D/g, '');
    const ifsc = input.ifsc.trim().toUpperCase();

    if (!holderName || !bankName || !accountNumber || !ifsc) {
      throw Object.assign(new Error('All bank account fields are required.'), {
        code: 'BANK_ACCOUNT_VALIDATION_FAILED',
      });
    }

    const owner = resolveOwner();
    const mobile =
      normalizeMobile(input.mobile) ||
      owner?.mobile ||
      normalizeMobile(authSession.getUser()?.phone) ||
      '';

    const existing =
      input.bankAccountId && input.bankAccountId > 0
        ? bankAccountsSheetStore.findByBankAccountId(input.bankAccountId)
        : undefined;
    const mode: 'insert' | 'update' = existing ? 'update' : 'insert';
    const bankAccountId =
      existing?.bankAccountId && existing.bankAccountId > 0
        ? existing.bankAccountId
        : input.bankAccountId && input.bankAccountId >= BANK_ACCOUNTS_SHEET_ID_START
          ? input.bankAccountId
          : bankAccountsSheetStore.nextBankAccountId();

    const saved = await bankAccountsSheetStore.upsert({
      bankAccountId,
      userId: input.userId || owner?.userId || 0,
      mobile,
      holderName,
      bankName,
      accountNumber,
      accountLast4: accountNumber.slice(-4),
      ifsc,
      accountType: input.accountType?.trim() || 'Savings Account',
      status: input.status === 'inactive' ? 'inactive' : 'active',
      createdAt: input.createdAt,
    });

    let remoteSynced = false;
    try {
      remoteSynced = await bankAccountsSheetSync.pushRemote(localToRemote(saved), mode);
    } catch (error) {
      console.log('[BankAccounts Sheet] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode,
      bankAccountId: saved.bankAccountId,
      message: remoteSynced
        ? `BankAccountID ${saved.bankAccountId} ${mode === 'insert' ? 'added to' : 'updated in'} sheet.`
        : `BankAccountID ${saved.bankAccountId} saved locally.`,
    };
  },
};
