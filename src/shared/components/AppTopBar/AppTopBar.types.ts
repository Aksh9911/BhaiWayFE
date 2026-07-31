import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface AppTopBarProps {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}
