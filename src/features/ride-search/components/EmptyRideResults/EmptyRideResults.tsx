import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/shared/components';
import { colors } from '@/shared/theme';
import { RIDE_RESULT_SCREEN } from '../../constants';
import { styles } from './EmptyRideResults.styles';
import type { EmptyRideResultsProps } from './EmptyRideResults.types';

export const EmptyRideResults = React.memo(
  ({ onModifySearch, onRefresh }: EmptyRideResultsProps) => (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.iconWrap}>
        <Ionicons name="car-outline" size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>{RIDE_RESULT_SCREEN.emptyTitle}</Text>
      <Text style={styles.subtitle}>{RIDE_RESULT_SCREEN.emptySubtitle}</Text>
      <View style={styles.actions}>
        <Button
          label={RIDE_RESULT_SCREEN.modifySearchLabel}
          onPress={onModifySearch}
          variant="primary"
        />
        <Button
          label={RIDE_RESULT_SCREEN.refreshLabel}
          onPress={onRefresh}
          variant="secondary"
        />
      </View>
    </View>
  ),
);

EmptyRideResults.displayName = 'EmptyRideResults';
