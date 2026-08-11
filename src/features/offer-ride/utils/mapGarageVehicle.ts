import type { VehiclesSheetRow } from '@/DemoData';

import type { PublishRideVehicleOption } from '../types';

const formatPlate = (plate: string): string => plate.replace(/\s+/g, ' ').trim().toUpperCase();

/** Map a My Garage / Vehicles sheet row into the publish-ride vehicle card shape. */
export const mapGarageVehicleToOption = (row: VehiclesSheetRow): PublishRideVehicleOption => {
  const plate = formatPlate(row.vehicleNumberPlate ?? '');
  const model = (row.vehicleModel ?? '').trim();
  const color = (row.vehicleColor ?? '').trim();
  const type = (row.vehicleType ?? '').trim();
  const name =
    [color, model].filter(Boolean).join(' ') ||
    [type, model].filter(Boolean).join(' ') ||
    model ||
    plate ||
    `Vehicle ${row.vehicleId}`;

  const icon: PublishRideVehicleOption['icon'] =
    /ev|electric|sport/i.test(`${type} ${model}`) ? 'car-sport' : 'car';

  return {
    id: String(row.row_id),
    name,
    plateNumber: plate || '—',
    icon,
  };
};
