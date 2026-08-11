import { env } from '@/config';
import {
  DEMO_GOOGLE_SHEET_ID,
  DEMO_PUBLISHED_RIDES_SHEET_GID,
  DEMO_SHEET_LINKS,
  PUBLISHED_RIDES_SHEET_FIELD_KEYS,
  PUBLISHED_RIDES_SHEET_HEADERS,
  PUBLISHED_RIDES_SHEET_ID_START,
} from '@/DemoData/files';
import { authSession } from '@/store';

import {
  type PublishedRideSheetStatus,
  type PublishedRideSheetType,
  type PublishedRidesSheetRow,
} from '../publishedRidesSheet.types';
import { publishedRidesSheetStore } from '../publishedRidesSheetStore';
import { userDetailsSheetStore } from '../userDetailsSheetStore';
import { normalizeHeader, parseCsv } from './csv';

export interface RemotePublishedRideRow {
  rideId: number;
  userId: number;
  mobile: string;
  rideType: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: string;
  preferences: string;
  notes: string;
  vehicleName: string;
  vehiclePlate: string;
  maxTwoInBack: boolean;
  womenOnly: boolean;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  status: string;
  publishedAt: string;
}

export interface PublishedRideSyncInput {
  rideId?: number;
  userId?: number;
  mobile?: string;
  rideType?: PublishedRideSheetType;
  origin: string;
  destination: string;
  departureDate?: string;
  departureTime?: string;
  availableSeats?: number;
  pricePerSeat?: string;
  preferences?: string;
  notes?: string;
  vehicleName?: string;
  vehiclePlate?: string;
  maxTwoInBack?: boolean;
  womenOnly?: boolean;
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
  status?: PublishedRideSheetStatus;
  publishedAt?: string;
}

export interface PublishedRideSyncResult {
  localRowSaved: boolean;
  remoteSynced: boolean;
  mode: 'insert' | 'update';
  rideId: number;
  message: string;
}

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const parseBool = (raw: string | boolean | undefined | null): boolean => {
  if (typeof raw === 'boolean') {
    return raw;
  }
  const key = String(raw ?? '')
    .trim()
    .toLowerCase();
  return key === 'true' || key === '1' || key === 'yes' || key === 'y';
};

const parseNumber = (raw: string, asFloat = false): number => {
  const amount = Number(String(raw).replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(amount)) {
    return 0;
  }
  return asFloat ? amount : Math.floor(amount);
};

const headerMap: Record<string, keyof RemotePublishedRideRow> = {
  rideid: 'rideId',
  userid: 'userId',
  mobile: 'mobile',
  ridetype: 'rideType',
  origin: 'origin',
  destination: 'destination',
  departuredate: 'departureDate',
  departuretime: 'departureTime',
  availableseats: 'availableSeats',
  priceperseat: 'pricePerSeat',
  preferences: 'preferences',
  notes: 'notes',
  vehiclename: 'vehicleName',
  vehicleplate: 'vehiclePlate',
  maxtwoinback: 'maxTwoInBack',
  womenonly: 'womenOnly',
  originlat: 'originLat',
  originlng: 'originLng',
  destlat: 'destLat',
  destlng: 'destLng',
  status: 'status',
  publishedat: 'publishedAt',
  'ride id': 'rideId',
  'user id': 'userId',
  'ride type': 'rideType',
  'departure date': 'departureDate',
  'departure time': 'departureTime',
  'available seats': 'availableSeats',
  'price per seat': 'pricePerSeat',
  'vehicle name': 'vehicleName',
  'vehicle plate': 'vehiclePlate',
  'max two in back': 'maxTwoInBack',
  'women only': 'womenOnly',
  'origin lat': 'originLat',
  'origin lng': 'originLng',
  'dest lat': 'destLat',
  'dest lng': 'destLng',
  'published at': 'publishedAt',
  phone: 'mobile',
};

const emptyRemote = (): RemotePublishedRideRow => ({
  rideId: 0,
  userId: 0,
  mobile: '',
  rideType: 'regular',
  origin: '',
  destination: '',
  departureDate: '',
  departureTime: '',
  availableSeats: 0,
  pricePerSeat: '',
  preferences: '',
  notes: '',
  vehicleName: '',
  vehiclePlate: '',
  maxTwoInBack: false,
  womenOnly: false,
  originLat: 0,
  originLng: 0,
  destLat: 0,
  destLng: 0,
  status: 'published',
  publishedAt: '',
});

const sheetCsvUrl = (): string =>
  DEMO_SHEET_LINKS.publishedRidesCsv(
    env.googleSheetId || DEMO_GOOGLE_SHEET_ID,
    env.googleSheetPublishedRidesGid || DEMO_PUBLISHED_RIDES_SHEET_GID,
  );

const assignCell = (
  row: RemotePublishedRideRow,
  key: keyof RemotePublishedRideRow,
  raw: string,
): void => {
  if (key === 'rideId' || key === 'userId' || key === 'availableSeats') {
    row[key] = parseNumber(raw);
    return;
  }
  if (
    key === 'originLat' ||
    key === 'originLng' ||
    key === 'destLat' ||
    key === 'destLng'
  ) {
    row[key] = parseNumber(raw, true);
    return;
  }
  if (key === 'maxTwoInBack' || key === 'womenOnly') {
    row[key] = parseBool(raw);
    return;
  }
  row[key] = raw;
};

const mapCsvToRemoteRows = (csv: string): RemotePublishedRideRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }
  const headers = table[0].map(normalizeHeader);
  const expected = PUBLISHED_RIDES_SHEET_HEADERS.map(normalizeHeader);
  const ordered =
    expected.every((name, index) => headers[index] === name)
      ? PUBLISHED_RIDES_SHEET_FIELD_KEYS.map((key) => key)
      : null;

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyRemote();
      if (ordered) {
        ordered.forEach((key, index) => {
          assignCell(row, key as keyof RemotePublishedRideRow, cells[index] ?? '');
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
    .filter((row) => row.rideId > 0 || row.origin || row.destination);
};

const localToRemote = (row: PublishedRidesSheetRow): RemotePublishedRideRow => ({
  rideId: row.rideId,
  userId: row.userId,
  mobile: row.mobile,
  rideType: row.rideType,
  origin: row.origin,
  destination: row.destination,
  departureDate: row.departureDate,
  departureTime: row.departureTime,
  availableSeats: row.availableSeats,
  pricePerSeat: row.pricePerSeat,
  preferences: row.preferences,
  notes: row.notes,
  vehicleName: row.vehicleName,
  vehiclePlate: row.vehiclePlate,
  maxTwoInBack: row.maxTwoInBack,
  womenOnly: row.womenOnly,
  originLat: row.originLat,
  originLng: row.originLng,
  destLat: row.destLat,
  destLng: row.destLng,
  status: row.status,
  publishedAt: row.publishedAt,
});

const resolveOwner = () => {
  const phone = normalizeMobile(authSession.getUser()?.phone);
  return (
    (phone ? userDetailsSheetStore.findByMobile(phone) : undefined) ||
    userDetailsSheetStore.getAll()[0]
  );
};

export const publishedRidesSheetSync = {
  fetchRemoteRows: async (): Promise<RemotePublishedRideRow[] | null> => {
    const url = sheetCsvUrl();
    console.log('[PublishedRides Sheet] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    console.log('[PublishedRides Sheet] fetch response', {
      httpStatus: response.status,
      bytes: text.length,
      preview: text.slice(0, 240),
    });
    if (!response.ok) {
      throw new Error('Unable to read PublishedRides sheet. Create the tab or check gid.');
    }
    if (
      text.trim().startsWith('<') ||
      !normalizeHeader(text.split('\n')[0] ?? '').includes('ride')
    ) {
      console.log('[PublishedRides Sheet] tab missing or wrong gid');
      return null;
    }
    return mapCsvToRemoteRows(text);
  },

  pullIntoLocal: async (): Promise<RemotePublishedRideRow[]> => {
    await publishedRidesSheetStore.hydrate();
    let remoteRows: RemotePublishedRideRow[] = [];
    try {
      const remote = await publishedRidesSheetSync.fetchRemoteRows();
      if (remote) {
        remoteRows = remote;
      }
    } catch (error) {
      console.log('[PublishedRides Sheet] pull skipped', error);
    }

    // Keep every published ride locally so search can list other drivers' offers.
    const sessionPhone = normalizeMobile(authSession.getUser()?.phone);
    for (const remote of remoteRows) {
      await publishedRidesSheetStore.upsert({
        rideId: remote.rideId > 0 ? remote.rideId : undefined,
        userId: remote.userId > 0 ? remote.userId : undefined,
        mobile: remote.mobile || sessionPhone || undefined,
        rideType: remote.rideType as PublishedRideSheetType,
        origin: remote.origin,
        destination: remote.destination,
        departureDate: remote.departureDate,
        departureTime: remote.departureTime,
        availableSeats: remote.availableSeats,
        pricePerSeat: remote.pricePerSeat,
        preferences: remote.preferences,
        notes: remote.notes,
        vehicleName: remote.vehicleName,
        vehiclePlate: remote.vehiclePlate,
        maxTwoInBack: remote.maxTwoInBack,
        womenOnly: remote.womenOnly,
        originLat: remote.originLat,
        originLng: remote.originLng,
        destLat: remote.destLat,
        destLng: remote.destLng,
        status: remote.status as PublishedRideSheetStatus,
        publishedAt: remote.publishedAt,
      });
    }
    return remoteRows;
  },

  pushRemote: async (
    row: RemotePublishedRideRow,
    mode: 'insert' | 'update',
  ): Promise<boolean> => {
    const webhook = env.googleSheetWebhookUrl;
    if (!webhook) {
      console.log('[PublishedRides Sheet] push skipped (no webhook)', { mode, row });
      return false;
    }
    const body = { entity: 'publishedRide', action: mode, row };
    console.log('[PublishedRides Sheet] push request', { webhook, body });
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('[PublishedRides Sheet] push response', {
      httpStatus: response.status,
      body: text,
    });
    return response.ok;
  },

  upsertAndSync: async (input: PublishedRideSyncInput): Promise<PublishedRideSyncResult> => {
    if (!input.origin.trim() || !input.destination.trim()) {
      throw Object.assign(new Error('Origin and destination are required.'), {
        code: 'PUBLISHED_RIDE_VALIDATION_FAILED',
      });
    }

    const owner = resolveOwner();
    const mobile =
      normalizeMobile(input.mobile) ||
      owner?.mobile ||
      normalizeMobile(authSession.getUser()?.phone) ||
      '';

    const existing =
      input.rideId && input.rideId > 0
        ? publishedRidesSheetStore.findByRideId(input.rideId)
        : undefined;
    const mode: 'insert' | 'update' = existing ? 'update' : 'insert';
    const rideId =
      existing?.rideId && existing.rideId > 0
        ? existing.rideId
        : input.rideId && input.rideId >= PUBLISHED_RIDES_SHEET_ID_START
          ? input.rideId
          : publishedRidesSheetStore.nextRideId();

    const saved = await publishedRidesSheetStore.upsert({
      rideId,
      userId: input.userId || owner?.userId || 0,
      mobile,
      rideType: input.rideType,
      origin: input.origin.trim(),
      destination: input.destination.trim(),
      departureDate: input.departureDate,
      departureTime: input.departureTime,
      availableSeats: input.availableSeats,
      pricePerSeat: input.pricePerSeat,
      preferences: input.preferences,
      notes: input.notes,
      vehicleName: input.vehicleName,
      vehiclePlate: input.vehiclePlate,
      maxTwoInBack: input.maxTwoInBack,
      womenOnly: input.womenOnly,
      originLat: input.originLat,
      originLng: input.originLng,
      destLat: input.destLat,
      destLng: input.destLng,
      status: input.status,
      publishedAt: input.publishedAt,
    });

    let remoteSynced = false;
    try {
      remoteSynced = await publishedRidesSheetSync.pushRemote(localToRemote(saved), mode);
    } catch (error) {
      console.log('[PublishedRides Sheet] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode,
      rideId: saved.rideId,
      message: remoteSynced
        ? `RideID ${saved.rideId} ${mode === 'insert' ? 'added to' : 'updated in'} sheet.`
        : `RideID ${saved.rideId} saved locally.`,
    };
  },
};
