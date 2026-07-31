import type { ImagePickerOptions } from 'expo-image-picker';

export type UploadDocumentSource = 'camera' | 'gallery';

export interface UploadedDocument {
  uri: string;
  fileName?: string;
  mimeType?: string;
  width?: number;
  height?: number;
}

export interface UploadDocumentSheetProps {
  visible: boolean;
  onClose: () => void;
  onPicked: (document: UploadedDocument) => void;
  title?: string;
  subtitle?: string;
  cameraLabel?: string;
  cameraHint?: string;
  galleryLabel?: string;
  galleryHint?: string;
  cancelLabel?: string;
  /** Which sources to show (default: camera + gallery). */
  sources?: readonly UploadDocumentSource[];
  /** Forwarded to expo-image-picker. */
  imagePickerOptions?: ImagePickerOptions;
}
