import AsyncStorage from '@react-native-async-storage/async-storage';
import { env } from '@/config';
import {
  DEMO_GOOGLE_SHEET_ID,
  DEMO_SHEET_LINKS,
  DEMO_STORAGE_KEYS,
  DEMO_VEHICLES_SHEET_GID,
} from '@/DemoData/files';
import { authSession } from '@/store';

import { userDetailsSheetStore } from '../userDetailsSheetStore';
import { normalizeHeader, parseCsv } from './csv';
import {
  VEHICLES_SHEET_FIELD_KEYS,
  VEHICLES_SHEET_HEADERS,
  VEHICLES_SHEET_VEHICLE_ID_START,
  type VehiclesSheetRow,
} from '../vehiclesSheet.types';
import { vehiclesSheetStore } from '../vehiclesSheetStore';

export interface RemoteVehicleRow {
  vehicleId: number;
  userId: number;
  mobile: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleType: string;
  vehicleNumberPlate: string;
  rc: string;
}

export interface VehicleSyncInput {
  vehicleId?: number;
  userId?: number;
  mobile?: string;
  vehicleModel: string;
  vehicleColor?: string;
  vehicleType?: string;
  vehicleNumberPlate: string;
  rc?: string;
}

export interface VehicleSyncResult {
  localRowSaved: boolean;
  remoteSynced: boolean;
  mode: 'insert' | 'update' | 'delete';
  vehicleId: number;
  message: string;
}

interface DeletedVehicleMark {
  vehicleId: number;
  plate: string;
}

let deletedMarks: DeletedVehicleMark[] = [];
let deletedHydrated = false;

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const normalizePlate = (value?: string | null): string =>
  (value ?? '').replace(/\s+/g, ' ').trim().toUpperCase();

const hydrateDeletedMarks = async (): Promise<DeletedVehicleMark[]> => {
  if (deletedHydrated) {
    return deletedMarks;
  }
  try {
    const raw = await AsyncStorage.getItem(DEMO_STORAGE_KEYS.vehiclesDeleted);
    const parsed = raw ? (JSON.parse(raw) as DeletedVehicleMark[]) : [];
    deletedMarks = Array.isArray(parsed) ? parsed : [];
  } catch {
    deletedMarks = [];
  }
  deletedHydrated = true;
  return deletedMarks;
};

const persistDeletedMarks = async (): Promise<void> => {
  await AsyncStorage.setItem(DEMO_STORAGE_KEYS.vehiclesDeleted, JSON.stringify(deletedMarks));
};

const isDeletedMark = (vehicleId: number, plate: string): boolean => {
  const key = normalizePlate(plate);
  return deletedMarks.some(
    (mark) =>
      (vehicleId > 0 && mark.vehicleId === vehicleId) ||
      (key.length > 0 && mark.plate === key),
  );
};

const markVehicleDeleted = async (vehicleId: number, plate: string): Promise<void> => {
  await hydrateDeletedMarks();
  const key = normalizePlate(plate);
  deletedMarks = [
    ...deletedMarks.filter(
      (mark) =>
        !(vehicleId > 0 && mark.vehicleId === vehicleId) &&
        !(key.length > 0 && mark.plate === key),
    ),
    { vehicleId: vehicleId > 0 ? vehicleId : 0, plate: key },
  ];
  await persistDeletedMarks();
};

const clearDeletedMarksGoneFromRemote = async (remoteRows: RemoteVehicleRow[]): Promise<void> => {
  await hydrateDeletedMarks();
  const before = deletedMarks.length;
  deletedMarks = deletedMarks.filter((mark) => {
    const stillOnSheet = remoteRows.some(
      (row) =>
        (mark.vehicleId > 0 && row.vehicleId === mark.vehicleId) ||
        (mark.plate && normalizePlate(row.vehicleNumberPlate) === mark.plate),
    );
    // Keep tombstone while sheet still has the row; drop once sheet no longer has it.
    return stillOnSheet;
  });
  if (deletedMarks.length !== before) {
    await persistDeletedMarks();
  }
};

const headerMap: Record<string, keyof RemoteVehicleRow> = {
  vehicleid: 'vehicleId',
  userid: 'userId',
  mobile: 'mobile',
  vehiclemodel: 'vehicleModel',
  vehiclecolor: 'vehicleColor',
  vehicletype: 'vehicleType',
  vehiclenumberplate: 'vehicleNumberPlate',
  rc: 'rc',
  'vehicle id': 'vehicleId',
  'user id': 'userId',
  'vehicle model': 'vehicleModel',
  'vehicle color': 'vehicleColor',
  'vehicle type': 'vehicleType',
  'vehicle number plate': 'vehicleNumberPlate',
  phone: 'mobile',
};

const emptyRemote = (): RemoteVehicleRow => ({
  vehicleId: 0,
  userId: 0,
  mobile: '',
  vehicleModel: '',
  vehicleColor: '',
  vehicleType: '',
  vehicleNumberPlate: '',
  rc: '',
});

const sheetCsvUrl = (): string =>
  DEMO_SHEET_LINKS.vehiclesCsv(
    env.googleSheetId || DEMO_GOOGLE_SHEET_ID,
    env.googleSheetVehiclesGid || DEMO_VEHICLES_SHEET_GID,
  );

const assignCell = (row: RemoteVehicleRow, key: keyof RemoteVehicleRow, raw: string): void => {
  if (key === 'vehicleId' || key === 'userId') {
    const amount = Number(String(raw).replace(/[^\d.]/g, ''));
    row[key] = Number.isFinite(amount) ? Math.floor(amount) : 0;
    return;
  }
  row[key] = raw;
};

const mapCsvToRemoteRows = (csv: string): RemoteVehicleRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }

  const headers = table[0].map(normalizeHeader);
  const expected = VEHICLES_SHEET_HEADERS.map(normalizeHeader);
  const ordered =
    expected.length > 0 && expected.every((name, index) => headers[index] === name)
      ? VEHICLES_SHEET_FIELD_KEYS.map((key) => key)
      : null;

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyRemote();
      if (ordered) {
        ordered.forEach((key, index) => {
          assignCell(row, key as keyof RemoteVehicleRow, cells[index] ?? '');
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
    .filter((row) => row.vehicleId > 0 || row.vehicleNumberPlate || row.vehicleModel);
};

const localToRemote = (row: VehiclesSheetRow): RemoteVehicleRow => ({
  vehicleId: row.vehicleId,
  userId: row.userId,
  mobile: row.mobile,
  vehicleModel: row.vehicleModel,
  vehicleColor: row.vehicleColor,
  vehicleType: row.vehicleType,
  vehicleNumberPlate: row.vehicleNumberPlate,
  rc: row.rc,
});

/**
 * Seed Vehicles store from legacy UserDetails vehicle columns (one car per user).
 */
const migrateLegacyUserDetailsVehicles = async (): Promise<void> => {
  await hydrateDeletedMarks();
  const users = userDetailsSheetStore.getAll();
  for (const user of users) {
    const plate = normalizePlate(user.vehicleNumberPlate);
    const model = user.vehicleModel?.trim();
    if (!plate && !model) {
      continue;
    }
    if (isDeletedMark(0, plate || `LEGACY-${user.userId}`)) {
      continue;
    }
    if (plate && vehiclesSheetStore.findByPlate(plate, user.userId)) {
      continue;
    }
    await vehiclesSheetStore.upsert({
      userId: user.userId,
      mobile: user.mobile,
      vehicleModel: model || 'Vehicle',
      vehicleColor: user.vehicleColor,
      vehicleType: user.vehicleType,
      vehicleNumberPlate: plate || `LEGACY-${user.userId}`,
      rc: user.rc,
    });
  }
};

/** Clear matching legacy UserDetails vehicle columns so migrate cannot resurrect the car. */
const clearLegacyUserDetailsVehicle = async (vehicle: VehiclesSheetRow): Promise<boolean> => {
  const plate = normalizePlate(vehicle.vehicleNumberPlate);
  const owner =
    (vehicle.userId > 0 ? userDetailsSheetStore.findByUserId(vehicle.userId) : undefined) ||
    (vehicle.mobile ? userDetailsSheetStore.findByMobile(vehicle.mobile) : undefined);
  if (!owner) {
    return false;
  }
  const ownerPlate = normalizePlate(owner.vehicleNumberPlate);
  if (!plate || ownerPlate !== plate) {
    return false;
  }

  const cleared = await userDetailsSheetStore.clearVehicleFields(owner.row_id);
  if (!cleared) {
    return false;
  }

  try {
    const { userDetailsSheetSync } = await import('./userDetailsSheetSync');
    await userDetailsSheetSync.pushRemote(
      {
        userId: cleared.userId,
        userName: cleared.userName,
        email: cleared.email,
        aadharNumber: cleared.aadharNumber,
        corporateId: cleared.corporateId,
        vehicleModel: '',
        vehicleColor: '',
        vehicleType: '',
        vehicleNumberPlate: '',
        bhaiWayWallet: cleared.bhaiWayWallet,
        mobile: cleared.mobile,
        profilePicture: cleared.profilePicture,
        rc: '',
        corporateIdUrl: cleared.corporateIdUrl,
        role: cleared.role,
      },
      'update',
    );
  } catch (error) {
    console.log('[Vehicles Sheet] legacy UserDetails clear push skipped', error);
  }
  return true;
};

const parseWebhookOk = (text: string, httpOk: boolean): boolean => {
  const trimmed = text.trim();
  if (!trimmed) {
    return httpOk;
  }
  try {
    const json = JSON.parse(trimmed) as { ok?: boolean };
    if (typeof json.ok === 'boolean') {
      return json.ok;
    }
  } catch {
    // Non-JSON body (e.g. HTML) — treat HTTP status as best signal.
  }
  return httpOk && !trimmed.startsWith('<');
};

export const vehiclesSheetSync = {
  fetchRemoteRows: async (): Promise<RemoteVehicleRow[] | null> => {
    const url = sheetCsvUrl();
    console.log('[Vehicles Sheet] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    console.log('[Vehicles Sheet] fetch response', {
      httpStatus: response.status,
      bytes: text.length,
      preview: text.slice(0, 240),
    });
    if (!response.ok) {
      throw new Error('Unable to read Vehicles sheet. Create a Vehicles tab or check gid.');
    }
    // Empty/wrong tab may return HTML error or UserDetails headers.
    if (
      text.trim().startsWith('<') ||
      !normalizeHeader(text.split('\n')[0] ?? '').includes('vehicle')
    ) {
      console.log('[Vehicles Sheet] tab missing or wrong gid — using local vehicles only');
      return null;
    }
    return mapCsvToRemoteRows(text);
  },

  pullIntoLocal: async (): Promise<RemoteVehicleRow[]> => {
    await vehiclesSheetStore.hydrate();
    await hydrateDeletedMarks();
    let remoteRows: RemoteVehicleRow[] = [];
    try {
      const remote = await vehiclesSheetSync.fetchRemoteRows();
      if (remote) {
        remoteRows = remote;
        await clearDeletedMarksGoneFromRemote(remoteRows);
      }
    } catch (error) {
      console.log('[Vehicles Sheet] pull skipped', error);
    }

    for (const remote of remoteRows) {
      if (isDeletedMark(remote.vehicleId, remote.vehicleNumberPlate)) {
        console.log('[Vehicles Sheet] skip re-import of deleted vehicle', {
          vehicleId: remote.vehicleId,
          plate: remote.vehicleNumberPlate,
        });
        // Keep pushing delete until sheet confirms removal.
        try {
          await vehiclesSheetSync.pushRemote(remote, 'delete');
        } catch (error) {
          console.log('[Vehicles Sheet] re-delete push failed', error);
        }
        continue;
      }
      await vehiclesSheetStore.upsert({
        vehicleId: remote.vehicleId > 0 ? remote.vehicleId : undefined,
        userId: remote.userId > 0 ? remote.userId : undefined,
        mobile: remote.mobile || undefined,
        vehicleModel: remote.vehicleModel,
        vehicleColor: remote.vehicleColor,
        vehicleType: remote.vehicleType,
        vehicleNumberPlate: remote.vehicleNumberPlate,
        rc: remote.rc,
      });
    }

    // Legacy UserDetails single-vehicle columns → Vehicles store (skips tombstoned plates).
    await migrateLegacyUserDetailsVehicles();
    return remoteRows;
  },

  pushRemote: async (
    row: RemoteVehicleRow,
    mode: 'insert' | 'update' | 'delete',
  ): Promise<boolean> => {
    const webhook = env.googleSheetWebhookUrl;
    if (!webhook) {
      console.log('[Vehicles Sheet] push skipped (no webhook)', { mode, row });
      return false;
    }

    const body = { entity: 'vehicle', action: mode, row };
    console.log('[Vehicles Sheet] push request', { webhook, body });
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('[Vehicles Sheet] push response', { httpStatus: response.status, body: text });
    if (!response.ok) {
      return false;
    }
    return parseWebhookOk(text, response.ok);
  },

  /**
   * Add or update one vehicle for the current (or given) user.
   * Also marks UserDetails Role as Both (driver + rider) when a vehicle exists.
   */
  upsertAndSync: async (input: VehicleSyncInput): Promise<VehicleSyncResult> => {
    const plate = normalizePlate(input.vehicleNumberPlate);
    const model = input.vehicleModel.trim();
    if (!plate || !model) {
      throw Object.assign(new Error('Vehicle model and number plate are required.'), {
        code: 'VEHICLE_VALIDATION_FAILED',
      });
    }

    const sessionPhone = normalizeMobile(authSession.getUser()?.phone);
    const owner =
      (input.userId && input.userId > 0
        ? userDetailsSheetStore.findByUserId(input.userId)
        : undefined) ||
      (sessionPhone ? userDetailsSheetStore.findByMobile(sessionPhone) : undefined) ||
      userDetailsSheetStore.getAll()[0];
    const resolvedUserId = input.userId || owner?.userId || 0;
    const mobile =
      normalizeMobile(input.mobile) || owner?.mobile || sessionPhone || '';

    const existing =
      (input.vehicleId && input.vehicleId > 0
        ? vehiclesSheetStore.getAll().find((row) => row.vehicleId === input.vehicleId)
        : undefined) || vehiclesSheetStore.findByPlate(plate, resolvedUserId || undefined);

    const mode: 'insert' | 'update' = existing ? 'update' : 'insert';
    const vehicleId =
      existing?.vehicleId && existing.vehicleId > 0
        ? existing.vehicleId
        : input.vehicleId && input.vehicleId >= VEHICLES_SHEET_VEHICLE_ID_START
          ? input.vehicleId
          : vehiclesSheetStore.nextVehicleId();

    // Re-adding a previously deleted plate clears the tombstone.
    await hydrateDeletedMarks();
    deletedMarks = deletedMarks.filter(
      (mark) =>
        !(vehicleId > 0 && mark.vehicleId === vehicleId) && !(plate && mark.plate === plate),
    );
    await persistDeletedMarks();

    const saved = await vehiclesSheetStore.upsert({
      vehicleId,
      userId: resolvedUserId,
      mobile,
      vehicleModel: model,
      vehicleColor: input.vehicleColor,
      vehicleType: input.vehicleType,
      vehicleNumberPlate: plate,
      rc: input.rc,
    });

    // Owning a vehicle ⇒ user can drive and ride.
    if (owner) {
      try {
        const { userDetailsSheetSync } = await import('./userDetailsSheetSync');
        await userDetailsSheetSync.validateAndSync({
          userId: owner.userId,
          userName: owner.userName || 'User',
          email: owner.email,
          mobile: owner.mobile || mobile,
          role: 'Both',
        });
      } catch (error) {
        console.log('[Vehicles Sheet] role update skipped', error);
      }
    }

    let remoteSynced = false;
    try {
      remoteSynced = await vehiclesSheetSync.pushRemote(localToRemote(saved), mode);
    } catch (error) {
      console.log('[Vehicles Sheet] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode,
      vehicleId: saved.vehicleId,
      message: remoteSynced
        ? `VehicleID ${saved.vehicleId} ${mode === 'insert' ? 'added to' : 'updated in'} Vehicles sheet.`
        : `VehicleID ${saved.vehicleId} saved locally (${mode}).`,
    };
  },

  /**
   * Delete one vehicle locally and from the Vehicles Google Sheet tab.
   * Also clears matching legacy UserDetails vehicle columns when present.
   */
  deleteAndSync: async (rowId: number): Promise<VehicleSyncResult> => {
    const existing = vehiclesSheetStore.getById(rowId);
    if (!existing) {
      throw Object.assign(new Error('Vehicle not found.'), { code: 'VEHICLE_NOT_FOUND' });
    }

    const remote = localToRemote(existing);
    await markVehicleDeleted(existing.vehicleId, existing.vehicleNumberPlate);
    await vehiclesSheetStore.removeById(rowId);
    await clearLegacyUserDetailsVehicle(existing);

    let remoteSynced = false;
    try {
      remoteSynced = await vehiclesSheetSync.pushRemote(remote, 'delete');
    } catch (error) {
      console.log('[Vehicles Sheet] delete push failed', error);
    }

    // Retry once if webhook is configured but first attempt failed.
    if (!remoteSynced && env.googleSheetWebhookUrl) {
      try {
        remoteSynced = await vehiclesSheetSync.pushRemote(remote, 'delete');
      } catch (error) {
        console.log('[Vehicles Sheet] delete retry failed', error);
      }
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode: 'delete',
      vehicleId: existing.vehicleId,
      message: remoteSynced
        ? `VehicleID ${existing.vehicleId} removed from Vehicles sheet.`
        : env.googleSheetWebhookUrl
          ? `VehicleID ${existing.vehicleId} removed locally. Sheet delete may still be pending.`
          : `VehicleID ${existing.vehicleId} removed locally. Set EXPO_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL to delete from the sheet automatically.`,
    };
  },
};
