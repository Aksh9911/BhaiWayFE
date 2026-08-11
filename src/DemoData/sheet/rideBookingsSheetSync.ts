import { env } from '@/config';
import {
  DEMO_GOOGLE_SHEET_ID,
  DEMO_RIDE_BOOKINGS_SHEET_GID,
  DEMO_SHEET_LINKS,
  RIDE_BOOKINGS_SHEET_FIELD_KEYS,
  RIDE_BOOKINGS_SHEET_HEADERS,
  RIDE_BOOKINGS_SHEET_ID_START,
} from '@/DemoData/files';
import { authSession } from '@/store';

import {
  type RideBookingSheetPaymentStatus,
  type RideBookingSheetStatus,
  type RideBookingsSheetRow,
} from '../rideBookingsSheet.types';
import { rideBookingsSheetStore } from '../rideBookingsSheetStore';
import { userDetailsSheetStore } from '../userDetailsSheetStore';
import { normalizeHeader, parseCsv } from './csv';

export interface RemoteRideBookingRow {
  bookingId: number;
  rideId: string;
  userId: number;
  mobile: string;
  origin: string;
  destination: string;
  departureLabel: string;
  driverName: string;
  vehicleLabel: string;
  seatsBooked: number;
  amount: number;
  status: string;
  paymentStatus: string;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  bookedAt: string;
}

export interface RideBookingSyncInput {
  bookingId?: number;
  rideId?: string;
  userId?: number;
  mobile?: string;
  origin: string;
  destination: string;
  departureLabel?: string;
  driverName?: string;
  vehicleLabel?: string;
  seatsBooked?: number;
  amount?: number;
  status?: RideBookingSheetStatus;
  paymentStatus?: RideBookingSheetPaymentStatus;
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
  bookedAt?: string;
}

export interface RideBookingSyncResult {
  localRowSaved: boolean;
  remoteSynced: boolean;
  mode: 'insert' | 'update';
  bookingId: number;
  message: string;
}

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const parseNumber = (raw: string, asFloat = false): number => {
  const amount = Number(String(raw).replace(/[^\d.-]/g, ''));
  if (!Number.isFinite(amount)) {
    return 0;
  }
  return asFloat ? amount : Math.floor(amount);
};

const headerMap: Record<string, keyof RemoteRideBookingRow> = {
  bookingid: 'bookingId',
  rideid: 'rideId',
  userid: 'userId',
  mobile: 'mobile',
  origin: 'origin',
  destination: 'destination',
  departurelabel: 'departureLabel',
  drivername: 'driverName',
  vehiclelabel: 'vehicleLabel',
  seatsbooked: 'seatsBooked',
  amount: 'amount',
  status: 'status',
  paymentstatus: 'paymentStatus',
  originlat: 'originLat',
  originlng: 'originLng',
  destlat: 'destLat',
  destlng: 'destLng',
  bookedat: 'bookedAt',
  'booking id': 'bookingId',
  'ride id': 'rideId',
  'user id': 'userId',
  'departure label': 'departureLabel',
  'driver name': 'driverName',
  'vehicle label': 'vehicleLabel',
  'seats booked': 'seatsBooked',
  'payment status': 'paymentStatus',
  'origin lat': 'originLat',
  'origin lng': 'originLng',
  'dest lat': 'destLat',
  'dest lng': 'destLng',
  'booked at': 'bookedAt',
  phone: 'mobile',
};

const emptyRemote = (): RemoteRideBookingRow => ({
  bookingId: 0,
  rideId: '',
  userId: 0,
  mobile: '',
  origin: '',
  destination: '',
  departureLabel: '',
  driverName: '',
  vehicleLabel: '',
  seatsBooked: 0,
  amount: 0,
  status: 'confirmed',
  paymentStatus: 'pending',
  originLat: 0,
  originLng: 0,
  destLat: 0,
  destLng: 0,
  bookedAt: '',
});

const sheetCsvUrl = (): string =>
  DEMO_SHEET_LINKS.rideBookingsCsv(
    env.googleSheetId || DEMO_GOOGLE_SHEET_ID,
    env.googleSheetRideBookingsGid || DEMO_RIDE_BOOKINGS_SHEET_GID,
  );

const assignCell = (
  row: RemoteRideBookingRow,
  key: keyof RemoteRideBookingRow,
  raw: string,
): void => {
  if (key === 'bookingId' || key === 'userId' || key === 'seatsBooked') {
    row[key] = parseNumber(raw);
    return;
  }
  if (key === 'amount') {
    row.amount = parseNumber(raw, true);
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
  if (key === 'rideId') {
    row.rideId = String(raw ?? '').trim();
    return;
  }
  row[key] = raw;
};

const mapCsvToRemoteRows = (csv: string): RemoteRideBookingRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }
  const headers = table[0].map(normalizeHeader);
  const expected = RIDE_BOOKINGS_SHEET_HEADERS.map(normalizeHeader);
  const ordered =
    expected.every((name, index) => headers[index] === name)
      ? RIDE_BOOKINGS_SHEET_FIELD_KEYS.map((key) => key)
      : null;

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyRemote();
      if (ordered) {
        ordered.forEach((key, index) => {
          assignCell(row, key as keyof RemoteRideBookingRow, cells[index] ?? '');
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
    .filter((row) => row.bookingId > 0 || row.origin || row.destination);
};

const localToRemote = (row: RideBookingsSheetRow): RemoteRideBookingRow => ({
  bookingId: row.bookingId,
  rideId: row.rideId,
  userId: row.userId,
  mobile: row.mobile,
  origin: row.origin,
  destination: row.destination,
  departureLabel: row.departureLabel,
  driverName: row.driverName,
  vehicleLabel: row.vehicleLabel,
  seatsBooked: row.seatsBooked,
  amount: row.amount,
  status: row.status,
  paymentStatus: row.paymentStatus,
  originLat: row.originLat,
  originLng: row.originLng,
  destLat: row.destLat,
  destLng: row.destLng,
  bookedAt: row.bookedAt,
});

const resolveOwner = () => {
  const phone = normalizeMobile(authSession.getUser()?.phone);
  return (
    (phone ? userDetailsSheetStore.findByMobile(phone) : undefined) ||
    userDetailsSheetStore.getAll()[0]
  );
};

export const rideBookingsSheetSync = {
  fetchRemoteRows: async (): Promise<RemoteRideBookingRow[] | null> => {
    const url = sheetCsvUrl();
    console.log('[RideBookings Sheet] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    console.log('[RideBookings Sheet] fetch response', {
      httpStatus: response.status,
      bytes: text.length,
      preview: text.slice(0, 240),
    });
    if (!response.ok) {
      throw new Error('Unable to read RideBookings sheet. Create the tab or check gid.');
    }
    if (
      text.trim().startsWith('<') ||
      !normalizeHeader(text.split('\n')[0] ?? '').includes('booking')
    ) {
      console.log('[RideBookings Sheet] tab missing or wrong gid');
      return null;
    }
    return mapCsvToRemoteRows(text);
  },

  pullIntoLocal: async (): Promise<RemoteRideBookingRow[]> => {
    await rideBookingsSheetStore.hydrate();
    let remoteRows: RemoteRideBookingRow[] = [];
    try {
      const remote = await rideBookingsSheetSync.fetchRemoteRows();
      if (remote) {
        remoteRows = remote;
      }
    } catch (error) {
      console.log('[RideBookings Sheet] pull skipped', error);
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
      await rideBookingsSheetStore.upsert({
        bookingId: remote.bookingId > 0 ? remote.bookingId : undefined,
        rideId: remote.rideId || undefined,
        userId: remote.userId > 0 ? remote.userId : undefined,
        mobile: remote.mobile || sessionPhone || undefined,
        origin: remote.origin,
        destination: remote.destination,
        departureLabel: remote.departureLabel,
        driverName: remote.driverName,
        vehicleLabel: remote.vehicleLabel,
        seatsBooked: remote.seatsBooked,
        amount: remote.amount,
        status: remote.status as RideBookingSheetStatus,
        paymentStatus: remote.paymentStatus as RideBookingSheetPaymentStatus,
        originLat: remote.originLat,
        originLng: remote.originLng,
        destLat: remote.destLat,
        destLng: remote.destLng,
        bookedAt: remote.bookedAt,
      });
    }
    return remoteRows;
  },

  pushRemote: async (
    row: RemoteRideBookingRow,
    mode: 'insert' | 'update',
  ): Promise<boolean> => {
    const webhook = env.googleSheetWebhookUrl;
    if (!webhook) {
      console.log('[RideBookings Sheet] push skipped (no webhook)', { mode, row });
      return false;
    }
    const body = { entity: 'rideBooking', action: mode, row };
    console.log('[RideBookings Sheet] push request', { webhook, body });
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('[RideBookings Sheet] push response', {
      httpStatus: response.status,
      body: text,
    });
    return response.ok;
  },

  upsertAndSync: async (input: RideBookingSyncInput): Promise<RideBookingSyncResult> => {
    if (!input.origin.trim() || !input.destination.trim()) {
      throw Object.assign(new Error('Origin and destination are required.'), {
        code: 'RIDE_BOOKING_VALIDATION_FAILED',
      });
    }

    const owner = resolveOwner();
    const mobile =
      normalizeMobile(input.mobile) ||
      owner?.mobile ||
      normalizeMobile(authSession.getUser()?.phone) ||
      '';

    const existing =
      input.bookingId && input.bookingId > 0
        ? rideBookingsSheetStore.findByBookingId(input.bookingId)
        : undefined;
    const mode: 'insert' | 'update' = existing ? 'update' : 'insert';
    const bookingId =
      existing?.bookingId && existing.bookingId > 0
        ? existing.bookingId
        : input.bookingId && input.bookingId >= RIDE_BOOKINGS_SHEET_ID_START
          ? input.bookingId
          : rideBookingsSheetStore.nextBookingId();

    const saved = await rideBookingsSheetStore.upsert({
      bookingId,
      rideId: input.rideId,
      userId: input.userId || owner?.userId || 0,
      mobile,
      origin: input.origin.trim(),
      destination: input.destination.trim(),
      departureLabel: input.departureLabel,
      driverName: input.driverName,
      vehicleLabel: input.vehicleLabel,
      seatsBooked: input.seatsBooked,
      amount: input.amount,
      status: input.status,
      paymentStatus: input.paymentStatus,
      originLat: input.originLat,
      originLng: input.originLng,
      destLat: input.destLat,
      destLng: input.destLng,
      bookedAt: input.bookedAt,
    });

    let remoteSynced = false;
    try {
      remoteSynced = await rideBookingsSheetSync.pushRemote(localToRemote(saved), mode);
    } catch (error) {
      console.log('[RideBookings Sheet] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode,
      bookingId: saved.bookingId,
      message: remoteSynced
        ? `BookingID ${saved.bookingId} ${mode === 'insert' ? 'added to' : 'updated in'} sheet.`
        : `BookingID ${saved.bookingId} saved locally.`,
    };
  },
};
