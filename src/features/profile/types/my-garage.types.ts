export type VehicleRcStatus = 'approved' | 'pending';

export interface GarageVehicle {
  id: string;
  name: string;
  model: string;
  color: string;
  plateNumber: string;
  rcStatus: VehicleRcStatus;
}
