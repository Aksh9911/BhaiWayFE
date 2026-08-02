import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/shared/theme';

export interface UploadProgressProps {
  progress: number;
  label?: string;
  visible?: boolean;
}

export const UploadProgress = ({
  progress,
  label = 'Uploading…',
  visible = true,
}: UploadProgressProps) => {
  if (!visible) {
    return null;
  }

  const clamped = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityValue={{ now: clamped, min: 0, max: 100 }}>
      <View style={styles.row}>
        <ActivityIndicator color={colors.primary} />
        <Text style={styles.label}>
          {label} {clamped}%
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${clamped}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  track: {
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
});
