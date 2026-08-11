import type { UploadKind } from '@/types/cloudinary';

/**
 * Cloudinary Media Library folder map.
 *
 * Cloudinary creates these folders automatically on first upload:
 *
 * Media Library (Home)
 * └── bhaiway
 *       ├── profile              ← profile photos
 *       ├── IssueReport          ← ride issue report photos
 *       └── documents
 *             ├── dl             ← driving licence
 *             ├── rc             ← vehicle RC
 *             └── CorporateID    ← corporate ID card
 */
export const CLOUDINARY_ROOT_FOLDER = 'bhaiway' as const;

export const UPLOAD_FOLDERS = {
  /** Profile photo → Home / bhaiway / profile */
  profile: `${CLOUDINARY_ROOT_FOLDER}/profile`,
  /** Driving licence → Home / bhaiway / documents / dl */
  dl: `${CLOUDINARY_ROOT_FOLDER}/documents/dl`,
  /** Vehicle RC → Home / bhaiway / documents / rc */
  rc: `${CLOUDINARY_ROOT_FOLDER}/documents/rc`,
  /** Corporate ID → Home / bhaiway / documents / CorporateID */
  corporateId: `${CLOUDINARY_ROOT_FOLDER}/documents/CorporateID`,
  /** Issue report photo → Home / bhaiway / IssueReport */
  issueReport: `${CLOUDINARY_ROOT_FOLDER}/IssueReport`,
  /** Fallback documents root */
  generic: `${CLOUDINARY_ROOT_FOLDER}/documents`,
} as const satisfies Record<UploadKind, string>;

export type UploadFolderKey = keyof typeof UPLOAD_FOLDERS;
export type UploadFolderPath = (typeof UPLOAD_FOLDERS)[UploadFolderKey];

/** Resolve the Cloudinary folder path for a given upload kind. */
export const getCloudinaryFolder = (kind: UploadKind): UploadFolderPath =>
  UPLOAD_FOLDERS[kind];
