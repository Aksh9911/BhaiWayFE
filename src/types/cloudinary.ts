export type CloudinaryResourceType = 'image' | 'raw' | 'auto';

export type UploadKind = 'profile' | 'dl' | 'rc' | 'corporateId' | 'issueReport' | 'generic';

export type UploadSource = 'camera' | 'gallery' | 'files';

export type UploadErrorCode =
  | 'NOT_CONFIGURED'
  | 'NO_INTERNET'
  | 'TIMEOUT'
  | 'FILE_TOO_LARGE'
  | 'INVALID_FORMAT'
  | 'PERMISSION_DENIED'
  | 'CANCELLED'
  | 'CLOUDINARY_ERROR'
  | 'BACKEND_ERROR'
  | 'UNKNOWN';

export interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  uploadTimeoutMs: number;
  deleteEndpoint: string;
}

export interface FileMetadata {
  uri: string;
  fileName?: string;
  mimeType?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
}

export interface UploadFileRequest {
  uri: string;
  /**
   * Upload kind — preferred. Resolves the Cloudinary folder automatically:
   * - profile → bhaiway/profile
   * - dl → bhaiway/documents/dl
   * - rc → bhaiway/documents/rc
   * - corporateId → bhaiway/documents/CorporateID
   * - issueReport → bhaiway/IssueReport
   */
  kind?: UploadKind;
  /**
   * Explicit Cloudinary folder path.
   * Required only when `kind` is omitted (unless `skipFolder` is true). Prefer `kind` for normal uploads.
   */
  folder?: string;
  /**
   * When true, do not send a `folder` field.
   * Needed when the unsigned preset is locked to a fixed folder.
   */
  skipFolder?: boolean;
  fileName?: string;
  mimeType?: string;
  resourceType?: CloudinaryResourceType;
  /** Optional public id without folder prefix. */
  publicId?: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

export interface CloudinaryUploadResponse {
  secureUrl: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  resourceType: string;
  originalFilename?: string;
  folder?: string;
  raw: Record<string, unknown>;
}

export interface CloudinaryDeleteRequest {
  publicId: string;
}

export interface CloudinaryDeleteResponse {
  result: string;
  publicId: string;
}

export class CloudinaryUploadError extends Error {
  readonly code: UploadErrorCode;
  readonly status?: number;
  readonly details?: unknown;

  constructor(
    code: UploadErrorCode,
    message: string,
    options?: { status?: number; details?: unknown },
  ) {
    super(message);
    this.name = 'CloudinaryUploadError';
    this.code = code;
    this.status = options?.status;
    this.details = options?.details;
  }
}
