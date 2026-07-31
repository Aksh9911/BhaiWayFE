import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/shared/theme';
import { styles } from './IncentiveBanner.styles';
import type { IncentiveBannerProps } from './IncentiveBanner.types';

export const IncentiveBanner = React.memo(({ message }: IncentiveBannerProps) => (
  <View style={styles.banner}>
    <Ionicons name="flash" size={18} color={colors.primary} />
    <Text style={styles.text}>{message}</Text>
  </View>
));

IncentiveBanner.displayName = 'IncentiveBanner';
