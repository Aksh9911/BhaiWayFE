import React from 'react';

import { Avatar, BrandTopBar } from '@/shared/components';
import { useSessionUser } from '@/shared/hooks';

export interface RideSearchTopBarProps {
  onMenuPress: () => void;
  onProfilePress: () => void;
}

export const RideSearchTopBar = ({ onMenuPress, onProfilePress }: RideSearchTopBarProps) => {
  const user = useSessionUser();

  return (
    <BrandTopBar
      onMenuPress={onMenuPress}
      right={
        <Avatar
          uri={user?.avatarUri}
          onPress={onProfilePress}
          accessibilityLabel="Open profile"
        />
      }
    />
  );
};
