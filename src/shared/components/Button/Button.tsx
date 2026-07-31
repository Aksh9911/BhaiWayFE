import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors } from '@/shared/theme';
import { triggerLightHaptic } from '@/shared/utils';
import { styles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export const Button = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  showArrow = false,
  fullWidth = true,
  style,
  accessibilityLabel,
}: ButtonProps) => {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;
  const isPrimary = variant === 'primary';
  const isDark = variant === 'dark';
  const isAccent = variant === 'accent';

  const variantStyle = isPrimary
    ? styles.primary
    : isDark
      ? styles.dark
      : isAccent
        ? styles.accent
        : styles.secondary;

  const labelStyle = isPrimary || isDark ? styles.labelPrimary : isAccent ? styles.labelAccent : styles.labelSecondary;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    if (!isDisabled) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
    }
  }, [isDisabled, scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePress = useCallback(() => {
    if (isDisabled) {
      return;
    }
    triggerLightHaptic();
    onPress();
  }, [isDisabled, onPress]);

  const rippleColor =
    isPrimary || isDark
      ? 'rgba(255, 255, 255, 0.25)'
      : 'rgba(29, 78, 216, 0.12)';

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={fullWidth ? styles.fullWidth : undefined}
      android_ripple={{ color: rippleColor, borderless: false }}
    >
      <Animated.View
        style={[
          styles.base,
          fullWidth && styles.fullWidth,
          variantStyle,
          isDisabled && (isPrimary || isDark) && styles.disabled,
          animatedStyle,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={isPrimary || isDark ? colors.textInverse : colors.primary}
          />
        ) : (
          <View style={styles.content}>
            <Text style={labelStyle}>{label}</Text>
            {showArrow ? (
              <Ionicons
                name="arrow-forward"
                size={20}
                color={isPrimary || isDark ? colors.textInverse : colors.primary}
              />
            ) : null}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};
