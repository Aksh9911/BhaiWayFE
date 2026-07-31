import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/shared/theme';
import { styles } from './Header.styles';
import type { HeaderProps } from './Header.types';

export const Header = ({
  onBack,
  onHelp,
  title,
  variant = 'light',
  showBack = true,
  showHelp = true,
}: HeaderProps) => {
  const insets = useSafeAreaInsets();
  const isDark = variant === 'dark';
  const isProfile = variant === 'profile';
  const backgroundColor = isDark ? colors.surfaceMuted : colors.background;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + spacing.sm, backgroundColor },
        isProfile && styles.profileContainer,
      ]}
    >
      <View style={styles.side}>
        {showBack ? (
          <Pressable
            onPress={onBack}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            android_ripple={{ color: 'rgba(29, 78, 216, 0.08)', borderless: true }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>

      {title ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        <View style={styles.titlePlaceholder} />
      )}

      <View style={styles.side}>
        {showHelp ? (
          <Pressable
            onPress={onHelp}
            style={styles.iconButton}
            accessibilityRole="button"
            accessibilityLabel="Help and support"
            hitSlop={8}
            android_ripple={{ color: 'rgba(29, 78, 216, 0.08)', borderless: true }}
          >
            <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
          </Pressable>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};
