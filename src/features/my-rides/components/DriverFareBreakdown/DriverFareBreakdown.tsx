import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import type { DriverTripCompletedFareLine } from '../../types';
import { styles } from './DriverFareBreakdown.styles';

export interface DriverFareBreakdownProps {
  lines: readonly DriverTripCompletedFareLine[];
}

export const DriverFareBreakdown = ({ lines }: DriverFareBreakdownProps) => (
  <View style={styles.list}>
    {lines.map((line) => (
      <View key={line.label} style={styles.row}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{line.label}</Text>
          {line.highlight ? (
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.primary}
            />
          ) : null}
        </View>
        <Text style={[styles.value, line.highlight && styles.valueHighlight]}>
          {line.amountLabel}
        </Text>
      </View>
    ))}
  </View>
);
