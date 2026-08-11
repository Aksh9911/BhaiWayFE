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
  /** Local preview URI while uploading, then Cloudinary secure_url. */
  documentUri: string | null;
  documentName: string | null;
  /** Final Cloudinary HTTPS URL for backend. */
  documentSecureUrl: string | null;
  /** Cloudinary public_id for backend. */
  documentPublicId: string | null;
}
