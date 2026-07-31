import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ScreenIntroVariant = 'default' | 'large';

export interface ScreenIntroProps {
  title: string;
  subtitle?: string;
  variant?: ScreenIntroVariant;
  align?: 'left' | 'center';
  style?: StyleProp<ViewStyle>;
  titleAccessibilityRole?: 'header' | 'text';
}
