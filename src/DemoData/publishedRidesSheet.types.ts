/**
 * PublishedRides sheet row types.
 * Headers / IDs live in `src/DemoData/files/demoData.common.ts`.
 */

export type { PublishedRidesSheetHeader } from './files/demoData.common';

export {
  PUBLISHED_RIDES_SHEET_HEADERS,
  PUBLISHED_RIDES_SHEET_FIELD_KEYS,
  PUBLISHED_RIDES_SHEET_ID_START,
  publishedRidesSheetHeaderCsv,
} from './files/demoData.common';

export type PublishedRideSheetType = 'regular' | 'assured';
export type PublishedRideSheetStatus = 'published' | 'cancelled' | 'completed';

export interface PublishedRidesSheetRow {
  row_id: number;
  rideId: number;
  userId: number;
  mobile: string;
  rideType: PublishedRideSheetType;
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
  status: PublishedRideSheetStatus;
  publishedAt: string;
  updated_at: string;
}

export type PublishedRidesSheetPatch = Partial<Omit<PublishedRidesSheetRow, 'updated_at'>> & {
  mobile?: string;
};
