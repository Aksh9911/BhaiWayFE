import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { env, ROUTES } from '@/config';
import { triggerLightHaptic } from '@/shared/utils';
import { showAppAlert } from '@/store';
import {
  clearDemoData,
  demoBookingsStore,
  demoUsersStore,
  demoVehiclesStore,
  hydrateDemoData,
  pushAllLocalRowsToSheet,
  shareUserDetailsSheetCsv,
  userDetailsSheetStore,
  userDetailsSheetSync,
  type DemoBooking,
  type DemoUser,
  type DemoVehicle,
  type UserDetailsSheetRow,
} from '@/DemoData';

export type DemoDataTabId = 'sheet' | 'users' | 'vehicles' | 'bookings';

export interface UseDemoDataViewerResult {
  tab: DemoDataTabId;
  setTab: (tab: DemoDataTabId) => void;
  sheetRows: UserDetailsSheetRow[];
  users: DemoUser[];
  vehicles: DemoVehicle[];
  bookings: DemoBooking[];
  counts: { sheet: number; users: number; vehicles: number; bookings: number };
  refreshing: boolean;
  refresh: () => Promise<void>;
  clearAll: () => void;
  copySheetCsv: () => void;
  pullFromSheet: () => Promise<void>;
  pushToSheet: () => Promise<void>;
  goBack: () => void;
}

export const useDemoDataViewer = (): UseDemoDataViewerResult => {
  const router = useRouter();
  const [tab, setTab] = useState<DemoDataTabId>('sheet');
  const [sheetRows, setSheetRows] = useState<UserDetailsSheetRow[]>([]);
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [vehicles, setVehicles] = useState<DemoVehicle[]>([]);
  const [bookings, setBookings] = useState<DemoBooking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    void hydrateDemoData();
    const unsubSheet = userDetailsSheetStore.subscribe(setSheetRows);
    const unsubUsers = demoUsersStore.subscribe(setUsers);
    const unsubVehicles = demoVehiclesStore.subscribe(setVehicles);
    const unsubBookings = demoBookingsStore.subscribe(setBookings);
    return () => {
      unsubSheet();
      unsubUsers();
      unsubVehicles();
      unsubBookings();
    };
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await hydrateDemoData();
      setSheetRows(userDetailsSheetStore.getAll());
      setUsers(demoUsersStore.getAll());
      setVehicles(demoVehiclesStore.getAll());
      setBookings(demoBookingsStore.getAll());
    } finally {
      setRefreshing(false);
    }
  }, []);

  const clearAll = useCallback(() => {
    triggerLightHaptic();
    showAppAlert('Clear local data?', 'This deletes all locally saved DemoData on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          void clearDemoData();
        },
      },
    ]);
  }, []);

  const copySheetCsv = useCallback(() => {
    triggerLightHaptic();
    void (async () => {
      try {
        if (sheetRows.length === 0) {
          showAppAlert(
            'No rows yet',
            'Complete profile in the app first. Then use Share CSV and paste into Google Sheets row 2.',
          );
          return;
        }
        await shareUserDetailsSheetCsv();
        showAppAlert(
          'CSV shared',
          'Paste into Google Sheets starting at A1 (includes header). Or set EXPO_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL for auto Push.',
        );
      } catch (error) {
        console.log('[UserDetails Sheet CSV]\n' + userDetailsSheetStore.toCsv());
        showAppAlert(
          'CSV logged',
          error instanceof Error
            ? `${error.message}. CSV also printed in Metro console.`
            : 'CSV printed in Metro console — copy/paste into Google Sheets.',
        );
      }
    })();
  }, [sheetRows.length]);

  const pullFromSheet = useCallback(async () => {
    triggerLightHaptic();
    setRefreshing(true);
    try {
      const rows = await userDetailsSheetSync.pullIntoLocal();
      setSheetRows(userDetailsSheetStore.getAll());
      showAppAlert(
        'Sheet synced',
        rows.length === 0
          ? 'Google Sheet has headers only (no data rows). Create a profile in the app, then Share CSV / Push.'
          : `Pulled ${rows.length} row(s). Wallet amounts use BhaiWayWallet from the sheet.`,
      );
    } catch (error) {
      showAppAlert(
        'Sheet sync failed',
        error instanceof Error ? error.message : 'Unable to read Google Sheet.',
      );
    } finally {
      setRefreshing(false);
    }
  }, []);

  const pushToSheet = useCallback(async () => {
    triggerLightHaptic();
    if (sheetRows.length === 0) {
      showAppAlert('Nothing to push', 'No local sheet rows yet. Complete a profile first.');
      return;
    }

    if (!env.googleSheetWebhookUrl) {
      showAppAlert(
        'Webhook not set',
        'Google Sheet writes need Apps Script. For now tap CSV to share/paste rows into the sheet.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Share CSV',
            onPress: () => {
              void shareUserDetailsSheetCsv();
            },
          },
        ],
      );
      return;
    }

    setRefreshing(true);
    try {
      const result = await pushAllLocalRowsToSheet();
      showAppAlert(
        'Push complete',
        `Synced ${result.synced}/${result.attempted} row(s) to Google Sheet.`,
      );
    } catch (error) {
      showAppAlert(
        'Push failed',
        error instanceof Error ? error.message : 'Unable to push rows to Google Sheet.',
      );
    } finally {
      setRefreshing(false);
    }
  }, [sheetRows.length]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.profile);
  }, [router]);

  const counts = useMemo(
    () => ({
      sheet: sheetRows.length,
      users: users.length,
      vehicles: vehicles.length,
      bookings: bookings.length,
    }),
    [bookings.length, sheetRows.length, users.length, vehicles.length],
  );

  return {
    tab,
    setTab,
    sheetRows,
    users,
    vehicles,
    bookings,
    counts,
    refreshing,
    refresh,
    clearAll,
    copySheetCsv,
    pullFromSheet,
    pushToSheet,
    goBack,
  };
};
