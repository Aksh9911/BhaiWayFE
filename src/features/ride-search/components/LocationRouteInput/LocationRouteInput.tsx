import React, { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors } from '@/shared/theme';
import { styles } from './LocationRouteInput.styles';
import type { LocationRouteInputProps } from './LocationRouteInput.types';

interface FieldProps {
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
  onClear?: () => void;
}

const LocationField = ({ label, value, placeholder, onPress, onClear }: FieldProps) => (
  <Pressable
    style={styles.fieldBox}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
    android_ripple={{ color: 'rgba(29, 78, 216, 0.06)' }}
  >
    <View style={styles.fieldContent}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text
        style={[styles.fieldInput, !value && styles.destinationPlaceholder]}
        numberOfLines={1}
      >
        {value || placeholder}
      </Text>
    </View>
    {value && onClear ? (
      <Pressable
        onPress={onClear}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Clear ${label}`}
        style={styles.clearButton}
      >
        <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
      </Pressable>
    ) : null}
  </Pressable>
);

export const LocationRouteInput = ({
  origin,
  destination,
  originPlaceholder = 'Choose starting point',
  destinationPlaceholder,
  originLabel = 'Starting point',
  destinationLabel = 'Destination',
  onOriginPress,
  onDestinationPress,
  onOriginClear,
  onDestinationClear,
  onSwapPress,
}: LocationRouteInputProps) => {
  const rotation = useSharedValue(0);

  const swapIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const handleSwap = useCallback(() => {
    rotation.value = withSpring(rotation.value + 180, { damping: 14, stiffness: 160 });
    onSwapPress?.();
  }, [onSwapPress, rotation]);

  return (
    <View style={styles.row}>
      <View style={styles.routeIndicator}>
        <View style={styles.originDot} />
        <View style={styles.routeLine} />
        <Ionicons name="location" size={18} color={colors.primary} />
      </View>

      <View style={styles.fields}>
        <LocationField
          label={originLabel}
          value={origin}
          placeholder={originPlaceholder}
          onPress={onOriginPress}
          onClear={onOriginClear}
        />
        <LocationField
          label={destinationLabel}
          value={destination}
          placeholder={destinationPlaceholder}
          onPress={onDestinationPress}
          onClear={onDestinationClear}
        />
      </View>

      {onSwapPress ? (
        <View style={styles.swapColumn}>
          <Pressable
            onPress={handleSwap}
            style={styles.swapButton}
            accessibilityRole="button"
            accessibilityLabel="Swap starting point and destination"
            android_ripple={{ color: 'rgba(29, 78, 216, 0.12)', borderless: true }}
            hitSlop={8}
          >
            <Animated.View style={swapIconStyle}>
              <Ionicons name="swap-vertical" size={18} color={colors.primary} />
            </Animated.View>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};
