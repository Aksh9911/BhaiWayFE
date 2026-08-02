import { UPLOAD_FOLDERS } from './uploadFolders';
import type { UploadKind } from '@/types/cloudinary';
export const PROFILE_MAX_BYTES = 2 * 1024 * 1024;
export const DOCUMENT_MAX_BYTES = 5 * 1024 * 1024;

export const PROFILE_TARGET_SIZE = 600;

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
] as const;

export const ALLOWED_DOCUMENT_MIME_TYPES = [
  ...ALLOWED_IMAGE_MIME_TYPES,
  'application/pdf',
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'] as const;
export const ALLOWED_DOCUMENT_EXTENSIONS = ['jpg', 'jpeg', 'png', 'pdf'] as const;

export const UPLOAD_KIND_CONFIG = {
  profile: {
    kind: 'profile' as const satisfies UploadKind,
    folder: UPLOAD_FOLDERS.profile,
    maxBytes: PROFILE_MAX_BYTES,
    allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
    allowedExtensions: ALLOWED_IMAGE_EXTENSIONS,
    resourceType: 'image' as const,
    squareCrop: true,
    compressTargetWidth: PROFILE_TARGET_SIZE,
    sources: ['camera', 'gallery'] as const,
  },
  dl: {
    kind: 'dl' as const satisfies UploadKind,
    folder: UPLOAD_FOLDERS.dl,
    maxBytes: DOCUMENT_MAX_BYTES,
    allowedMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
    allowedExtensions: ALLOWED_DOCUMENT_EXTENSIONS,
    resourceType: 'auto' as const,
    squareCrop: false,
    compressTargetWidth: 1600,
    sources: ['camera', 'gallery', 'files'] as const,
  },
  rc: {
    kind: 'rc' as const satisfies UploadKind,
    folder: UPLOAD_FOLDERS.rc,
    maxBytes: DOCUMENT_MAX_BYTES,
    allowedMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
    allowedExtensions: ALLOWED_DOCUMENT_EXTENSIONS,
    resourceType: 'auto' as const,
    squareCrop: false,
    compressTargetWidth: 1600,
    sources: ['camera', 'gallery', 'files'] as const,
  },
  generic: {
    kind: 'generic' as const satisfies UploadKind,
    folder: UPLOAD_FOLDERS.generic,
    maxBytes: DOCUMENT_MAX_BYTES,
    allowedMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
    allowedExtensions: ALLOWED_DOCUMENT_EXTENSIONS,
    resourceType: 'auto' as const,
    squareCrop: false,
    compressTargetWidth: 1600,
    sources: ['camera', 'gallery', 'files'] as const,
  },
} as const;

export type UploadKindConfig = (typeof UPLOAD_KIND_CONFIG)[UploadKind];
