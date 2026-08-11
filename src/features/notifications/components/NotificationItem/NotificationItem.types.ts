import type { AppNotification } from '../../types';

export interface NotificationItemProps {
  notification: AppNotification;
  onPress: (notification: AppNotification) => void;
}
