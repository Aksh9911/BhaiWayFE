import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './RideDetailsScheduleCard.styles';

export interface RideDetailsScheduleCardProps {
  dateTimeLabel: string;
}

export const RideDetailsScheduleCard = React.memo(
  ({ dateTimeLabel }: RideDetailsScheduleCardProps) => (
    <View style={styles.card} accessibilityLabel={`Scheduled ${dateTimeLabel}`}>
      <Ionicons name="calendar-outline" size={22} color={colors.primary} />
      <Text style={styles.label}>{dateTimeLabel}</Text>
    </View>
  ),
);

RideDetailsScheduleCard.displayName = 'RideDetailsScheduleCard';
