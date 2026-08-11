export type NotificationCategory =
  | 'ride'
  | 'booking'
  | 'payment'
  | 'verification'
  | 'promo'
  | 'system';

export type NotificationPermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timeLabel: string;
  category: NotificationCategory;
  section: 'today' | 'earlier';
  unread: boolean;
}
