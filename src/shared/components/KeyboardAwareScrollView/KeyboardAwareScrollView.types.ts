import type { ReactNode, Ref } from 'react';
import type { ScrollView, ScrollViewProps, StyleProp, ViewStyle } from 'react-native';

export interface KeyboardAwareScrollViewProps {
  children: ReactNode;
  /** Sticky CTA below the scroll area, inside KeyboardAvoidingView. */
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  bottomInset?: number;
  showsVerticalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  scrollViewRef?: Ref<ScrollView>;
  onScroll?: ScrollViewProps['onScroll'];
  scrollEventThrottle?: number;
  /** Override default platform keyboardVerticalOffset (e.g. header height). */
  keyboardVerticalOffset?: number;
  /**
   * Extra space reserved below the focused field (e.g. external AppFooter height)
   * so the keyboard + footer never cover the active input.
   */
  extraBottomOffset?: number;
}
