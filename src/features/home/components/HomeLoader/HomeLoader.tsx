import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { colors } from '@/shared/theme';
import { styles } from './HomeLoader.styles';
import { AppText as Text } from '@/shared/components';

export interface HomeLoaderProps {
  label?: string;
}

export const HomeLoader = React.memo(({ label = 'Loading your rides…' }: HomeLoaderProps) => (
  <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
    <ActivityIndicator color={colors.primary} size="large" />
    <Text style={styles.label}>{label}</Text>
  </View>
));

HomeLoader.displayName = 'HomeLoader';
