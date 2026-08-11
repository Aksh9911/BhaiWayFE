import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  chatSheetSync,
  chatThreadsSheetStore,
  type ChatThreadsSheetRow,
} from '@/DemoData';
import { appModeStore, type AppMode } from '@/store';
import { getInboxChatPath, INBOX_MOCK_THREADS, INBOX_SCREEN } from '../constants';
import type { InboxThread } from '../types';

export interface UseInboxResult {
  mode: AppMode;
  subtitle: string;
  emptyMessage: string;
  threads: InboxThread[];
  openThread: (thread: InboxThread) => void;
  openNotifications: () => void;
  openProfile: () => void;
}

const mapRow = (row: ChatThreadsSheetRow): InboxThread => ({
  id: row.threadKey || String(row.threadId),
  role: row.role,
  rideType: row.rideType === 'support' ? 'outstation' : row.rideType,
  peerName: row.peerName,
  peerSubtitle: row.peerSubtitle,
  routeLabel: row.routeLabel,
  lastMessage: row.lastMessage,
  timeLabel: row.timeLabel,
  unreadCount: row.unreadCount,
  isOnline: row.isOnline,
  avatarUri: row.avatarUri || undefined,
});

const getSnapshot = (): string =>
  chatThreadsSheetStore
    .getForCurrentUser()
    .map(
      (row) =>
        `${row.threadId}:${row.threadKey}:${row.role}:${row.lastMessage}:${row.unreadCount}:${row.timeLabel}`,
    )
    .join('|');

const subscribe = (onStoreChange: () => void): (() => void) =>
  chatThreadsSheetStore.subscribe(() => onStoreChange());

const seedMocksIfEmpty = async (): Promise<void> => {
  const existing = chatThreadsSheetStore
    .getForCurrentUser()
    .filter((row) => row.threadKey !== 'support');
  if (existing.length > 0) {
    return;
  }
  for (const thread of INBOX_MOCK_THREADS) {
    await chatSheetSync.upsertThreadAndSync({
      threadKey: thread.id,
      role: thread.role,
      rideType: thread.rideType,
      peerName: thread.peerName,
      peerSubtitle: thread.peerSubtitle,
      routeLabel: thread.routeLabel,
      lastMessage: thread.lastMessage,
      timeLabel: thread.timeLabel,
      unreadCount: thread.unreadCount,
      isOnline: thread.isOnline,
      avatarUri: thread.avatarUri,
    });
  }
};

export const useInbox = (): UseInboxResult => {
  const router = useRouter();
  const [mode, setMode] = useState<AppMode>(() => appModeStore.get());
  const sheetSnapshot = useSyncExternalStore(subscribe, getSnapshot);

  useEffect(() => appModeStore.subscribe(setMode), []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          await chatSheetSync.pullIntoLocal();
          if (active) {
            await seedMocksIfEmpty();
          }
        } catch {
          // keep local
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const threads = useMemo(() => {
    return chatThreadsSheetStore
      .getForCurrentUser()
      .filter((row) => row.threadKey !== 'support')
      .filter((row) => (mode === 'driving' ? row.role === 'driver' : row.role === 'rider'))
      .map(mapRow);
  }, [mode, sheetSnapshot]);

  const openThread = useCallback(
    (thread: InboxThread) => {
      router.push(getInboxChatPath(thread));
    },
    [router],
  );

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const openProfile = useCallback(() => {
    router.push(ROUTES.profile);
  }, [router]);

  return {
    mode,
    subtitle:
      mode === 'driving' ? INBOX_SCREEN.subtitleDriving : INBOX_SCREEN.subtitleRiding,
    emptyMessage:
      mode === 'driving' ? INBOX_SCREEN.emptyDriving : INBOX_SCREEN.emptyRiding,
    threads,
    openThread,
    openNotifications,
    openProfile,
  };
};
