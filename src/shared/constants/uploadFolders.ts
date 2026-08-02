import type { UploadKind } from '@/types/cloudinary';

/**
 * Cloudinary Media Library folder map.
 *
 * Cloudinary creates these folders automatically on first upload:
 *
 * Media Library
 * └── bhaiway
 *       ├── profile          ← profile photos
 *       └── documents
 *             ├── dl         ← driving licence
 *             └── rc         ← vehicle RC
 */
export const CLOUDINARY_ROOT_FOLDER = 'bhaiway' as const;

export const UPLOAD_FOLDERS = {
  /** Profile photo → Media Library / bhaiway / profile */
  profile: `${CLOUDINARY_ROOT_FOLDER}/profile`,
  /** Driving licence → Media Library / bhaiway / documents / dl */
  dl: `${CLOUDINARY_ROOT_FOLDER}/documents/dl`,
  /** Vehicle RC → Media Library / bhaiway / documents / rc */
  rc: `${CLOUDINARY_ROOT_FOLDER}/documents/rc`,
  /** Fallback documents root */
  generic: `${CLOUDINARY_ROOT_FOLDER}/documents`,
} as const satisfies Record<UploadKind, string>;

export type UploadFolderKey = keyof typeof UPLOAD_FOLDERS;
export type UploadFolderPath = (typeof UPLOAD_FOLDERS)[UploadFolderKey];

/** Resolve the Cloudinary folder path for a given upload kind. */
export const getCloudinaryFolder = (kind: UploadKind): UploadFolderPath =>
  UPLOAD_FOLDERS[kind];
