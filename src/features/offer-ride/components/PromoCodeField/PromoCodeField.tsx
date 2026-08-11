import React from 'react';
import { Pressable, View } from 'react-native';

import { AppText as Text, AppTextInput as TextInput } from '@/shared/components';
import { colors } from '@/shared/theme';
import { styles } from './PromoCodeField.styles';
import type { PromoCodeFieldProps } from './PromoCodeField.types';

export const PromoCodeField = ({
  value,
  onChangeText,
  onApply,
  placeholder,
  applyLabel,
  accessibilityLabel,
}: PromoCodeFieldProps) => (
  <View style={styles.row}>
    <View style={styles.inputWrap}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textPlaceholder}
        autoCapitalize="characters"
        accessibilityLabel={accessibilityLabel ?? placeholder}
      />
    </View>
    <Pressable
      style={styles.apply}
      onPress={onApply}
      accessibilityRole="button"
      accessibilityLabel={applyLabel}
    >
      <Text style={styles.applyLabel}>{applyLabel}</Text>
    </Pressable>
  </View>
);
