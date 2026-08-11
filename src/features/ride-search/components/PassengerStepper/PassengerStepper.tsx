import React, { useCallback } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './PassengerStepper.styles';
import type { PassengerStepperProps } from './PassengerStepper.types';
import { AppText as Text } from '@/shared/components';

export const PassengerStepper = ({
  value,
  min = 1,
  max = 6,
  onChange,
}: PassengerStepperProps) => {
  const canDecrease = value > min;
  const canIncrease = value < max;

  const decrement = useCallback(() => {
    if (canDecrease) {
      onChange(value - 1);
    }
  }, [canDecrease, onChange, value]);

  const increment = useCallback(() => {
    if (canIncrease) {
      onChange(value + 1);
    }
  }, [canIncrease, onChange, value]);

  return (
    <View style={styles.field} accessibilityLabel={`Passengers, ${value}`}>
      <Text style={styles.title}>Passengers</Text>
      <View style={styles.control}>
        <Pressable
          onPress={decrement}
          disabled={!canDecrease}
          style={[styles.button, !canDecrease && styles.buttonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Decrease passengers"
          accessibilityState={{ disabled: !canDecrease }}
          android_ripple={{ color: 'rgba(29, 78, 216, 0.12)', borderless: true }}
        >
          <Ionicons
            name="remove"
            size={18}
            color={canDecrease ? colors.primary : colors.textPlaceholder}
          />
        </Pressable>

        <Text style={styles.value}>{value}</Text>

        <Pressable
          onPress={increment}
          disabled={!canIncrease}
          style={[styles.button, !canIncrease && styles.buttonDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Increase passengers"
          accessibilityState={{ disabled: !canIncrease }}
          android_ripple={{ color: 'rgba(29, 78, 216, 0.12)', borderless: true }}
        >
          <Ionicons
            name="add"
            size={18}
            color={canIncrease ? colors.primary : colors.textPlaceholder}
          />
        </Pressable>
      </View>
    </View>
  );
};
