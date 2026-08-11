import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { styles } from './PreferenceVehicleCard.styles';
import type { PreferenceVehicleCardProps } from './PreferenceVehicleCard.types';

export const PreferenceVehicleCard = ({
  vehicle,
  selected,
  onSelect,
}: PreferenceVehicleCardProps) => (
  <Pressable
    style={({ pressed }) => [
      styles.card,
      selected && styles.cardSelected,
      pressed && styles.cardPressed,
    ]}
    onPress={onSelect}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={`${vehicle.name}, ${vehicle.plateNumber}`}
  >
    <View style={[styles.iconWrap, selected && styles.iconWrapSelected]}>
      <Ionicons
        name={vehicle.icon === 'car-sport' ? 'car-sport-outline' : 'car-outline'}
        size={24}
        color={selected ? colors.primary : colors.textSecondary}
      />
    </View>
    <View style={styles.meta}>
      <Text style={styles.name}>{vehicle.name}</Text>
      <Text style={styles.plate}>{vehicle.plateNumber}</Text>
    </View>
    {selected ? (
      <View style={styles.check}>
        <Ionicons name="checkmark" size={14} color={colors.white} />
      </View>
    ) : null}
  </Pressable>
);
