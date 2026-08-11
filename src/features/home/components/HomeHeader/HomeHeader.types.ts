import type { HomeLocation } from '../../types';

export interface HomeHeaderProps {
  brandName: string;
  location: HomeLocation;
  hasUnreadNotifications?: boolean;
  onNotificationsPress: () => void;
  onProfilePress: () => void;
}
