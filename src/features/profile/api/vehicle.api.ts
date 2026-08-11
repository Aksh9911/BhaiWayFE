import { ENDPOINTS, httpClient } from '@/network';
import { env } from '@/config';
import { logger } from '@/shared/utils/logger';
import type { VehicleCategoryId } from '../types';

/** Payload sent to backend after Cloudinary RC upload succeeds. */
export interface CreateVehicleRequest {
  category: VehicleCategoryId;
  model: string;
  color: string;
  plateNumber: string;
  /** Cloudinary HTTPS URL for the RC / verification image. */
  rcDocumentUrl: string | null;
  /** Cloudinary public_id for the RC asset (optional delete/replace later). */
  rcDocumentPublicId: string | null;
}

export interface CreateVehicleResponse {
  id: string;
  rcDocumentUrl: string | null;
  status?: string;
}

/**
 * Registers a vehicle with the backend.
 * Backend must store `rcDocumentUrl` (Cloudinary secure_url) — never re-upload the file.
 */
export const createVehicle = async (
  payload: CreateVehicleRequest,
): Promise<CreateVehicleResponse> => {
  if (env.useMocks) {
    logger.info('Mock create vehicle (Cloudinary URL for backend)', {
      ...payload,
      rcDocumentUrl: payload.rcDocumentUrl,
    });
    return {
      id: `mock_vehicle_${Date.now()}`,
      rcDocumentUrl: payload.rcDocumentUrl,
      status: 'pending',
    };
  }

  return httpClient.post<CreateVehicleResponse>(ENDPOINTS.vehicles.create, payload);
};
