import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
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

export const useInbox = (): UseInboxResult => {
  const router = useRouter();
  const [mode, setMode] = useState<AppMode>(() => appModeStore.get());

  useEffect(() => appModeStore.subscribe(setMode), []);

  const threads = useMemo(
    () =>
      INBOX_MOCK_THREADS.filter((thread) =>
        mode === 'driving' ? thread.role === 'driver' : thread.role === 'rider',
      ),
    [mode],
  );

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
    threads: [...threads],
    openThread,
    openNotifications,
    openProfile,
  };
};
