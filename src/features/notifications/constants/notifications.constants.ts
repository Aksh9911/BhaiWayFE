import type { AppNotification, NotificationCategory } from '../types';
import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

export const NOTIFICATIONS_SCREEN = {
  title: 'Notifications',
  markAllRead: 'Mark all as read',
  emptyTitle: 'You’re all caught up',
  emptyMessage: 'Ride updates, bookings, and account alerts will show up here.',
  permissionTitle: 'Enable notifications',
  permissionBody: 'Get ride alerts, booking updates, and payment reminders.',
  permissionCta: 'Allow',
  permissionDeniedBody: 'Notifications are off. Enable them in system settings to stay updated.',
  sectionToday: 'Today',
  sectionEarlier: 'Earlier',
} as const;

type IconName = ComponentProps<typeof Ionicons>['name'];

export const NOTIFICATION_CATEGORY_ICON: Record<NotificationCategory, IconName> = {
  ride: 'car-outline',
  booking: 'calendar-outline',
  payment: 'wallet-outline',
  verification: 'shield-checkmark-outline',
  promo: 'gift-outline',
  system: 'notifications-outline',
};

export const NOTIFICATIONS_MOCK: readonly AppNotification[] = [
  {
    id: 'n1',
    title: 'Driver is arriving',
    body: 'Arjun is 5 mins away for your Bengaluru → Mysuru ride.',
    timeLabel: '2m ago',
    category: 'ride',
    section: 'today',
    unread: true,
  },
  {
    id: 'n2',
    title: 'Booking confirmed',
    body: 'Your office commute seat for tomorrow 9:00 AM is confirmed.',
    timeLabel: '1h ago',
    category: 'booking',
    section: 'today',
    unread: true,
  },
  {
    id: 'n3',
    title: 'Payment successful',
    body: '240 paid for your outstation carpool booking.',
    timeLabel: '3h ago',
    category: 'payment',
    section: 'today',
    unread: false,
  },
  {
    id: 'n4',
    title: 'Aadhaar verified',
    body: 'Your identity verification is complete. You’re a trusted member.',
    timeLabel: 'Yesterday',
    category: 'verification',
    section: 'earlier',
    unread: false,
  },
  {
    id: 'n5',
    title: 'Cashback unlocked',
    body: 'You earned 50 cashback on your last ride. Added to your wallet.',
    timeLabel: 'Mon',
    category: 'promo',
    section: 'earlier',
    unread: true,
  },
  {
    id: 'n6',
    title: 'Ride reminder',
    body: 'Your published ride to Electronic City starts in 2 hours.',
    timeLabel: 'Sun',
    category: 'system',
    section: 'earlier',
    unread: false,
  },
] as const;
