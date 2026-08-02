import * as ImageManipulator from 'expo-image-manipulator';

import { PROFILE_TARGET_SIZE } from '@/shared/constants/uploadTypes';
import type { FileMetadata } from '@/types/cloudinary';

export interface CompressImageOptions {
  /** Longest edge for documents; width/height for square profile. */
  maxDimension?: number;
  /** 0–1 JPEG quality. */
  quality?: number;
  /** Force square crop centered (profile photos). */
  squareCrop?: boolean;
}

/**
 * Compress / resize a local image before Cloudinary upload.
 * PDFs and non-image URIs should skip this helper.
 */
export const compressImage = async (
  uri: string,
  options: CompressImageOptions = {},
): Promise<FileMetadata> => {
  const {
    maxDimension = PROFILE_TARGET_SIZE,
    quality = 0.8,
    squareCrop = false,
  } = options;

  const actions: ImageManipulator.Action[] = [];

  if (squareCrop) {
    const probe = await ImageManipulator.manipulateAsync(uri, [], {
      compress: 1,
      format: ImageManipulator.SaveFormat.JPEG,
    });
    const size = Math.min(probe.width, probe.height);
    const originX = Math.max(0, Math.floor((probe.width - size) / 2));
    const originY = Math.max(0, Math.floor((probe.height - size) / 2));
    actions.push({
      crop: {
        originX,
        originY,
        width: size,
        height: size,
      },
    });
    actions.push({ resize: { width: maxDimension, height: maxDimension } });
  } else {
    actions.push({ resize: { width: maxDimension } });
  }

  const result = await ImageManipulator.manipulateAsync(uri, actions, {
    compress: quality,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  return {
    uri: result.uri,
    fileName: `upload_${Date.now()}.jpg`,
    mimeType: 'image/jpeg',
    width: result.width,
    height: result.height,
  };
};
