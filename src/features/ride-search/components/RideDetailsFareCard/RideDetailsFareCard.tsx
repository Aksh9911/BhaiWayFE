import React from 'react';
import { Text, View } from 'react-native';

import {
  formatRideDetailsAmount,
  RIDE_DETAILS_SCREEN,
} from '../../constants';
import type { RideDetailsFare } from '../../types';
import { styles } from './RideDetailsFareCard.styles';

export interface RideDetailsFareCardProps {
  fare: RideDetailsFare;
}

export const RideDetailsFareCard = React.memo(({ fare }: RideDetailsFareCardProps) => (
  <View style={styles.card}>
    <Text style={styles.title}>{RIDE_DETAILS_SCREEN.fareTitle}</Text>
    <View style={styles.rows}>
      <View style={styles.row}>
        <Text style={styles.label}>{RIDE_DETAILS_SCREEN.rideFareLabel}</Text>
        <Text style={styles.value}>{formatRideDetailsAmount(fare.rideFare)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{RIDE_DETAILS_SCREEN.totalLabel}</Text>
        <Text style={styles.totalValue}>{formatRideDetailsAmount(fare.total)}</Text>
      </View>
    </View>
  </View>
));

RideDetailsFareCard.displayName = 'RideDetailsFareCard';
