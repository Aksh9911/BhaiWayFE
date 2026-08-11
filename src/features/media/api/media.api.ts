import { ENDPOINTS, httpClient } from '@/network';
import { env } from '@/config';
import { userDetailsSheetSync } from '@/DemoData';
import { logger } from '@/shared/utils/logger';
import { authSession } from '@/store';
import type { CloudinaryUploadResponse, UploadKind } from '@/types/cloudinary';

export interface PersistMediaPayload {
  kind: UploadKind;
  secureUrl: string;
  publicId: string;
  format?: string;
  bytes?: number;
}

const syncUserDetailsMedia = async (patch: {
  profilePicture?: string;
  rc?: string;
  corporateIdUrl?: string;
}): Promise<void> => {
  const user = authSession.getUser();
  const mobile = user?.phone?.trim() || '';
  if (!mobile) {
    logger.warn('Skip UserDetails media sync — no session phone', patch);
    return;
  }

  try {
    await userDetailsSheetSync.validateAndSync({
      userName: user?.fullName?.trim() || 'User',
      email: user?.email || '',
      mobile,
      profilePicture: patch.profilePicture,
      rc: patch.rc,
      corporateIdUrl: patch.corporateIdUrl,
    });
  } catch (error) {
    logger.warn('UserDetails media sheet sync failed', { patch, error });
  }
};

/**
 * Example backend persistence after Cloudinary upload succeeds.
 * Backend should store only the Cloudinary URL / public_id — never re-upload the file.
 */
export const persistCloudinaryAsset = async (
  payload: PersistMediaPayload,
): Promise<PersistMediaPayload> => {
  if (env.useMocks) {
    logger.info('Mock persist Cloudinary asset (URL for backend)', {
      kind: payload.kind,
      secureUrl: payload.secureUrl,
      publicId: payload.publicId,
    });
    return payload;
  }

  await httpClient.post(ENDPOINTS.media.saveAsset, payload);
  return payload;
};

export const saveProfilePhotoUrl = async (
  result: CloudinaryUploadResponse,
): Promise<string> => {
  const saved = await persistCloudinaryAsset({
    kind: 'profile',
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    format: result.format,
    bytes: result.bytes,
  });
  await syncUserDetailsMedia({ profilePicture: saved.secureUrl });
  return saved.secureUrl;
};

export const saveDrivingLicenseUrl = async (
  result: CloudinaryUploadResponse,
): Promise<string> => {
  const saved = await persistCloudinaryAsset({
    kind: 'dl',
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    format: result.format,
    bytes: result.bytes,
  });
  return saved.secureUrl;
};

/** Persist RC Cloudinary URL to backend + UserDetails sheet (same as profile picture). */
export const saveVehicleRcUrl = async (
  result: CloudinaryUploadResponse,
): Promise<string> => {
  const saved = await persistCloudinaryAsset({
    kind: 'rc',
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    format: result.format,
    bytes: result.bytes,
  });
  await syncUserDetailsMedia({ rc: saved.secureUrl });
  return saved.secureUrl;
};

/** Persist Corporate ID Cloudinary URL to backend + UserDetails sheet (same as profile picture). */
export const saveCorporateIdUrl = async (
  result: CloudinaryUploadResponse,
): Promise<string> => {
  const saved = await persistCloudinaryAsset({
    kind: 'corporateId',
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    format: result.format,
    bytes: result.bytes,
  });
  await syncUserDetailsMedia({ corporateIdUrl: saved.secureUrl });
  return saved.secureUrl;
};

export const saveIssueReportUrl = async (
  result: CloudinaryUploadResponse,
): Promise<string> => {
  const saved = await persistCloudinaryAsset({
    kind: 'issueReport',
    secureUrl: result.secureUrl,
    publicId: result.publicId,
    format: result.format,
    bytes: result.bytes,
  });
  return saved.secureUrl;
};
