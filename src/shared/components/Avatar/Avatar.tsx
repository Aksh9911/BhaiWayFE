import React, { useMemo } from 'react';
import { Image, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, layout } from '@/shared/theme';
import { createAvatarStyles } from './Avatar.styles';
import type { AvatarProps } from './Avatar.types';

const DEFAULT_SIZE = 40;

export const Avatar = ({
  uri,
  size = DEFAULT_SIZE,
  onPress,
  accessibilityLabel = 'Profile photo',
  style,
}: AvatarProps) => {
  const styles = useMemo(() => createAvatarStyles(size), [size]);
  const iconSize = Math.round(size * 0.55);

  const content = uri ? (
    <Image
      source={{ uri }}
      style={styles.image}
      accessibilityIgnoresInvertColors
      accessibilityLabel={accessibilityLabel}
    />
  ) : (
    <Ionicons name="person" size={iconSize} color={colors.primary} />
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={[styles.container, style]}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        hitSlop={8}
        android_ripple={{ color: 'rgba(29, 78, 216, 0.08)', borderless: true }}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.container, style]}>{content}</View>;
};
