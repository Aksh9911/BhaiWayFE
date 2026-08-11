import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { REVIEW_BOOKING_SCREEN } from '../../constants';
import type { BookingLocation } from '../../types';
import { styles } from './ReviewBookingRouteCard.styles';
import { AppText as Text } from '@/shared/components';

export interface ReviewBookingRouteCardProps {
  pickup: BookingLocation;
  dropoff: BookingLocation;
  onEditPickup?: () => void;
  onEditDropoff?: () => void;
}

export const ReviewBookingRouteCard = React.memo(
  ({ pickup, dropoff, onEditPickup, onEditDropoff }: ReviewBookingRouteCardProps) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.indicatorCol}>
          <Ionicons name="radio-button-on" size={20} color={colors.primary} />
          <View style={styles.line} />
          <Ionicons name="location" size={20} color={colors.error} />
        </View>
        <View style={styles.contentCol}>
          <View style={styles.locationBlock}>
            <View style={styles.locationHeader}>
              <View style={styles.locationText}>
                <Text style={styles.label}>{REVIEW_BOOKING_SCREEN.pickupLabel}</Text>
                <Text style={styles.address}>{pickup.address}</Text>
              </View>
              {onEditPickup ? (
                <Pressable onPress={onEditPickup} hitSlop={8} accessibilityRole="button">
                  <Text style={styles.edit}>{REVIEW_BOOKING_SCREEN.editLabel}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
          <View style={styles.locationBlock}>
            <View style={styles.locationHeader}>
              <View style={styles.locationText}>
                <Text style={styles.label}>{REVIEW_BOOKING_SCREEN.dropoffLabel}</Text>
                <Text style={styles.address}>{dropoff.address}</Text>
              </View>
              {onEditDropoff ? (
                <Pressable onPress={onEditDropoff} hitSlop={8} accessibilityRole="button">
                  <Text style={styles.edit}>{REVIEW_BOOKING_SCREEN.editLabel}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </View>
  ),
);

ReviewBookingRouteCard.displayName = 'ReviewBookingRouteCard';
