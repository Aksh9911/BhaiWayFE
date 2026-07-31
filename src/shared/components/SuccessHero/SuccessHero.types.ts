import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface SuccessHeroProps {
  title: string;
  subtitle?: string;
  /** Icon size inside the circle (default 64). */
  iconSize?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}
