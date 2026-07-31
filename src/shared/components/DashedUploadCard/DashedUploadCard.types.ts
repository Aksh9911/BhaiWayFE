import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type DashedUploadCardStatus = 'idle' | 'uploading' | 'uploaded';

export interface DashedUploadCardProps {
  status?: DashedUploadCardStatus;
  title: string;
  subtitle?: string;
  uploadingLabel?: string;
  uploadedLabel?: string;
  uploadedMeta?: string | null;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Optional idle-state leading node (defaults to camera circle). */
  idleIcon?: ReactNode;
}
