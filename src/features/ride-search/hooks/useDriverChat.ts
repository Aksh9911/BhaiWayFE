import { useCallback, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { showAppAlert } from '@/store';
import { Linking, type FlatList } from 'react-native';

import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  chatMessagesSheetStore,
  chatSheetSync,
  chatThreadsSheetStore,
  type ChatMessagesSheetRow,
} from '@/DemoData';
import {
  DRIVER_CHAT_QUICK_REPLIES,
  DRIVER_CHAT_SCREEN,
  formatChatTime,
  getDriverChatMock,
} from '../constants';
import type { ChatMessage, DriverChatProfile } from '../types';

export interface UseDriverChatParams {
  driverName?: string;
  carModel?: string;
  threadId?: string;
}

export interface UseDriverChatResult {
  profile: DriverChatProfile;
  messages: ChatMessage[];
  draft: string;
  quickReplies: typeof DRIVER_CHAT_QUICK_REPLIES;
  listRef: RefObject<FlatList<ChatMessage> | null>;
  setDraft: (value: string) => void;
  sendMessage: (text?: string) => void;
  goBack: () => void;
  callDriver: () => void;
  openMore: () => void;
  attachFile: () => void;
}

const mapRow = (row: ChatMessagesSheetRow): ChatMessage => ({
  id: String(row.messageId),
  sender: row.sender === 'driver' ? 'driver' : 'user',
  text: row.text,
  timeLabel: row.timeLabel,
  status: row.status === 'sent' || row.status === 'read' ? row.status : undefined,
});

export const useDriverChat = (params: UseDriverChatParams): UseDriverChatResult => {
  const router = useRouter();
  const listRef = useRef<FlatList<ChatMessage> | null>(null);
  const threadKey =
    params.threadId?.trim() ||
    `thread-${(params.driverName || 'driver').trim().toLowerCase().replace(/\s+/g, '-')}`;

  const mock = useMemo(
    () =>
      getDriverChatMock({
        driverName: params.driverName,
        carModel: params.carModel,
      }),
    [params.carModel, params.driverName],
  );

  const getSnapshot = useCallback(
    () =>
      chatMessagesSheetStore
        .getForCurrentUserThread(threadKey)
        .map((row) => `${row.messageId}:${row.text}:${row.status}`)
        .join('|'),
    [threadKey],
  );

  const subscribe = useCallback(
    (onStoreChange: () => void) => chatMessagesSheetStore.subscribe(() => onStoreChange()),
    [],
  );

  const sheetSnapshot = useSyncExternalStore(subscribe, getSnapshot);
  const [draft, setDraft] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          await chatSheetSync.pullIntoLocal();
          if (!active) {
            return;
          }
          const existingThread = chatThreadsSheetStore.findByThreadKey(threadKey);
          if (!existingThread) {
            await chatSheetSync.upsertThreadAndSync({
              threadKey,
              peerName: mock.profile.name,
              peerSubtitle: mock.profile.vehicleLabel,
              routeLabel: '',
              role: 'rider',
              rideType: 'outstation',
              lastMessage: mock.messages[mock.messages.length - 1]?.text || '',
              timeLabel: mock.messages[mock.messages.length - 1]?.timeLabel || '',
              unreadCount: 0,
              isOnline: mock.profile.isOnline,
            });
          }
          if (chatMessagesSheetStore.getForCurrentUserThread(threadKey).length === 0) {
            for (const message of mock.messages) {
              await chatSheetSync.upsertMessageAndSync({
                threadKey,
                sender: message.sender,
                text: message.text,
                timeLabel: message.timeLabel,
                status: message.status || '',
              });
            }
          }
        } catch {
          // keep local
        }
      })();
      return () => {
        active = false;
      };
    }, [mock.messages, mock.profile, threadKey]),
  );

  const messages = useMemo(
    () => chatMessagesSheetStore.getForCurrentUserThread(threadKey).map(mapRow),
    [sheetSnapshot, threadKey],
  );

  const profile = useMemo((): DriverChatProfile => {
    const thread = chatThreadsSheetStore.findByThreadKey(threadKey);
    return {
      name: thread?.peerName || mock.profile.name,
      vehicleLabel: thread?.peerSubtitle || mock.profile.vehicleLabel,
      isOnline: thread?.isOnline ?? mock.profile.isOnline,
      avatarUri: thread?.avatarUri || mock.profile.avatarUri,
    };
  }, [mock.profile, sheetSnapshot, threadKey]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = useCallback(
    (text?: string) => {
      const content = (text ?? draft).trim();
      if (!content) {
        return;
      }

      const timeLabel = formatChatTime();
      setDraft('');
      scrollToEnd();

      void (async () => {
        const result = await chatSheetSync.upsertMessageAndSync({
          threadKey,
          sender: 'user',
          text: content,
          timeLabel,
          status: 'sent',
        });
        scrollToEnd();
        setTimeout(() => {
          void chatSheetSync.upsertMessageAndSync({
            messageId: result.id,
            threadKey,
            sender: 'user',
            text: content,
            timeLabel,
            status: 'read',
          });
        }, 1500);
      })();
    },
    [draft, scrollToEnd, threadKey],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.inbox);
  }, [router]);

  const callDriver = useCallback(() => {
    Linking.openURL('tel:+919999999999').catch(() => {
      showAppAlert('Call', 'Unable to start a call right now.');
    });
  }, []);

  const openMore = useCallback(() => {
    showAppAlert(DRIVER_CHAT_SCREEN.moreTitle, DRIVER_CHAT_SCREEN.moreMessage);
  }, []);

  const attachFile = useCallback(() => {
    showAppAlert(DRIVER_CHAT_SCREEN.attachTitle, DRIVER_CHAT_SCREEN.attachMessage);
  }, []);

  return {
    profile,
    messages,
    draft,
    quickReplies: DRIVER_CHAT_QUICK_REPLIES,
    listRef,
    setDraft,
    sendMessage,
    goBack,
    callDriver,
    openMore,
    attachFile,
  };
};
