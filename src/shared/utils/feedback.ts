import { showAppAlert } from '@/store';

import { CloudinaryUploadError } from '@/types/cloudinary';
import type { UploadErrorCode } from '@/types/cloudinary';

const TITLE_BY_CODE: Record<UploadErrorCode, string> = {
  NOT_CONFIGURED: 'Setup required',
  NO_INTERNET: 'No internet',
  TIMEOUT: 'Upload timed out',
  FILE_TOO_LARGE: 'File too large',
  INVALID_FORMAT: 'Invalid file',
  PERMISSION_DENIED: 'Permission denied',
  CANCELLED: 'Cancelled',
  CLOUDINARY_ERROR: 'Upload failed',
  BACKEND_ERROR: 'Save failed',
  UNKNOWN: 'Something went wrong',
};

export const getUploadErrorMessage = (error: unknown): string => {
  if (error instanceof CloudinaryUploadError) {
    return error.message;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Unexpected error. Please try again.';
};

export const showUploadFeedback = (error: unknown): void => {
  if (error instanceof CloudinaryUploadError && error.code === 'CANCELLED') {
    return;
  }

  const title =
    error instanceof CloudinaryUploadError
      ? TITLE_BY_CODE[error.code]
      : TITLE_BY_CODE.UNKNOWN;

  showAppAlert(title, getUploadErrorMessage(error));
};

export const showSuccessFeedback = (title: string, message: string): void => {
  showAppAlert(title, message);
};
