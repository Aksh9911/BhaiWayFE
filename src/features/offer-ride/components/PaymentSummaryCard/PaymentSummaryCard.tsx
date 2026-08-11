import React from 'react';
import { View } from 'react-native';

import { AppText as Text } from '@/shared/components';
import { styles } from './PaymentSummaryCard.styles';
import type { PaymentSummaryCardProps } from './PaymentSummaryCard.types';

export const PaymentSummaryCard = ({
  rows,
  totalLabel,
  totalValue,
}: PaymentSummaryCardProps) => (
  <View style={styles.card}>
    {rows.map((row) => (
      <View key={row.label}>
        <View style={styles.row}>
          <Text style={styles.muted}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
        {row.hint ? <Text style={styles.hint}>{row.hint}</Text> : null}
      </View>
    ))}
    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>{totalLabel}</Text>
      <Text style={styles.totalValue}>{totalValue}</Text>
    </View>
  </View>
);
