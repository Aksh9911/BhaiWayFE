import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { styles } from './DestinationConfirmPanel.styles';
import type { DestinationConfirmPanelProps } from './DestinationConfirmPanel.types';

export const DestinationConfirmPanel = ({
  name,
  address,
  hint,
  confirmLabel,
  loading = false,
  disabled = false,
  onConfirm,
}: DestinationConfirmPanelProps) => (
  <View style={styles.panel}>
    <View style={styles.locationRow}>
      <View style={styles.iconBox}>
        <Ionicons name="location" size={24} color={colors.primary} />
      </View>
      <View style={styles.locationText}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.address} numberOfLines={2}>
          {address}
        </Text>
      </View>
    </View>

    <Button
      label={confirmLabel}
      onPress={onConfirm}
      variant="primary"
      showArrow
      loading={loading}
      disabled={disabled}
      accessibilityLabel={confirmLabel}
    />

    <View style={styles.hintRow}>
      <Ionicons name="information-circle-outline" size={14} color={colors.textSecondary} />
      <Text style={styles.hint}>{hint}</Text>
    </View>
  </View>
);
