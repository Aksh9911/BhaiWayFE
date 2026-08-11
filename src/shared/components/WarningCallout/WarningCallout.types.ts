import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export interface WarningCalloutProps {
  message: string;
  /** Defaults to "Note:". Pass empty string to hide. */
  prefix?: string;
  icon?: IoniconName;
  style?: StyleProp<ViewStyle>;
}
