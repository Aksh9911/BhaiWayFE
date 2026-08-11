import { env } from '@/config';
import { DEMO_GOOGLE_SHEET_ID, DEMO_SHEET_LINKS } from '@/DemoData/files';

import type { UserDetailsSheetRow } from '../userDetailsSheet.types';
import {
  USER_DETAILS_SHEET_FIELD_KEYS,
  USER_DETAILS_SHEET_HEADERS,
  USER_DETAILS_USER_ID_START,
  normalizeSheetRole,
} from '../userDetailsSheet.types';
import { userDetailsSheetStore } from '../userDetailsSheetStore';
import { normalizeHeader, parseCsv } from './csv';
import type {
  RemoteUserDetailsRow,
  SheetSyncResult,
  SheetValidationInput,
  SheetValidationResult,
} from './sheet.types';

/** Name-based fallback when sheet column order differs (CorporateID → text only). */
const headerMap: Record<string, keyof RemoteUserDetailsRow> = {
  userid: 'userId',
  username: 'userName',
  email: 'email',
  aadharnumber: 'aadharNumber',
  corporateid: 'corporateId',
  vehiclemodel: 'vehicleModel',
  vehiclecolor: 'vehicleColor',
  vehicletype: 'vehicleType',
  vehiclenumberplate: 'vehicleNumberPlate',
  bhaiwaywallet: 'bhaiWayWallet',
  mobile: 'mobile',
  profilepicture: 'profilePicture',
  rc: 'rc',
  corporateidurl: 'corporateIdUrl',
  'user id': 'userId',
  'user name': 'userName',
  'aadhar number': 'aadharNumber',
  'aadhaar number': 'aadharNumber',
  aadhar: 'aadharNumber',
  aadhaar: 'aadharNumber',
  'corporate id': 'corporateId',
  'vehicle model': 'vehicleModel',
  'vehicle color': 'vehicleColor',
  'vehicle type': 'vehicleType',
  'vehicle number plate': 'vehicleNumberPlate',
  'bhaiway wallet': 'bhaiWayWallet',
  phone: 'mobile',
  'phone number': 'mobile',
  'profile picture': 'profilePicture',
  'corporate id url': 'corporateIdUrl',
  role: 'role',
  'user role': 'role',
};

const emptyRemote = (): RemoteUserDetailsRow => ({
  userId: 0,
  userName: '',
  email: '',
  aadharNumber: '',
  corporateId: '',
  vehicleModel: '',
  vehicleColor: '',
  vehicleType: '',
  vehicleNumberPlate: '',
  bhaiWayWallet: 0,
  mobile: '',
  profilePicture: '',
  rc: '',
  corporateIdUrl: '',
  role: 'Both',
});

const normalizeKey = (value?: string | null): string =>
  (value ?? '').trim().toLowerCase().replace(/\s+/g, ' ');

const normalizeAadhaar = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-4) || normalizeKey(value);

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const sheetCsvUrl = (): string =>
  DEMO_SHEET_LINKS.userDetailsCsv(env.googleSheetId || DEMO_GOOGLE_SHEET_ID);

const assignCell = (
  row: RemoteUserDetailsRow,
  key: keyof RemoteUserDetailsRow,
  raw: string,
): void => {
  if (key === 'bhaiWayWallet' || key === 'userId') {
    const amount = Number(String(raw).replace(/[^\d.]/g, ''));
    row[key] = Number.isFinite(amount) ? Math.floor(amount) : 0;
    return;
  }
  if (key === 'role') {
    row.role = normalizeSheetRole(raw);
    return;
  }
  row[key] = raw;
};

const mapCsvToRemoteRows = (csv: string): RemoteUserDetailsRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }

  const headers = table[0].map(normalizeHeader);
  const expected = USER_DETAILS_SHEET_HEADERS.map(normalizeHeader);
  const usePositional =
    headers.length >= expected.length &&
    expected.every((header, index) => headers[index] === header);

  // Positional mapping handles duplicate "CorporateID" (text at index 4, URL at index 13).
  const indexes: Array<keyof RemoteUserDetailsRow | null> = usePositional
    ? USER_DETAILS_SHEET_FIELD_KEYS.map((key) => key)
    : headers.map((header, index) => {
        if (header === 'corporateid') {
          // First CorporateID → text; later ones → Cloudinary URL.
          const prior = headers.slice(0, index).filter((h) => h === 'corporateid').length;
          return prior === 0 ? 'corporateId' : 'corporateIdUrl';
        }
        if (header === 'rc') {
          return 'rc';
        }
        return headerMap[header] ?? null;
      });

  if (table.length < 2) {
    return [];
  }

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyRemote();
      indexes.forEach((key, index) => {
        if (!key) {
          return;
        }
        assignCell(row, key, (cells[index] ?? '').trim());
      });
      return row;
    })
    .filter(
      (row) =>
        row.userName ||
        row.email ||
        row.aadharNumber ||
        row.mobile ||
        row.vehicleNumberPlate ||
        row.profilePicture ||
        row.rc ||
        row.corporateIdUrl ||
        row.userId > 0,
    );
};

const localToRemote = (row: UserDetailsSheetRow): RemoteUserDetailsRow => ({
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
  role: normalizeSheetRole(row.role),
});

const findMatch = (
  rows: RemoteUserDetailsRow[],
  input: SheetValidationInput,
): RemoteUserDetailsRow | undefined => {
  const mobile = normalizeMobile(input.mobile);
  const aadhaar = normalizeAadhaar(input.aadharNumber);
  const name = normalizeKey(input.userName);
  const userId = input.userId;

  return rows.find((row) => {
    if (userId != null && userId > 0 && row.userId === userId) {
      return true;
    }
    const rowMobile = normalizeMobile(row.mobile);
    const rowAadhaar = normalizeAadhaar(row.aadharNumber);
    const rowName = normalizeKey(row.userName);

    if (mobile && rowMobile && mobile === rowMobile) {
      return true;
    }
    if (aadhaar && rowAadhaar && aadhaar === rowAadhaar) {
      return true;
    }
    if (name && rowName && name === rowName) {
      return true;
    }
    return false;
  });
};

const resolveNextUserId = (combined: RemoteUserDetailsRow[]): number => {
  const ids = combined
    .map((row) => row.userId)
    .filter((id) => Number.isFinite(id) && id >= USER_DETAILS_USER_ID_START);
  if (ids.length === 0) {
    return USER_DETAILS_USER_ID_START;
  }
  return Math.max(...ids) + 1;
};

const pickMedia = (
  input: string | undefined,
  matched: string | undefined,
  local: string | undefined,
): string => {
  const next = input?.trim();
  if (next) {
    return next;
  }
  return matched?.trim() || local?.trim() || '';
};

/**
 * Two-way Google Sheet sync for UserDetails:
 * - READ: fetch CSV (validate / hydrate)
 * - WRITE: Apps Script webhook (insert/update) when configured
 */
export const userDetailsSheetSync = {
  fetchRemoteRows: async (): Promise<RemoteUserDetailsRow[]> => {
    const url = sheetCsvUrl();
    console.log('[Sheet Sync] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    console.log('[Sheet Sync] fetch response', {
      httpStatus: response.status,
      bytes: text.length,
      preview: text.slice(0, 240),
    });
    if (!response.ok) {
      throw new Error('Unable to read Google Sheet. Check sharing is Anyone with the link → Viewer.');
    }
    return mapCsvToRemoteRows(text);
  },

  /**
   * Pull sheet → local store (does not delete local-only rows).
   * Matching is by mobile, then aadhaar last-4, then user name.
   */
  pullIntoLocal: async (): Promise<RemoteUserDetailsRow[]> => {
    const remoteRows = await userDetailsSheetSync.fetchRemoteRows();
    await userDetailsSheetStore.hydrate();

    for (const remote of remoteRows) {
      await userDetailsSheetStore.upsertFromApp({
        userId: remote.userId > 0 ? remote.userId : undefined,
        mobile: remote.mobile || undefined,
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
        role: remote.role,
      });
    }

    return remoteRows;
  },

  /**
   * Validate profile data against the live sheet (+ local mirror).
   * - insert: no matching row
   * - update: matching row found and no conflicting identity fields
   */
  validate: async (input: SheetValidationInput): Promise<SheetValidationResult> => {
    const errors: string[] = [];
    const userName = input.userName?.trim() ?? '';

    if (userName.length < 2) {
      errors.push('User name is required.');
    }

    let remoteRows: RemoteUserDetailsRow[] = [];
    try {
      remoteRows = await userDetailsSheetSync.fetchRemoteRows();
    } catch (error) {
      console.log('[Sheet Sync] validate fetch failed, using local only', error);
      remoteRows = userDetailsSheetStore.getAll().map(localToRemote);
    }

    const localRows = userDetailsSheetStore.getAll().map(localToRemote);
    const combined = [...remoteRows];
    for (const local of localRows) {
      if (!findMatch(combined, local)) {
        combined.push(local);
      }
    }

    const matched = findMatch(combined, input);
    const aadhaar = normalizeAadhaar(input.aadharNumber);
    const mobile = normalizeMobile(input.mobile);
    const corporate = normalizeKey(input.corporateId);

    if (matched) {
      const matchedAadhaar = normalizeAadhaar(matched.aadharNumber);
      const matchedName = normalizeKey(matched.userName);
      const matchedMobile = normalizeMobile(matched.mobile);

      if (aadhaar && matchedAadhaar && aadhaar === matchedAadhaar && matchedName && matchedName !== normalizeKey(userName)) {
        errors.push('This Aadhaar is already linked to a different user name in the sheet.');
      }
      if (mobile && matchedMobile && mobile === matchedMobile && matchedName && matchedName !== normalizeKey(userName)) {
        errors.push('This mobile is already linked to a different user name in the sheet.');
      }
      if (
        aadhaar &&
        matchedAadhaar &&
        matchedAadhaar !== aadhaar &&
        matchedName === normalizeKey(userName)
      ) {
        errors.push('User name exists in the sheet with a different Aadhaar.');
      }
    }

    if (corporate) {
      const conflict = combined.find(
        (row) =>
          normalizeKey(row.corporateId) === corporate &&
          normalizeKey(row.userName) !== normalizeKey(userName) &&
          (!aadhaar || normalizeAadhaar(row.aadharNumber) !== aadhaar),
      );
      if (conflict) {
        errors.push('Corporate ID is already used by another user in the sheet.');
      }
    }

    if (aadhaar && !matched) {
      const other = combined.find((row) => normalizeAadhaar(row.aadharNumber) === aadhaar);
      if (other && normalizeKey(other.userName) !== normalizeKey(userName)) {
        errors.push('Aadhaar already exists for another user in the sheet.');
      }
    }

    return {
      ok: errors.length === 0,
      mode: matched ? 'update' : 'insert',
      errors,
      matched,
      nextUserId: matched?.userId && matched.userId > 0 ? matched.userId : resolveNextUserId(combined),
      remoteRows,
    };
  },

  /** Push one row to Google Sheet via Apps Script webhook (insert or update). */
  pushRemote: async (
    row: RemoteUserDetailsRow,
    mode: 'insert' | 'update',
  ): Promise<boolean> => {
    const webhook = env.googleSheetWebhookUrl;
    if (!webhook) {
      console.log('[Sheet Sync] push skipped (no EXPO_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL)', {
        mode,
        row,
      });
      return false;
    }

    const body = { action: mode, row };
    console.log('[Sheet Sync] push request', { webhook, body });
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('[Sheet Sync] push response', { httpStatus: response.status, body: text });
    return response.ok;
  },

  /**
   * Validate → save local → push remote.
   * Call this when profile (or sheet fields) are created/updated in the app.
   */
  validateAndSync: async (input: SheetValidationInput): Promise<SheetSyncResult> => {
    const validation = await userDetailsSheetSync.validate(input);
    if (!validation.ok) {
      throw Object.assign(new Error(validation.errors.join('\n')), {
        code: 'SHEET_VALIDATION_FAILED',
        errors: validation.errors,
      });
    }

    const assignedUserId =
      validation.mode === 'update' && validation.matched?.userId
        ? validation.matched.userId
        : validation.nextUserId ?? userDetailsSheetStore.nextUserId(
            validation.remoteRows.map((row) => row.userId),
          );

    const existingLocal = userDetailsSheetStore.findByUserId(assignedUserId);

    // Keep existing sheet wallet / media unless caller explicitly passes new values.
    const walletAmount =
      input.bhaiWayWallet !== undefined
        ? input.bhaiWayWallet
        : validation.matched?.bhaiWayWallet ?? existingLocal?.bhaiWayWallet ?? 0;

    const saved = await userDetailsSheetStore.upsertFromApp({
      userId: assignedUserId,
      mobile: input.mobile,
      userName: input.userName,
      email: input.email,
      aadharNumber: input.aadharNumber,
      corporateId: input.corporateId,
      vehicleModel: input.vehicleModel,
      vehicleColor: input.vehicleColor,
      vehicleType: input.vehicleType,
      vehicleNumberPlate: input.vehicleNumberPlate,
      bhaiWayWallet: walletAmount,
      profilePicture: pickMedia(
        input.profilePicture,
        validation.matched?.profilePicture,
        existingLocal?.profilePicture,
      ),
      rc: pickMedia(input.rc, validation.matched?.rc, existingLocal?.rc),
      corporateIdUrl: pickMedia(
        input.corporateIdUrl,
        validation.matched?.corporateIdUrl,
        existingLocal?.corporateIdUrl,
      ),
      role: normalizeSheetRole(
        input.role || validation.matched?.role || existingLocal?.role || 'Both',
      ),
    });

    const remotePayload = localToRemote(saved);
    if (input.mobile) {
      remotePayload.mobile = normalizeMobile(input.mobile) || input.mobile;
    }

    let remoteSynced = false;
    try {
      remoteSynced = await userDetailsSheetSync.pushRemote(remotePayload, validation.mode);
    } catch (error) {
      console.log('[Sheet Sync] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode: validation.mode,
      userId: saved.userId,
      message: remoteSynced
        ? `UserID ${saved.userId} ${validation.mode === 'insert' ? 'inserted into' : 'updated in'} Google Sheet.`
        : `UserID ${saved.userId} saved locally (${validation.mode}). Add EXPO_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL to sync writes to the sheet.`,
    };
  },

  /** Remove vehicle fields from the current user's sheet row (local + remote when possible). */
  clearVehicle: async (rowId: number): Promise<SheetSyncResult> => {
    const cleared = await userDetailsSheetStore.clearVehicleFields(rowId);
    if (!cleared) {
      throw Object.assign(new Error('Vehicle not found.'), { code: 'VEHICLE_NOT_FOUND' });
    }

    let remoteSynced = false;
    try {
      remoteSynced = await userDetailsSheetSync.pushRemote(localToRemote(cleared), 'update');
    } catch (error) {
      console.log('[Sheet Sync] clearVehicle push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode: 'update',
      userId: cleared.userId,
      message: remoteSynced
        ? `UserID ${cleared.userId} vehicle cleared from Google Sheet.`
        : `UserID ${cleared.userId} vehicle cleared locally.`,
    };
  },
};
