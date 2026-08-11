import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import type { RideDetailsDriver } from '../../types';
import { styles } from './RideDetailsDriverCard.styles';

export interface RideDetailsDriverCardProps {
  driver: RideDetailsDriver;
}

export const RideDetailsDriverCard = React.memo(({ driver }: RideDetailsDriverCardProps) => (
  <View style={styles.card}>
    <View style={styles.photo}>
      <Avatar size={64} uri={driver.avatarUri} accessibilityLabel={`${driver.name} photo`} />
    </View>
    <View style={styles.body}>
      <View style={styles.topRow}>
        <View style={styles.meta}>
          <Text style={styles.name}>{driver.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.rating}>{driver.rating.toFixed(1)}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.company}>{driver.company}</Text>
          </View>
        </View>
        {driver.verified ? (
          <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
        ) : null}
      </View>
      <View style={styles.vehicleRow}>
        <Ionicons name="car-outline" size={18} color="#434655" />
        <Text style={styles.vehicleText}>
          {driver.vehicleColor} {driver.vehicleModel}
          <Text style={styles.vehicleDivider}> | </Text>
          {driver.plateNumber}
        </Text>
      </View>
    </View>
  </View>
));

RideDetailsDriverCard.displayName = 'RideDetailsDriverCard';
