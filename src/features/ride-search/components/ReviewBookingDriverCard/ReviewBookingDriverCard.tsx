import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import type { BookingDriver } from '../../types';
import { styles } from './ReviewBookingDriverCard.styles';

export interface ReviewBookingDriverCardProps {
  driver: BookingDriver;
}

export const ReviewBookingDriverCard = React.memo(({ driver }: ReviewBookingDriverCardProps) => (
  <View style={styles.card}>
    <View style={styles.left}>
      <Avatar uri={driver.avatarUri} size={48} accessibilityLabel={`${driver.name} photo`} />
      <View style={styles.meta}>
        <Text style={styles.name}>{driver.name}</Text>
        <View style={styles.subtitleRow}>
          <Ionicons name="business-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.subtitle}>{driver.subtitle}</Text>
        </View>
      </View>
    </View>
    <View style={styles.stats}>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={18} color={colors.primary} />
        <Text style={styles.rating}>{driver.rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.rides}>{driver.totalRides.toLocaleString('en-IN')} rides</Text>
    </View>
  </View>
));

ReviewBookingDriverCard.displayName = 'ReviewBookingDriverCard';
