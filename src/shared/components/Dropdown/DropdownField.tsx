import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './Dropdown.styles';
import type { DropdownFieldProps } from './Dropdown.types';

export const DropdownField = ({
  label,
  valueLabel,
  placeholder = 'Select',
  open,
  onPress,
  icon = 'people-outline',
  accessibilityLabel,
}: DropdownFieldProps) => {
  const displayValue = valueLabel || placeholder;
  const isPlaceholder = !valueLabel;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.field, open && styles.fieldOpen]}
      accessibilityRole="button"
      accessibilityState={{ expanded: open }}
      accessibilityLabel={accessibilityLabel ?? label}
      android_ripple={{ color: 'rgba(29, 78, 216, 0.12)' }}
    >
      <Text style={[styles.fieldLabel, open && styles.fieldLabelOpen]}>{label}</Text>
      <View style={styles.fieldRow}>
        <Ionicons name={icon} size={18} color={open ? colors.primary : colors.textSecondary} />
        <Text
          style={[styles.fieldValue, isPlaceholder && styles.fieldPlaceholder]}
          numberOfLines={1}
        >
          {displayValue}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={open ? colors.primary : colors.primary}
        />
      </View>
    </Pressable>
  );
};
