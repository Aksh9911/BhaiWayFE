import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ScreenSectionProps {
  title?: string;
  headerRight?: ReactNode;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}
