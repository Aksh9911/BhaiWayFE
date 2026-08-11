import { env } from '@/config';
import { formatSignedBhaiWayCoins } from '@/shared/utils';
import {
  DEMO_GOOGLE_SHEET_ID,
  DEMO_SHEET_LINKS,
  DEMO_WALLET_TRANSACTIONS_SHEET_GID,
  WALLET_TRANSACTIONS_SHEET_FIELD_KEYS,
  WALLET_TRANSACTIONS_SHEET_HEADERS,
  WALLET_TRANSACTIONS_SHEET_ID_START,
} from '@/DemoData/files';
import { authSession } from '@/store';

import { userDetailsSheetStore } from '../userDetailsSheetStore';
import {
  type WalletTransactionSheetIcon,
  type WalletTransactionSheetType,
  type WalletTransactionsSheetRow,
} from '../walletTransactionsSheet.types';
import { walletTransactionsSheetStore } from '../walletTransactionsSheetStore';
import { normalizeHeader, parseCsv } from './csv';

export interface RemoteWalletTransactionRow {
  transactionId: number;
  userId: number;
  mobile: string;
  title: string;
  amount: number;
  type: string;
  icon: string;
  dateLabel: string;
  reference: string;
  createdAt: string;
}

export interface WalletTransactionSyncInput {
  transactionId?: number;
  userId?: number;
  mobile?: string;
  title: string;
  amount: number;
  type: WalletTransactionSheetType;
  icon?: WalletTransactionSheetIcon;
  dateLabel?: string;
  reference?: string;
  createdAt?: string;
}

export interface WalletTransactionSyncResult {
  localRowSaved: boolean;
  remoteSynced: boolean;
  mode: 'insert' | 'update';
  transactionId: number;
  message: string;
}

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const headerMap: Record<string, keyof RemoteWalletTransactionRow> = {
  transactionid: 'transactionId',
  userid: 'userId',
  mobile: 'mobile',
  title: 'title',
  amount: 'amount',
  type: 'type',
  icon: 'icon',
  datelabel: 'dateLabel',
  reference: 'reference',
  createdat: 'createdAt',
  'transaction id': 'transactionId',
  'user id': 'userId',
  'date label': 'dateLabel',
  'created at': 'createdAt',
  phone: 'mobile',
};

const emptyRemote = (): RemoteWalletTransactionRow => ({
  transactionId: 0,
  userId: 0,
  mobile: '',
  title: '',
  amount: 0,
  type: 'credit',
  icon: 'card',
  dateLabel: '',
  reference: '',
  createdAt: '',
});

const sheetCsvUrl = (): string =>
  DEMO_SHEET_LINKS.walletTransactionsCsv(
    env.googleSheetId || DEMO_GOOGLE_SHEET_ID,
    env.googleSheetWalletTransactionsGid || DEMO_WALLET_TRANSACTIONS_SHEET_GID,
  );

const assignCell = (
  row: RemoteWalletTransactionRow,
  key: keyof RemoteWalletTransactionRow,
  raw: string,
): void => {
  if (key === 'transactionId' || key === 'userId' || key === 'amount') {
    const amount = Number(String(raw).replace(/[^\d.]/g, ''));
    row[key] = Number.isFinite(amount) ? (key === 'amount' ? amount : Math.floor(amount)) : 0;
    return;
  }
  row[key] = raw;
};

const mapCsvToRemoteRows = (csv: string): RemoteWalletTransactionRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }
  const headers = table[0].map(normalizeHeader);
  const expected = WALLET_TRANSACTIONS_SHEET_HEADERS.map(normalizeHeader);
  const ordered =
    expected.every((name, index) => headers[index] === name)
      ? WALLET_TRANSACTIONS_SHEET_FIELD_KEYS.map((key) => key)
      : null;

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyRemote();
      if (ordered) {
        ordered.forEach((key, index) => {
          assignCell(row, key as keyof RemoteWalletTransactionRow, cells[index] ?? '');
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
    .filter((row) => row.transactionId > 0 || row.title);
};

const localToRemote = (row: WalletTransactionsSheetRow): RemoteWalletTransactionRow => ({
  transactionId: row.transactionId,
  userId: row.userId,
  mobile: row.mobile,
  title: row.title,
  amount: row.amount,
  type: row.type,
  icon: row.icon,
  dateLabel: row.dateLabel,
  reference: row.reference,
  createdAt: row.createdAt,
});

const resolveOwner = () => {
  const phone = normalizeMobile(authSession.getUser()?.phone);
  return (
    (phone ? userDetailsSheetStore.findByMobile(phone) : undefined) ||
    userDetailsSheetStore.getAll()[0]
  );
};

export const formatWalletTransactionDateLabel = (date = new Date()): string => {
  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} • ${timePart}`;
};

export const formatWalletTransactionAmountLabel = (
  amount: number,
  type: WalletTransactionSheetType,
): string =>
  formatSignedBhaiWayCoins(Math.abs(amount), {
    sign: type === 'debit' ? '-' : '+',
  });

export const walletTransactionsSheetSync = {
  fetchRemoteRows: async (): Promise<RemoteWalletTransactionRow[] | null> => {
    const url = sheetCsvUrl();
    console.log('[WalletTransactions Sheet] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    console.log('[WalletTransactions Sheet] fetch response', {
      httpStatus: response.status,
      bytes: text.length,
      preview: text.slice(0, 240),
    });
    if (!response.ok) {
      throw new Error('Unable to read WalletTransactions sheet. Create the tab or check gid.');
    }
    if (
      text.trim().startsWith('<') ||
      !normalizeHeader(text.split('\n')[0] ?? '').includes('transaction')
    ) {
      console.log('[WalletTransactions Sheet] tab missing or wrong gid');
      return null;
    }
    return mapCsvToRemoteRows(text);
  },

  pullIntoLocal: async (): Promise<RemoteWalletTransactionRow[]> => {
    await walletTransactionsSheetStore.hydrate();
    let remoteRows: RemoteWalletTransactionRow[] = [];
    try {
      const remote = await walletTransactionsSheetSync.fetchRemoteRows();
      if (remote) {
        remoteRows = remote;
      }
    } catch (error) {
      console.log('[WalletTransactions Sheet] pull skipped', error);
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
      await walletTransactionsSheetStore.upsert({
        transactionId: remote.transactionId > 0 ? remote.transactionId : undefined,
        userId: remote.userId > 0 ? remote.userId : undefined,
        mobile: remote.mobile || sessionPhone || undefined,
        title: remote.title,
        amount: remote.amount,
        type: remote.type as WalletTransactionSheetType,
        icon: remote.icon as WalletTransactionSheetIcon,
        dateLabel: remote.dateLabel,
        reference: remote.reference,
        createdAt: remote.createdAt,
      });
    }
    return remoteRows;
  },

  pushRemote: async (
    row: RemoteWalletTransactionRow,
    mode: 'insert' | 'update',
  ): Promise<boolean> => {
    const webhook = env.googleSheetWebhookUrl;
    if (!webhook) {
      console.log('[WalletTransactions Sheet] push skipped (no webhook)', { mode, row });
      return false;
    }
    const body = { entity: 'walletTransaction', action: mode, row };
    console.log('[WalletTransactions Sheet] push request', { webhook, body });
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('[WalletTransactions Sheet] push response', {
      httpStatus: response.status,
      body: text,
    });
    return response.ok;
  },

  upsertAndSync: async (
    input: WalletTransactionSyncInput,
  ): Promise<WalletTransactionSyncResult> => {
    const amount = Math.abs(Number(input.amount) || 0);
    if (!input.title.trim() || amount <= 0) {
      throw Object.assign(new Error('Transaction title and amount are required.'), {
        code: 'WALLET_TX_VALIDATION_FAILED',
      });
    }

    const owner = resolveOwner();
    const mobile =
      normalizeMobile(input.mobile) ||
      owner?.mobile ||
      normalizeMobile(authSession.getUser()?.phone) ||
      '';

    const existing =
      input.transactionId && input.transactionId > 0
        ? walletTransactionsSheetStore.findByTransactionId(input.transactionId)
        : undefined;
    const mode: 'insert' | 'update' = existing ? 'update' : 'insert';
    const transactionId =
      existing?.transactionId && existing.transactionId > 0
        ? existing.transactionId
        : input.transactionId && input.transactionId >= WALLET_TRANSACTIONS_SHEET_ID_START
          ? input.transactionId
          : walletTransactionsSheetStore.nextTransactionId();

    const saved = await walletTransactionsSheetStore.upsert({
      transactionId,
      userId: input.userId || owner?.userId || 0,
      mobile,
      title: input.title.trim(),
      amount,
      type: input.type,
      icon: input.icon || (input.type === 'debit' ? 'business' : 'card'),
      dateLabel: input.dateLabel || formatWalletTransactionDateLabel(),
      reference: input.reference,
      createdAt: input.createdAt,
    });

    let remoteSynced = false;
    try {
      remoteSynced = await walletTransactionsSheetSync.pushRemote(localToRemote(saved), mode);
    } catch (error) {
      console.log('[WalletTransactions Sheet] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode,
      transactionId: saved.transactionId,
      message: remoteSynced
        ? `TransactionID ${saved.transactionId} ${mode === 'insert' ? 'added to' : 'updated in'} sheet.`
        : `TransactionID ${saved.transactionId} saved locally.`,
    };
  },
};
