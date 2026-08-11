import React, { useCallback } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/shared/theme';
import { styles } from './Dropdown.styles';
import type { DropdownProps } from './Dropdown.types';
import { AppText as Text } from '../AppText';

export const Dropdown = <T extends string | number>({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: DropdownProps<T>) => {
  const insets = useSafeAreaInsets();

  const handleSelect = useCallback(
    (value: T) => {
      onSelect(value);
      onClose();
    },
    [onClose, onSelect],
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Close dropdown">
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.xxl) }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="people" size={18} color={colors.primary} />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close">
              <Ionicons name="close" size={22} color={colors.primary} />
            </Pressable>
          </View>

          <View style={styles.options}>
            {options.map((option) => {
              const selected = option.value === selectedValue;
              return (
                <Pressable
                  key={String(option.value)}
                  onPress={() => handleSelect(option.value)}
                  style={[styles.option, selected && styles.optionSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityLabel={option.label}
                  android_ripple={{ color: 'rgba(29, 78, 216, 0.12)' }}
                >
                  <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                    {option.label}
                  </Text>
                  {selected ? (
                    <View style={styles.check}>
                      <Ionicons name="checkmark" size={14} color={colors.white} />
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={16} color={colors.border} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
