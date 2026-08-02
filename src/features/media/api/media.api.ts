import { ENDPOINTS, httpClient } from '@/network';
import { env } from '@/config';
import { logger } from '@/shared/utils/logger';
import type { CloudinaryUploadResponse, UploadKind } from '@/types/cloudinary';

export interface PersistMediaPayload {
  kind: UploadKind;
  secureUrl: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

/**
 * Example backend persistence after Cloudinary upload succeeds.
 * Backend should store only the Cloudinary URL / public_id — never re-upload the file.
 */
export const persistCloudinaryAsset = async (
  payload: PersistMediaPayload,
): Promise<void> => {
  if (env.useMocks) {
    logger.info('Mock persist Cloudinary asset', payload);
    return;
  }

  await httpClient.post(ENDPOINTS.media.saveAsset, payload);
};

export const saveProfilePhotoUrl = async (
  result: CloudinaryUploadResponse,
): Promise<void> => {
  await persistCloudinaryAsset({
    kind: 'profile',
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    format: result.format,
    bytes: result.bytes,
  });
};

export const saveDrivingLicenseUrl = async (
  result: CloudinaryUploadResponse,
): Promise<void> => {
  await persistCloudinaryAsset({
    kind: 'dl',
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    format: result.format,
    bytes: result.bytes,
  });
};

export const saveVehicleRcUrl = async (
  result: CloudinaryUploadResponse,
): Promise<void> => {
  await persistCloudinaryAsset({
    kind: 'rc',
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    format: result.format,
    bytes: result.bytes,
  });
};
