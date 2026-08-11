/**
 * Notifications sheet row types.
 * Headers / IDs live in `src/DemoData/files/demoData.common.ts`.
 */

export type { NotificationsSheetHeader } from './files/demoData.common';

export {
  NOTIFICATIONS_SHEET_HEADERS,
  NOTIFICATIONS_SHEET_FIELD_KEYS,
  NOTIFICATIONS_SHEET_ID_START,
  notificationsSheetHeaderCsv,
} from './files/demoData.common';

export type NotificationSheetCategory =
  | 'ride'
  | 'booking'
  | 'payment'
  | 'verification'
  | 'promo'
  | 'system';

export type NotificationSheetSection = 'today' | 'earlier';

export interface NotificationsSheetRow {
  row_id: number;
  notificationId: number;
  userId: number;
  mobile: string;
  title: string;
  body: string;
  timeLabel: string;
  category: NotificationSheetCategory;
  section: NotificationSheetSection;
  unread: boolean;
  createdAt: string;
  updated_at: string;
}

export type NotificationsSheetPatch = Partial<
  Omit<NotificationsSheetRow, 'updated_at'>
> & {
  mobile?: string;
};
