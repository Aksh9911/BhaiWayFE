export type VehicleCategoryId = 'sedan' | 'suv' | 'hatchback' | 'luxury';

export interface VehicleCategoryOption {
  id: VehicleCategoryId;
  label: string;
  icon: 'car-outline' | 'car-sport-outline' | 'car' | 'diamond-outline';
}

export interface AddVehicleForm {
  category: VehicleCategoryId;
  model: string;
  color: string;
  plateNumber: string;
  documentUri: string | null;
  documentName: string | null;
}
