import { useCallback, useState } from 'react';
import type { ImagePickerOptions } from 'expo-image-picker';

import type {
  UploadedDocument,
  UploadDocumentSheetProps,
  UploadDocumentSource,
} from './UploadDocumentSheet.types';

export interface UseUploadDocumentSheetOptions {
  onPicked: (document: UploadedDocument) => void;
  title?: string;
  subtitle?: string;
  sources?: readonly UploadDocumentSource[];
  imagePickerOptions?: ImagePickerOptions;
}

export interface UseUploadDocumentSheetResult {
  visible: boolean;
  open: () => void;
  close: () => void;
  sheetProps: UploadDocumentSheetProps;
}

/** Controls a shared UploadDocumentSheet for any screen with an upload action. */
export const useUploadDocumentSheet = ({
  onPicked,
  title,
  subtitle,
  sources,
  imagePickerOptions,
}: UseUploadDocumentSheetOptions): UseUploadDocumentSheetResult => {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return {
    visible,
    open,
    close,
    sheetProps: {
      visible,
      onClose: close,
      onPicked,
      title,
      subtitle,
      sources,
      imagePickerOptions,
    },
  };
};
