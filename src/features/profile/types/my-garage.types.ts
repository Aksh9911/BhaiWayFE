export type VehicleRcStatus = 'approved' | 'pending';

export interface GarageVehicle {
  id: string;
  name: string;
  plateNumber: string;
  rcStatus: VehicleRcStatus;
}
