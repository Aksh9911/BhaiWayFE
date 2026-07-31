import type { HomeLocation } from '../../types';

export interface HomeHeaderProps {
  brandName: string;
  location: HomeLocation;
  avatarUri?: string | null;
  hasUnreadNotifications?: boolean;
  onProfilePress: () => void;
  onNotificationsPress: () => void;
}
