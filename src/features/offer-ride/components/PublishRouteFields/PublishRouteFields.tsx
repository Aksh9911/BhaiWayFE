import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './PublishRouteFields.styles';
import type { PublishRouteFieldsProps } from './PublishRouteFields.types';

export const PublishRouteFields = ({
  origin,
  destination,
  onOriginPress,
  onDestinationPress,
}: PublishRouteFieldsProps) => (
  <View style={styles.row}>
    <View style={styles.indicator}>
      <View style={styles.dot} />
      <View style={styles.line} />
      <Ionicons name="location" size={18} color={colors.textPrimary} />
    </View>

    <View style={styles.fields}>
      <Pressable
        onPress={onOriginPress}
        style={styles.field}
        accessibilityRole="button"
        accessibilityLabel="Select leaving from location"
        android_ripple={{ color: 'rgba(29, 78, 216, 0.06)' }}
      >
        <Text style={styles.label}>Starting point</Text>
        <Text style={[styles.value, !origin && styles.placeholder]} numberOfLines={2}>
          {origin || 'Choose starting point'}
        </Text>
      </Pressable>

      <Pressable
        onPress={onDestinationPress}
        style={styles.field}
        accessibilityRole="button"
        accessibilityLabel="Select destination"
        android_ripple={{ color: 'rgba(29, 78, 216, 0.06)' }}
      >
        <Text style={styles.label}>Destination</Text>
        <Text style={[styles.value, !destination && styles.placeholder]} numberOfLines={2}>
          {destination || 'Choose destination'}
        </Text>
      </Pressable>
    </View>
  </View>
);
