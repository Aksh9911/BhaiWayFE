import { Share } from 'react-native';

import { authSession } from '@/store';
import { formatBhaiWayCoins } from '@/shared/utils';

import { userDetailsSheetStore } from './userDetailsSheetStore';
import { vehiclesSheetStore } from './vehiclesSheetStore';
import { userDetailsSheetSync, walletTransactionsSheetSync } from './sheet';
import type { UserDetailsSheetRow } from './userDetailsSheet.types';
import type {
  WalletTransactionSheetIcon,
  WalletTransactionSheetType,
} from './walletTransactionsSheet.types';
import type { WalletTransactionSyncResult } from './sheet';

const normalizeMobile = (mobile?: string | null): string =>
  (mobile ?? '').replace(/\D/g, '').slice(-10);

const normalizeKey = (value?: string | null): string =>
  (value ?? '').trim().toLowerCase();

/** Find the current session user's sheet row (mobile → email → name). */
export const findCurrentUserSheetRow = (): UserDetailsSheetRow | undefined => {
  const user = authSession.getUser();
  const rows = userDetailsSheetStore.getAll();
  if (rows.length === 0) {
    return undefined;
  }

  const mobile = normalizeMobile(user?.phone);
  if (mobile) {
    const byMobile = rows.find((row) => normalizeMobile(row.mobile) === mobile);
    if (byMobile) {
      return byMobile;
    }
  }

  const email = normalizeKey(user?.email);
  if (email) {
    const byEmail = rows.find((row) => normalizeKey(row.email) === email);
    if (byEmail) {
      return byEmail;
    }
  }

  const name = normalizeKey(user?.fullName);
  if (name) {
    const byName = rows.find((row) => normalizeKey(row.userName) === name);
    if (byName) {
      return byName;
    }
  }

  return undefined;
};

/** Find a registered user in local + Google Sheet by mobile number. */
export const findSheetUserByMobile = async (
  phone?: string | null,
): Promise<UserDetailsSheetRow | undefined> => {
  const mobile = normalizeMobile(phone);
  if (!mobile) {
    return undefined;
  }

  await userDetailsSheetStore.hydrate();

  try {
    await userDetailsSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[Sheet Sync] findSheetUserByMobile pull skipped', error);
  }

  const local = userDetailsSheetStore
    .getAll()
    .find((row) => normalizeMobile(row.mobile) === mobile);
  if (local?.userName?.trim() || (local && local.userId > 0)) {
    return local;
  }

  try {
    const remote = (await userDetailsSheetSync.fetchRemoteRows()).find(
      (row) => normalizeMobile(row.mobile) === mobile,
    );
    if (remote && (remote.userName?.trim() || remote.userId > 0)) {
      return userDetailsSheetStore.upsertFromApp({
        userId: remote.userId > 0 ? remote.userId : undefined,
        mobile: remote.mobile || mobile,
        userName: remote.userName,
        email: remote.email,
        aadharNumber: remote.aadharNumber,
        corporateId: remote.corporateId,
        vehicleModel: remote.vehicleModel,
        vehicleColor: remote.vehicleColor,
        vehicleType: remote.vehicleType,
        vehicleNumberPlate: remote.vehicleNumberPlate,
        bhaiWayWallet: remote.bhaiWayWallet,
        profilePicture: remote.profilePicture,
        rc: remote.rc,
        corporateIdUrl: remote.corporateIdUrl,
      });
    }
  } catch (error) {
    console.log('[Sheet Sync] findSheetUserByMobile remote lookup failed', error);
  }

  return undefined;
};

/**
 * Login is allowed only when this mobile already exists in the sheet.
 * Signup creates the first sheet row via complete profile.
 */
export const assertSheetUserForLogin = async (phone?: string | null): Promise<UserDetailsSheetRow> => {
  const row = await findSheetUserByMobile(phone);
  if (!row) {
    throw Object.assign(
      new Error('No account found for this number. Please sign up first.'),
      { code: 'SHEET_USER_NOT_FOUND' },
    );
  }
  return row;
};

/** BhaiWayWallet amount for the logged-in user (from sheet/local store). */
export const getBhaiWayWalletBalance = (): number => {
  const row = findCurrentUserSheetRow();
  const amount = row?.bhaiWayWallet ?? 0;
  return Number.isFinite(amount) ? amount : 0;
};

export const formatBhaiWayWalletLabel = (amount = getBhaiWayWalletBalance()): string =>
  formatBhaiWayCoins(amount);

export const subscribeBhaiWayWallet = (onStoreChange: () => void): (() => void) => {
  const unsubSheet = userDetailsSheetStore.subscribe(() => onStoreChange());
  const unsubAuth = authSession.subscribe(() => onStoreChange());
  return () => {
    unsubSheet();
    unsubAuth();
  };
};

/**
 * Set/add wallet amount on the current user's sheet row and sync remotely when possible.
 */
export const updateBhaiWayWalletBalance = async (
  nextAmount: number,
  options?: { mode?: 'set' | 'add' },
): Promise<number> => {
  const mode = options?.mode ?? 'set';
  const user = authSession.getUser();
  const existing = findCurrentUserSheetRow();
  const current = existing?.bhaiWayWallet ?? 0;
  const amount = mode === 'add' ? current + nextAmount : nextAmount;
  const safeAmount = Math.max(0, Number.isFinite(amount) ? amount : 0);

  await userDetailsSheetSync.validateAndSync({
    userId: existing?.userId,
    userName: existing?.userName || user?.fullName?.trim() || 'User',
    email: existing?.email || user?.email || '',
    aadharNumber: existing?.aadharNumber,
    corporateId: existing?.corporateId,
    mobile: existing?.mobile || user?.phone || '',
    vehicleModel: existing?.vehicleModel,
    vehicleColor: existing?.vehicleColor,
    vehicleType: existing?.vehicleType,
    vehicleNumberPlate: existing?.vehicleNumberPlate,
    bhaiWayWallet: safeAmount,
    profilePicture: existing?.profilePicture,
    rc: existing?.rc,
    corporateIdUrl: existing?.corporateIdUrl,
    role: existing?.role,
  });

  return safeAmount;
};

/** Append one wallet credit/debit row (local + WalletTransactions sheet). */
export const recordWalletTransaction = async (input: {
  title: string;
  amount: number;
  type: WalletTransactionSheetType;
  icon?: WalletTransactionSheetIcon;
  reference?: string;
  dateLabel?: string;
}): Promise<WalletTransactionSyncResult> =>
  walletTransactionsSheetSync.upsertAndSync({
    title: input.title,
    amount: input.amount,
    type: input.type,
    icon: input.icon,
    reference: input.reference,
    dateLabel: input.dateLabel,
  });

/**
 * Apply sheet row (name, phone, Cloudinary profile picture) onto the auth session.
 * Call after login / pull so returning users see the same photo.
 */
export const applySheetProfileToSession = (): UserDetailsSheetRow | undefined => {
  const row = findCurrentUserSheetRow();
  const user = authSession.getUser();
  const token = authSession.getToken();
  if (!row || !user || !token) {
    return row;
  }

  authSession.setSession(token, {
    ...user,
    fullName: row.userName?.trim() || user.fullName,
    email: row.email?.trim() || user.email,
    avatarUri: row.profilePicture?.trim() || user.avatarUri,
    phone: row.mobile?.trim() || user.phone,
  });

  return row;
};

/**
 * Pull Google Sheet into local store, then restore session profile fields.
 */
export const hydrateSessionFromSheet = async (): Promise<UserDetailsSheetRow | undefined> => {
  try {
    await userDetailsSheetSync.pullIntoLocal();
  } catch (error) {
    console.log('[Sheet Sync] hydrateSessionFromSheet pull skipped', error);
  }
  return applySheetProfileToSession();
};

/** Share CSV so it can be pasted into Google Sheets (needed when webhook is not set). */
export const shareUserDetailsSheetCsv = async (): Promise<void> => {
  const csv = userDetailsSheetStore.toCsv();
  console.log('[UserDetails Sheet CSV]\n' + csv);
  await Share.share({
    message: csv,
    title: 'BhaiWay UserDetails CSV',
  });
};

/** Share Vehicles tab CSV (header + remaining local rows) for paste into Google Sheets. */
export const shareVehiclesSheetCsv = async (): Promise<void> => {
  const csv = vehiclesSheetStore.toCsv();
  console.log('[Vehicles Sheet CSV]\n' + csv);
  await Share.share({
    message: csv,
    title: 'BhaiWay Vehicles CSV',
  });
};

/** Push every local sheet row to Google Sheet via webhook. */
export const pushAllLocalRowsToSheet = async (): Promise<{
  attempted: number;
  synced: number;
}> => {
  const rows = userDetailsSheetStore.getAll();
  let synced = 0;
  for (const row of rows) {
    const ok = await userDetailsSheetSync.pushRemote(
      {
        userId: row.userId,
        userName: row.userName,
        email: row.email,
        aadharNumber: row.aadharNumber,
        corporateId: row.corporateId,
        vehicleModel: row.vehicleModel,
        vehicleColor: row.vehicleColor,
        vehicleType: row.vehicleType,
        vehicleNumberPlate: row.vehicleNumberPlate,
        bhaiWayWallet: row.bhaiWayWallet,
        mobile: row.mobile,
        profilePicture: row.profilePicture,
        rc: row.rc,
        corporateIdUrl: row.corporateIdUrl,
        role: row.role,
      },
      'update',
    );
    if (ok) {
      synced += 1;
    }
  }
  return { attempted: rows.length, synced };
};
