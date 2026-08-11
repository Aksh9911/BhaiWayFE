import React, { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { BrandTopBar } from '@/shared/components/BrandTopBar';
import { IconButton } from '@/shared/components/IconButton';
import { colors } from '@/shared/theme';

export interface RideSearchTopBarProps {
  onMenuPress: () => void;
  onNotificationsPress?: () => void;
}

/**
 * Find-ride / results top bar. AppFooter already has Profile, so the right
 * action is notifications (not profile avatar).
 */
export const RideSearchTopBar = ({
  onMenuPress,
  onNotificationsPress,
}: RideSearchTopBarProps) => {
  const router = useRouter();

  const openNotifications = useCallback(() => {
    if (onNotificationsPress) {
      onNotificationsPress();
      return;
    }
    router.push(ROUTES.notifications);
  }, [onNotificationsPress, router]);

  return (
    <BrandTopBar
      onMenuPress={onMenuPress}
      right={
        <IconButton
          icon="notifications-outline"
          onPress={openNotifications}
          color={colors.primary}
          accessibilityLabel="Notifications"
        />
      }
    />
  );
};
