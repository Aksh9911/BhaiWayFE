import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './CheckboxRow.styles';
import type { CheckboxRowProps } from './CheckboxRow.types';

export const CheckboxRow = ({ label, checked, onToggle }: CheckboxRowProps) => (
  <Pressable
    onPress={onToggle}
    style={styles.row}
    accessibilityRole="checkbox"
    accessibilityState={{ checked }}
    accessibilityLabel={label}
    android_ripple={{ color: 'rgba(29, 78, 216, 0.06)' }}
  >
    <View style={[styles.box, checked && styles.boxChecked]}>
      {checked ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
    </View>
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);
