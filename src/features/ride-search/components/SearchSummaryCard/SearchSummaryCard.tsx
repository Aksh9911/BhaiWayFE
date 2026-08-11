import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './SearchSummaryCard.styles';
import type { SearchSummaryCardProps } from './SearchSummaryCard.types';
import { AppText as Text } from '@/shared/components';

export const SearchSummaryCard = React.memo(({ summary }: SearchSummaryCardProps) => (
  <View style={styles.card}>
    <View style={styles.routeCol}>
      <View style={styles.routeIndicator}>
        <View style={styles.originDot} />
        <View style={styles.routeLine} />
        <View style={styles.destinationRing} />
      </View>
      <View style={styles.routeText}>
        <Text style={styles.city} numberOfLines={1}>
          {summary.originCity}
        </Text>
        <Text style={styles.city} numberOfLines={1}>
          {summary.destinationCity}
        </Text>
      </View>
    </View>

    <View style={styles.metaCol}>
      <Text style={styles.dateValue}>{summary.dateLabel}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.passengerValue}>{summary.passengerLabel}</Text>
      </View>
    </View>
  </View>
));

SearchSummaryCard.displayName = 'SearchSummaryCard';
