import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface SectionHeaderProps {
  title: string;
  /** Show the vertical accent bar (default true). */
  showAccent?: boolean;
  accentColor?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
}
