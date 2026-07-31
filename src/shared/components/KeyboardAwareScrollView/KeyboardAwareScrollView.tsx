import React from 'react';
import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/shared/theme';
import {
  keyboardAvoidingBehavior,
  keyboardVerticalOffset,
  scrollKeyboardDismissMode,
} from '@/shared/utils/platform';
import type { KeyboardAwareScrollViewProps } from './KeyboardAwareScrollView.types';

/**
 * Keyboard-safe scroll container.
 * Uses KeyboardAvoidingView only (no automaticallyAdjustKeyboardInsets)
 * to avoid double-offset / jitter when a sticky footer is present.
 */
export const KeyboardAwareScrollView = ({
  children,
  footer,
  style,
  contentContainerStyle,
  bottomInset = spacing.xxl,
  showsVerticalScrollIndicator = false,
  keyboardShouldPersistTaps = 'handled',
  scrollViewRef,
  onScroll,
  scrollEventThrottle = 16,
  keyboardVerticalOffset: offsetOverride,
}: KeyboardAwareScrollViewProps) => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={keyboardAvoidingBehavior}
      keyboardVerticalOffset={offsetOverride ?? keyboardVerticalOffset}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={[
          contentContainerStyle,
          { paddingBottom: insets.bottom + bottomInset },
        ]}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        keyboardDismissMode={scrollKeyboardDismissMode}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {children}
      </ScrollView>
      {footer ? <View>{footer}</View> : null}
    </KeyboardAvoidingView>
  );
};
