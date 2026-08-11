import { cloudinaryConfig, getCloudinaryUploadUrl } from '@/config';
import { getCloudinaryFolder } from '@/shared/constants/uploadFolders';
import { logger } from '@/shared/utils/logger';
import {
  CloudinaryUploadError,
  type CloudinaryResourceType,
  type CloudinaryUploadResponse,
  type UploadFileRequest,
} from '@/types/cloudinary';

const guessMimeType = (fileName?: string, mimeType?: string): string => {
  if (mimeType?.trim()) {
    return mimeType.trim().toLowerCase();
  }
  const lower = (fileName ?? '').toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/jpeg';
};

const ensureFileName = (fileName: string | undefined, mimeType: string): string => {
  const base = fileName?.trim() || `bhaiway_${Date.now()}`;
  if (/\.[a-z0-9]+$/i.test(base)) {
    return base;
  }
  if (mimeType === 'image/png') return `${base}.png`;
  if (mimeType === 'application/pdf') return `${base}.pdf`;
  return `${base}.jpg`;
};

const resolveResourceType = (
  mimeType: string,
  requested?: CloudinaryResourceType,
): CloudinaryResourceType => {
  if (mimeType === 'application/pdf') {
    return 'raw';
  }
  if (requested === 'raw' || requested === 'image') {
    return requested;
  }
  // Prefer image over auto — unsigned presets are usually Image-scoped.
  return 'image';
};

const mapCloudinaryPayload = (payload: Record<string, unknown>): CloudinaryUploadResponse => {
  const secureUrl = String(payload.secure_url ?? '');
  const publicId = String(payload.public_id ?? '');
  if (!secureUrl || !publicId) {
    throw new CloudinaryUploadError(
      'CLOUDINARY_ERROR',
      'Cloudinary returned an incomplete upload response.',
      { details: payload },
    );
  }

  return {
    secureUrl,
    publicId,
    format: String(payload.format ?? ''),
    bytes: Number(payload.bytes ?? 0),
    width: typeof payload.width === 'number' ? payload.width : undefined,
    height: typeof payload.height === 'number' ? payload.height : undefined,
    resourceType: String(payload.resource_type ?? 'image'),
    originalFilename:
      typeof payload.original_filename === 'string' ? payload.original_filename : undefined,
    folder: typeof payload.folder === 'string' ? payload.folder : undefined,
    raw: payload,
  };
};

const resolveUploadFolder = ({
  kind,
  folder,
  skipFolder,
}: Pick<UploadFileRequest, 'kind' | 'folder' | 'skipFolder'>): string | null => {
  if (skipFolder) {
    return null;
  }
  if (kind) {
    return getCloudinaryFolder(kind);
  }
  if (folder?.trim()) {
    return folder.trim();
  }
  throw new CloudinaryUploadError(
    'UNKNOWN',
    'Upload requires a kind (profile | dl | rc | corporateId | issueReport), an explicit folder path, or skipFolder.',
  );
};

/**
 * Single reusable Cloudinary upload for profile photos, DL, RC, Corporate ID, issue reports, and future types.
 * Uses an unsigned upload preset — never sends the API secret from the app.
 */
export const uploadFile = async ({
  uri,
  kind,
  folder,
  skipFolder,
  fileName,
  mimeType,
  resourceType = 'image',
  publicId,
  onProgress,
  signal,
}: UploadFileRequest): Promise<CloudinaryUploadResponse> => {
  if (!uri?.trim()) {
    throw new CloudinaryUploadError('UNKNOWN', 'File URI is missing.');
  }

  if (!cloudinaryConfig.isConfigured) {
    throw new CloudinaryUploadError(
      'NOT_CONFIGURED',
      'Cloudinary is not configured. Set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET.',
    );
  }

  const targetFolder = resolveUploadFolder({ kind, folder, skipFolder });
  const type = guessMimeType(fileName, mimeType);
  const name = ensureFileName(fileName, type);
  const resolvedResourceType = resolveResourceType(type, resourceType);
  const formData = new FormData();

  formData.append('file', {
    uri,
    name,
    type,
  } as unknown as Blob);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  if (targetFolder) {
    formData.append('folder', targetFolder);
  }
  if (publicId?.trim()) {
    formData.append('public_id', publicId.trim());
  }

  const uploadUrl = getCloudinaryUploadUrl(resolvedResourceType);

  return new Promise<CloudinaryUploadResponse>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl);
    xhr.timeout = cloudinaryConfig.uploadTimeoutMs;

    const abort = () => {
      xhr.abort();
      reject(new CloudinaryUploadError('CANCELLED', 'Upload was cancelled.'));
    };

    if (signal) {
      if (signal.aborted) {
        abort();
        return;
      }
      signal.addEventListener('abort', abort, { once: true });
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) {
        return;
      }
      const percent = Math.max(0, Math.min(100, Math.round((event.loaded / event.total) * 100)));
      onProgress(percent);
    };

    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText || '{}') as Record<string, unknown>;
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          logger.info('Cloudinary upload success', {
            kind,
            folder: targetFolder,
            publicId: payload.public_id,
            resourceType: resolvedResourceType,
          });
          resolve(mapCloudinaryPayload(payload));
          return;
        }

        const message =
          typeof payload.error === 'object' &&
          payload.error &&
          'message' in (payload.error as object)
            ? String((payload.error as { message?: string }).message)
            : 'Cloudinary rejected the upload.';

        logger.error('Cloudinary upload rejected', {
          status: xhr.status,
          message,
          folder: targetFolder,
          kind,
          resourceType: resolvedResourceType,
        });

        reject(
          new CloudinaryUploadError('CLOUDINARY_ERROR', message, {
            status: xhr.status,
            details: payload,
          }),
        );
      } catch (error) {
        reject(
          new CloudinaryUploadError('CLOUDINARY_ERROR', 'Failed to parse Cloudinary response.', {
            status: xhr.status,
            details: error,
          }),
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new CloudinaryUploadError(
          'NO_INTERNET',
          'Unable to reach Cloudinary. Check your internet connection.',
        ),
      );
    };

    xhr.ontimeout = () => {
      reject(
        new CloudinaryUploadError(
          'TIMEOUT',
          'Upload timed out. Please try again on a better connection.',
        ),
      );
    };

    xhr.onabort = () => {
      reject(new CloudinaryUploadError('CANCELLED', 'Upload was cancelled.'));
    };

    logger.debug('Cloudinary upload start', {
      kind,
      folder: targetFolder,
      name,
      resourceType: resolvedResourceType,
    });
    xhr.send(formData);
  });
};
