import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';

export interface IconButtonProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  size?: number;
  color?: string;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  showBadge?: boolean;
}
