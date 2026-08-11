import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  notificationsSheetStore,
  notificationsSheetSync,
  type NotificationsSheetRow,
} from '@/DemoData';
import { triggerLightHaptic } from '@/shared/utils';
import { NOTIFICATIONS_MOCK } from '../constants';
import {
  getNotificationPermissionStatus,
  requestNotificationPermission,
} from '../services';
import type { AppNotification, NotificationPermissionStatus } from '../types';

export interface UseNotificationsResult {
  items: AppNotification[];
  todayItems: AppNotification[];
  earlierItems: AppNotification[];
  unreadCount: number;
  permissionStatus: NotificationPermissionStatus;
  requestPermission: () => Promise<void>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  goBack: () => void;
}

const mapRow = (row: NotificationsSheetRow): AppNotification => ({
  id: String(row.notificationId),
  title: row.title,
  body: row.body,
  timeLabel: row.timeLabel,
  category: row.category,
  section: row.section,
  unread: row.unread,
});

const getSnapshot = (): string =>
  notificationsSheetStore
    .getForCurrentUser()
    .map(
      (row) =>
        `${row.notificationId}:${row.unread}:${row.title}:${row.section}:${row.timeLabel}`,
    )
    .join('|');

const subscribe = (onStoreChange: () => void): (() => void) =>
  notificationsSheetStore.subscribe(() => onStoreChange());

const seedMocksIfEmpty = async (): Promise<void> => {
  if (notificationsSheetStore.getForCurrentUser().length > 0) {
    return;
  }
  for (const item of NOTIFICATIONS_MOCK) {
    await notificationsSheetSync.upsertAndSync({
      title: item.title,
      body: item.body,
      timeLabel: item.timeLabel,
      category: item.category,
      section: item.section,
      unread: item.unread,
    });
  }
};

export const useNotifications = (): UseNotificationsResult => {
  const router = useRouter();
  const sheetSnapshot = useSyncExternalStore(subscribe, getSnapshot);
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermissionStatus>('undetermined');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          await notificationsSheetSync.pullIntoLocal();
          if (active) {
            await seedMocksIfEmpty();
          }
        } catch {
          // keep local rows
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const status = await getNotificationPermissionStatus();
        if (active) {
          setPermissionStatus(status);
        }
      } catch {
        if (active) {
          setPermissionStatus('undetermined');
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const items = useMemo(
    () => notificationsSheetStore.getForCurrentUser().map(mapRow),
    [sheetSnapshot],
  );

  const todayItems = useMemo(
    () => items.filter((item) => item.section === 'today'),
    [items],
  );
  const earlierItems = useMemo(
    () => items.filter((item) => item.section === 'earlier'),
    [items],
  );
  const unreadCount = useMemo(
    () => items.reduce((count, item) => count + (item.unread ? 1 : 0), 0),
    [items],
  );

  const requestPermission = useCallback(async () => {
    triggerLightHaptic();
    try {
      const status = await requestNotificationPermission();
      setPermissionStatus(status);
    } catch {
      setPermissionStatus('denied');
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    triggerLightHaptic();
    const notificationId = Number(id);
    if (!Number.isFinite(notificationId)) {
      return;
    }
    void notificationsSheetSync.markReadAndSync(notificationId);
  }, []);

  const markAllAsRead = useCallback(() => {
    triggerLightHaptic();
    void notificationsSheetSync.markAllReadAndSync();
  }, []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.home);
  }, [router]);

  return {
    items,
    todayItems,
    earlierItems,
    unreadCount,
    permissionStatus,
    requestPermission,
    markAsRead,
    markAllAsRead,
    goBack,
  };
};
