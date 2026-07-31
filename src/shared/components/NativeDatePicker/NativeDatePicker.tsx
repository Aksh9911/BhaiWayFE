import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing } from '@/shared/theme';
import { styles } from './NativeDatePicker.styles';
import type { NativeDatePickerProps } from './NativeDatePicker.types';

export const NativeDatePicker = ({
  visible,
  value,
  minimumDate,
  maximumDate,
  onChange,
  onClose,
  title = 'Select date',
  mode = 'date',
}: NativeDatePickerProps) => {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (visible) {
      setDraft(value);
    }
  }, [value, visible]);

  const handleChange = useCallback(
    (event: DateTimePickerEvent, selected?: Date) => {
      if (Platform.OS === 'android') {
        onClose();
        if (event.type === 'set' && selected) {
          onChange(selected);
        }
        return;
      }

      if (selected) {
        setDraft(selected);
      }
    },
    [onChange, onClose],
  );

  const handleDone = useCallback(() => {
    onChange(draft);
    onClose();
  }, [draft, onChange, onClose]);

  if (!visible) {
    return null;
  }

  if (Platform.OS === 'android') {
    return (
      <DateTimePicker
        value={value}
        mode={mode}
        display="default"
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onChange={handleChange}
        positiveButton={{ label: 'OK', textColor: colors.primary }}
        negativeButton={{ label: 'Cancel', textColor: colors.textSecondary }}
      />
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Close date picker">
        <Pressable
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.xxl) }]}
          onPress={(event) => event.stopPropagation()}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name={mode === 'time' ? 'time' : 'calendar'}
                size={18}
                color={colors.primary}
              />
            </View>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={handleDone} accessibilityRole="button" accessibilityLabel="Done">
              <Text style={styles.done}>Done</Text>
            </Pressable>
          </View>

          <View style={styles.pickerWrap}>
            <DateTimePicker
              value={draft}
              mode={mode}
              display="spinner"
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={handleChange}
              style={styles.picker}
              themeVariant="light"
              accentColor={colors.primary}
              textColor={colors.primary}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
