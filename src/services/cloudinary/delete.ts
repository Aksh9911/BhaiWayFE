import { ENDPOINTS, httpClient } from '@/network';
import { logger } from '@/shared/utils/logger';
import {
  CloudinaryUploadError,
  type CloudinaryDeleteRequest,
  type CloudinaryDeleteResponse,
} from '@/types/cloudinary';

/**
 * Destroy a Cloudinary asset via the BhaiWay backend.
 * The API secret must never leave the server — do not call Cloudinary destroy from the app.
 *
 * Does not run automatically. Call only when the product flow explicitly removes an asset.
 */
export const deleteFile = async (publicId: string): Promise<CloudinaryDeleteResponse> => {
  if (!publicId.trim()) {
    throw new CloudinaryUploadError('UNKNOWN', 'Missing Cloudinary public_id.');
  }

  try {
    const response = await httpClient.post<CloudinaryDeleteResponse>(
      ENDPOINTS.media.deleteAsset,
      { publicId } satisfies CloudinaryDeleteRequest,
    );

    logger.info('Cloudinary asset delete requested', { publicId });
    return {
      result: response.result ?? 'ok',
      publicId: response.publicId ?? publicId,
    };
  } catch (error) {
    throw new CloudinaryUploadError(
      'BACKEND_ERROR',
      'Unable to delete the uploaded file. Please try again.',
      { details: error },
    );
  }
};
