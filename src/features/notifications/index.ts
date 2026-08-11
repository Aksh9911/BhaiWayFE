export { NotificationsScreen } from '@/screens/notifications';
export { useNotifications } from './hooks';
export type { UseNotificationsResult } from './hooks';
export { NotificationItem } from './components';
export type { NotificationItemProps } from './components';
export type {
  AppNotification,
  NotificationCategory,
  NotificationPermissionStatus,
} from './types';
export {
  NOTIFICATIONS_SCREEN,
  NOTIFICATION_CATEGORY_ICON,
  NOTIFICATIONS_MOCK,
} from './constants';
export {
  getNotificationPermissionStatus,
  requestNotificationPermission,
} from './services';
