import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './IconButton.styles';
import type { IconButtonProps } from './IconButton.types';

export const IconButton = React.memo(
  ({
    icon,
    onPress,
    size = 24,
    color = colors.primary,
    accessibilityLabel,
    style,
    showBadge = false,
  }: IconButtonProps) => (
    <Pressable
      onPress={onPress}
      style={[styles.button, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      android_ripple={{ color: 'rgba(29, 78, 216, 0.08)', borderless: true }}
    >
      <Ionicons name={icon} size={size} color={color} />
      {showBadge ? <View style={styles.badge} /> : null}
    </Pressable>
  ),
);

IconButton.displayName = 'IconButton';
