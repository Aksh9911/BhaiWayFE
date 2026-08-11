import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button, AppText as Text } from '@/shared/components';
import { colors } from '@/shared/theme';
import { styles } from './EmptyHomeState.styles';
import type { EmptyHomeStateProps } from './EmptyHomeState.types';

const VARIANT_ICON = {
  error: 'cloud-offline-outline',
  empty: 'car-outline',
} as const;

export const EmptyHomeState = React.memo(
  ({
    variant = 'empty',
    title = 'Nothing here yet',
    message = 'We could not find anything to show right now.',
    onRetry,
  }: EmptyHomeStateProps) => (
    <View style={styles.container} accessibilityRole="summary">
      <Ionicons name={VARIANT_ICON[variant]} size={48} color={colors.textSecondary} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Button
          label="Try Again"
          onPress={onRetry}
          variant="primary"
          fullWidth={false}
          style={styles.action}
          accessibilityLabel="Retry loading home"
        />
      ) : null}
    </View>
  ),
);

EmptyHomeState.displayName = 'EmptyHomeState';
