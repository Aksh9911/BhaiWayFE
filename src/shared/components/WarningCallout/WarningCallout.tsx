import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { AppText as Text } from '../AppText';
import { styles } from './WarningCallout.styles';
import type { WarningCalloutProps } from './WarningCallout.types';

export const WarningCallout = React.memo(
  ({
    message,
    prefix = 'Note:',
    icon = 'information-circle',
    style,
  }: WarningCalloutProps) => (
    <View style={[styles.wrap, style]} accessibilityRole="text">
      <Ionicons name={icon} size={20} color={colors.warningDark} />
      <Text style={styles.text}>
        {prefix ? <Text style={styles.prefix}>{prefix} </Text> : null}
        {message}
      </Text>
    </View>
  ),
);

WarningCallout.displayName = 'WarningCallout';
