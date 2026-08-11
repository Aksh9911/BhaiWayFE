import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { BOOKED_SCREEN } from '../../constants';
import type { BookedRideDetails } from '../../types';
import { styles } from './BookedRideDetailsCard.styles';
import { AppText as Text } from '@/shared/components';

export interface BookedRideDetailsCardProps {
  details: BookedRideDetails;
}

export const BookedRideDetailsCard = React.memo(({ details }: BookedRideDetailsCardProps) => (
  <View style={styles.card}>
    <View style={styles.decorCircle} pointerEvents="none" />

    <Text style={styles.sectionLabel}>{BOOKED_SCREEN.rideDetailsLabel}</Text>

    <View style={styles.routeRow}>
      <View style={styles.indicator}>
        <View style={styles.pickupDot} />
        <View style={styles.routeLine} />
        <View style={styles.dropDot} />
      </View>
      <View style={styles.routeText}>
        <View style={styles.locationBlock}>
          <Text style={styles.locationLabel}>{BOOKED_SCREEN.pickupLabel}</Text>
          <Text style={styles.locationValue}>{details.pickup}</Text>
        </View>
        <View style={styles.locationBlock}>
          <Text style={styles.locationLabel}>{BOOKED_SCREEN.dropLabel}</Text>
          <Text style={styles.locationValue}>{details.dropoff}</Text>
        </View>
      </View>
    </View>

    <View style={styles.metaBlock}>
      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons name="car-outline" size={22} color="#45464D" />
        </View>
        <View style={styles.infoMeta}>
          <Text style={styles.infoLabel}>{BOOKED_SCREEN.vehicleLabel}</Text>
          <Text style={styles.infoValue}>
            {details.vehicle} ({details.plateNumber})
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoIcon}>
          <Ionicons name="calendar-outline" size={22} color="#45464D" />
        </View>
        <View style={styles.infoMeta}>
          <Text style={styles.infoLabel}>{BOOKED_SCREEN.dateTimeLabel}</Text>
          <Text style={styles.infoValue}>{details.dateTimeLabel}</Text>
        </View>
      </View>
    </View>
  </View>
));

BookedRideDetailsCard.displayName = 'BookedRideDetailsCard';
