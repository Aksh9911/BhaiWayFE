import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

import type { NotificationPermissionStatus } from '../types';

/**
 * `expo-notifications` throws on import in Expo Go (Android, SDK 53+).
 * Keep the native module behind a lazy require and only use it in dev/prod builds.
 */
const isExpoGo =
  Constants.appOwnership === 'expo' ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

type NotificationsModule = typeof import('expo-notifications');

let notificationsModule: NotificationsModule | null | undefined;

const loadNotificationsModule = (): NotificationsModule | null => {
  if (isExpoGo) {
    return null;
  }

  if (notificationsModule !== undefined) {
    return notificationsModule;
  }

  try {
    // Lazy require avoids the Expo Go Android crash on static import.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    notificationsModule = require('expo-notifications') as NotificationsModule;
  } catch {
    notificationsModule = null;
  }

  return notificationsModule;
};

/** In-memory permission state used when native push APIs are unavailable (Expo Go). */
let expoGoPermissionStatus: NotificationPermissionStatus = 'undetermined';

const mapStatus = (status: string): NotificationPermissionStatus => {
  if (status === 'granted') {
    return 'granted';
  }
  if (status === 'denied') {
    return 'denied';
  }
  return 'undetermined';
};

export const getNotificationPermissionStatus =
  async (): Promise<NotificationPermissionStatus> => {
    const Notifications = loadNotificationsModule();
    if (!Notifications) {
      return expoGoPermissionStatus;
    }

    try {
      const settings = await Notifications.getPermissionsAsync();
      return mapStatus(settings.status);
    } catch {
      return 'undetermined';
    }
  };

export const requestNotificationPermission =
  async (): Promise<NotificationPermissionStatus> => {
    const Notifications = loadNotificationsModule();
    if (!Notifications) {
      // Expo Go cannot request real push permission on Android SDK 53+.
      // Simulate grant so the listing UI remains usable during development.
      expoGoPermissionStatus = 'granted';
      return expoGoPermissionStatus;
    }

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.DEFAULT,
        });
      }

      const settings = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

      return mapStatus(settings.status);
    } catch {
      return 'denied';
    }
  };
