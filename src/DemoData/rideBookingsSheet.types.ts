/**
 * RideBookings sheet row types.
 * Headers / IDs live in `src/DemoData/files/demoData.common.ts`.
 */

export type { RideBookingsSheetHeader } from './files/demoData.common';

export {
  RIDE_BOOKINGS_SHEET_HEADERS,
  RIDE_BOOKINGS_SHEET_FIELD_KEYS,
  RIDE_BOOKINGS_SHEET_ID_START,
  rideBookingsSheetHeaderCsv,
} from './files/demoData.common';

export type RideBookingSheetStatus = 'confirmed' | 'cancelled' | 'completed';
export type RideBookingSheetPaymentStatus = 'paid' | 'pending';

export interface RideBookingsSheetRow {
  row_id: number;
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
  status: RideBookingSheetStatus;
  paymentStatus: RideBookingSheetPaymentStatus;
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  bookedAt: string;
  updated_at: string;
}

export type RideBookingsSheetPatch = Partial<Omit<RideBookingsSheetRow, 'updated_at'>> & {
  mobile?: string;
};
