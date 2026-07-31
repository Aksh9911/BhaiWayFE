import React from 'react';
import { Text } from 'react-native';

import { AppTopBar } from '../AppTopBar/AppTopBar';
import { Avatar } from '../Avatar/Avatar';
import { IconButton } from '../IconButton/IconButton';
import { colors, typography } from '@/shared/theme';
import { useSessionUser } from '@/shared/hooks';
import type { ScreenHeaderProps } from './ScreenHeader.types';

export const ScreenHeader = ({
  title,
  onBack,
  onProfilePress,
  right,
  showBack = true,
}: ScreenHeaderProps) => {
  const user = useSessionUser();

  return (
    <AppTopBar
      left={
        showBack ? (
          <IconButton
            icon="arrow-back"
            onPress={onBack}
            color={colors.textPrimary}
            accessibilityLabel="Go back"
          />
        ) : null
      }
      center={
        <Text
          style={[typography.title, { fontSize: 18, color: colors.textPrimary }]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {title}
        </Text>
      }
      right={
        right ?? (
          <Avatar
            uri={user?.avatarUri}
            onPress={onProfilePress ?? onBack}
            accessibilityLabel="Open profile"
          />
        )
      }
    />
  );
};
