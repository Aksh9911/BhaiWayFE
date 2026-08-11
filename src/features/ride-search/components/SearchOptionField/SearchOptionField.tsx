import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './SearchOptionField.styles';
import type { SearchOptionFieldProps } from './SearchOptionField.types';
import { AppText as Text } from '@/shared/components';

export const SearchOptionField = React.memo(
  ({
    icon,
    title,
    value,
    onPress,
    accessibilityLabel,
    isPlaceholder = false,
    open = false,
  }: SearchOptionFieldProps) => (
    <Pressable
      onPress={onPress}
      style={[styles.field, open && styles.fieldOpen]}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={accessibilityLabel ?? `${title}, ${value}`}
      android_ripple={{ color: 'rgba(29, 78, 216, 0.12)' }}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.title, open && styles.titleOpen]}>{title}</Text>
        <Text style={[styles.value, isPlaceholder && styles.placeholder]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Ionicons
        name={open ? 'chevron-up' : 'chevron-down'}
        size={16}
        color={colors.primary}
      />
    </Pressable>
  ),
);

SearchOptionField.displayName = 'SearchOptionField';
