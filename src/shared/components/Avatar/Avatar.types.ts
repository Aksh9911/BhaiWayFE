import type { StyleProp, ViewStyle } from 'react-native';

export interface AvatarProps {
  uri?: string | null;
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
}
