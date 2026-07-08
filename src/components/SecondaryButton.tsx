import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, layout, typography } from '../theme';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
};

export default function SecondaryButton({
  label,
  onPress,
  accessibilityLabel,
}: SecondaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: layout.buttonWidthPercent,
    height: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  label: {
    ...typography.buttonSecondary,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
