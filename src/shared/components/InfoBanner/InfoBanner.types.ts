import type { ComponentProps, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';

export type InfoBannerVariant = 'accent' | 'security' | 'verify';

export interface InfoBannerProps {
  title: string;
  description: string;
  variant?: InfoBannerVariant;
  icon?: ComponentProps<typeof Ionicons>['name'];
  actionLabel?: string;
  onActionPress?: () => void;
  /** Optional custom leading node (overrides icon circle). */
  leading?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
