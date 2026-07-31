import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { colors } from '@/shared/theme';
import { styles } from './Input.styles';
import type { InputProps } from './Input.types';

export const Input = ({ label, error, style, ...props }: InputProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textPlaceholder}
        accessibilityLabel={label}
        {...props}
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : null}
    </View>
  );
};
