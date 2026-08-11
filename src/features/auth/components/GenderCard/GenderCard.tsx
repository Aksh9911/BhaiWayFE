import React, { useCallback } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { triggerSelectionHaptic } from '@/shared/utils';
import { styles } from './GenderCard.styles';
import type { GenderCardProps } from './GenderCard.types';
import { AppText as Text } from '@/shared/components';

export const GenderCard = ({
  label,
  value,
  selected,
  onSelect,
  fullWidth = false,
}: GenderCardProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    triggerSelectionHaptic();
    onSelect(value);
  }, [onSelect, value]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  }, [scale]);

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      style={fullWidth ? styles.fullWidth : styles.flexFill}
      android_ripple={{ color: 'rgba(29, 78, 216, 0.08)' }}
    >
      <Animated.View
        style={[
          styles.card,
          selected ? styles.selected : styles.unselected,
          animatedStyle,
        ]}
      >
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};
