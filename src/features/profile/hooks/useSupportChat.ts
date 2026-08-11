import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { type FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  SUPPORT_CHAT_THREAD_KEY,
  chatMessagesSheetStore,
  chatSheetSync,
  type ChatMessagesSheetRow,
} from '@/DemoData';
import { triggerLightHaptic, showAppAlert } from '@/shared/utils';
import {
  DEFAULT_SUPPORT_CHAT_MESSAGES,
  SUPPORT_CHAT_SCREEN,
  formatSupportChatTime,
} from '../constants';
import type { SupportChatMessage } from '../types';

export interface UseSupportChatResult {
  messages: SupportChatMessage[];
  draft: string;
  isTyping: boolean;
  listRef: RefObject<FlatList<SupportChatMessage> | null>;
  setDraft: (value: string) => void;
  sendMessage: () => void;
  goBack: () => void;
  attachFile: () => void;
}

const mapRow = (row: ChatMessagesSheetRow): SupportChatMessage => ({
  id: String(row.messageId),
  sender: row.sender === 'support' ? 'support' : 'user',
  text: row.text,
  timeLabel: row.timeLabel,
  status: row.status === 'sent' || row.status === 'read' ? row.status : undefined,
});

const getSnapshot = (): string =>
  chatMessagesSheetStore
    .getForCurrentUserThread(SUPPORT_CHAT_THREAD_KEY)
    .map((row) => `${row.messageId}:${row.text}:${row.status}`)
    .join('|');

const subscribe = (onStoreChange: () => void): (() => void) =>
  chatMessagesSheetStore.subscribe(() => onStoreChange());

export const useSupportChat = (): UseSupportChatResult => {
  const router = useRouter();
  const listRef = useRef<FlatList<SupportChatMessage> | null>(null);
  const sheetSnapshot = useSyncExternalStore(subscribe, getSnapshot);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          await chatSheetSync.pullIntoLocal();
          await chatSheetSync.ensureSupportThread();
          if (!active) {
            return;
          }
          if (
            chatMessagesSheetStore.getForCurrentUserThread(SUPPORT_CHAT_THREAD_KEY).length === 0
          ) {
            for (const message of DEFAULT_SUPPORT_CHAT_MESSAGES) {
              await chatSheetSync.upsertMessageAndSync({
                threadKey: SUPPORT_CHAT_THREAD_KEY,
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
    }, []),
  );

  useEffect(() => {
    const hideTyping = setTimeout(() => setIsTyping(false), 2800);
    const scroll = setTimeout(scrollToEnd, 100);
    return () => {
      clearTimeout(hideTyping);
      clearTimeout(scroll);
    };
  }, [scrollToEnd, sheetSnapshot]);

  const messages = useMemo(
    () =>
      chatMessagesSheetStore.getForCurrentUserThread(SUPPORT_CHAT_THREAD_KEY).map(mapRow),
    [sheetSnapshot],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.helpSupport);
  }, [router]);

  const attachFile = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(SUPPORT_CHAT_SCREEN.attachTitle, SUPPORT_CHAT_SCREEN.attachMessage);
  }, []);

  const sendMessage = useCallback(() => {
    const content = draft.trim();
    if (!content) {
      return;
    }

    const timeLabel = formatSupportChatTime();
    setDraft('');
    setIsTyping(true);
    scrollToEnd();

    void (async () => {
      const result = await chatSheetSync.upsertMessageAndSync({
        threadKey: SUPPORT_CHAT_THREAD_KEY,
        sender: 'user',
        text: content,
        timeLabel,
        status: 'sent',
      });
      scrollToEnd();

      setTimeout(() => {
        void chatSheetSync.upsertMessageAndSync({
          messageId: result.id,
          threadKey: SUPPORT_CHAT_THREAD_KEY,
          sender: 'user',
          text: content,
          timeLabel,
          status: 'read',
        });
      }, 900);

      setTimeout(() => {
        void (async () => {
          await chatSheetSync.upsertMessageAndSync({
            threadKey: SUPPORT_CHAT_THREAD_KEY,
            sender: 'support',
            text: 'Thanks for the details. I am reviewing this now and will update you shortly.',
            timeLabel: formatSupportChatTime(),
          });
          setIsTyping(false);
          scrollToEnd();
        })();
      }, 2200);
    })();
  }, [draft, scrollToEnd]);

  return {
    messages,
    draft,
    isTyping,
    listRef,
    setDraft,
    sendMessage,
    goBack,
    attachFile,
  };
};
