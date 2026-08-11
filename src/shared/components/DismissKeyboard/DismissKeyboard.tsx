import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

interface DismissKeyboardProps {
  children: React.ReactNode;
}

/**
 * Tapping empty/non-interactive space dismisses the keyboard.
 * Nested buttons and inputs still receive presses normally.
 */
export const DismissKeyboard = ({ children }: DismissKeyboardProps) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.fill}>{children}</View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
