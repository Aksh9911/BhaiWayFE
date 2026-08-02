/**
 * Cloudinary client configuration for BhaiWay.
 *
 * SECURITY:
 * - Only unsigned uploads run from the mobile app.
 * - Never put CLOUDINARY_API_SECRET in EXPO_PUBLIC_* vars or this file.
 * - Deletion / signed uploads must go through the backend.
 *
 * Upload endpoint example:
 * https://api.cloudinary.com/v1_1/mzh4sidd/image/upload
 */
import Constants from 'expo-constants';

import { env } from './env';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string | undefined>;

/** Default Cloudinary cloud (safe to ship in the client). */
const DEFAULT_CLOUD_NAME = 'mzh4sidd';

/** Unsigned upload preset (safe to ship). Never store the API secret here. */
const DEFAULT_UPLOAD_PRESET = 'bhaiway_upload';

const firstNonEmpty = (...values: Array<string | undefined | null>): string => {
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }
    const trimmed = value.trim();
    if (!trimmed || trimmed.startsWith('YOUR_') || trimmed === 'REPLACE_ME') {
      continue;
    }
    return trimmed;
  }
  return '';
};

export interface CloudinaryClientConfig {
  readonly cloudName: string;
  readonly uploadPreset: string;
  readonly uploadTimeoutMs: number;
  /** Backend path that destroys a Cloudinary asset with a signed request. */
  readonly deleteEndpoint: string;
  readonly isConfigured: boolean;
}

export const cloudinaryConfig: CloudinaryClientConfig = {
  cloudName: firstNonEmpty(
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME,
    extra.cloudinaryCloudName,
    env.cloudinaryCloudName,
    DEFAULT_CLOUD_NAME,
  ),
  uploadPreset: firstNonEmpty(
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    extra.cloudinaryUploadPreset,
    env.cloudinaryUploadPreset,
    DEFAULT_UPLOAD_PRESET,
  ),
  uploadTimeoutMs: Number(
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_TIMEOUT_MS ??
      extra.cloudinaryUploadTimeoutMs ??
      60_000,
  ),
  deleteEndpoint: '/media/cloudinary/delete',
  get isConfigured() {
    return Boolean(this.cloudName && this.uploadPreset);
  },
};

/**
 * Builds the Cloudinary upload URL.
 * Example for images: https://api.cloudinary.com/v1_1/mzh4sidd/image/upload
 */
export const getCloudinaryUploadUrl = (
  resourceType: 'image' | 'raw' | 'auto' = 'image',
): string => {
  if (!cloudinaryConfig.cloudName) {
    throw new Error('Cloudinary cloud name is not configured.');
  }
  return `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`;
};
