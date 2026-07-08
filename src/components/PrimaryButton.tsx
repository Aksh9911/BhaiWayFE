import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout, typography } from '../theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
};

export default function PrimaryButton({
  label,
  onPress,
  accessibilityLabel,
}: PrimaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.content}>
        <Text style={styles.label}>{label}</Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color={colors.white}
          style={styles.icon}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: layout.buttonWidthPercent,
    height: layout.buttonHeight,
    borderRadius: layout.buttonRadius,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.buttonPrimary,
    color: colors.white,
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    right: layout.iconRightOffset,
  },
});
