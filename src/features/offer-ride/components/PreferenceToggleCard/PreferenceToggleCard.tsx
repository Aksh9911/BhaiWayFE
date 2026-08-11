import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { styles } from './PreferenceToggleCard.styles';
import type { PreferenceToggleCardProps } from './PreferenceToggleCard.types';

export const PreferenceToggleCard = ({
  label,
  icon,
  selected,
  onToggle,
}: PreferenceToggleCardProps) => (
  <Pressable
    style={({ pressed }) => [
      styles.card,
      selected && styles.cardSelected,
      pressed && styles.cardPressed,
    ]}
    onPress={onToggle}
    accessibilityRole="checkbox"
    accessibilityState={{ checked: selected }}
    accessibilityLabel={label}
  >
    <View style={styles.topRow}>
      <Ionicons name={icon} size={22} color={colors.textSecondary} />
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
      </View>
    </View>
    <Text style={styles.label}>{label}</Text>
  </Pressable>
);
