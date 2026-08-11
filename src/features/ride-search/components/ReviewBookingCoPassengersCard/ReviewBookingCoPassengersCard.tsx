import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { REVIEW_BOOKING_SCREEN } from '../../constants';
import type { CoPassenger } from '../../types';
import { styles } from './ReviewBookingCoPassengersCard.styles';
import { AppText as Text } from '@/shared/components';

export interface ReviewBookingCoPassengersCardProps {
  passengers: CoPassenger[];
  maxPassengers: number;
}

export const ReviewBookingCoPassengersCard = React.memo(
  ({ passengers, maxPassengers }: ReviewBookingCoPassengersCardProps) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {REVIEW_BOOKING_SCREEN.coPassengersLabel} ({passengers.length}/{maxPassengers})
      </Text>
      {passengers.map((passenger) => (
        <View key={passenger.id} style={styles.row}>
          <View style={styles.avatarFallback}>
            <Ionicons name="person" size={20} color={colors.textSecondary} />
          </View>
          <View style={styles.meta}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{passenger.name}</Text>
              {passenger.verified ? (
                <View style={styles.badge}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
                  <Text style={styles.badgeText}>Verified</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.company}>{passenger.company}</Text>
          </View>
        </View>
      ))}
    </View>
  ),
);

ReviewBookingCoPassengersCard.displayName = 'ReviewBookingCoPassengersCard';
