/**
 * Vehicles sheet row types.
 * Headers / IDs live in `src/DemoData/files/demoData.common.ts`.
 */

export type { VehiclesSheetHeader } from './files/demoData.common';

export {
  VEHICLES_SHEET_HEADERS,
  VEHICLES_SHEET_FIELD_KEYS,
  VEHICLES_SHEET_VEHICLE_ID_START,
  vehiclesSheetHeaderCsv,
} from './files/demoData.common';

/** One row per vehicle — a user may own many. */
export interface VehiclesSheetRow {
  row_id: number;
  vehicleId: number;
  userId: number;
  mobile: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleType: string;
  vehicleNumberPlate: string;
  rc: string;
  updated_at: string;
}

export type VehiclesSheetPatch = Partial<
  Omit<VehiclesSheetRow, 'row_id' | 'updated_at'>
> & {
  mobile?: string;
};
