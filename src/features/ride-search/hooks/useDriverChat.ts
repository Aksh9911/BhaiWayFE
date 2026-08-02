import { useCallback, useMemo, useRef, useState, type RefObject } from 'react';
import { Alert, Linking, type FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
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

export const useDriverChat = (params: UseDriverChatParams): UseDriverChatResult => {
  const router = useRouter();
  const listRef = useRef<FlatList<ChatMessage> | null>(null);
  const mock = useMemo(
    () =>
      getDriverChatMock({
        driverName: params.driverName,
        carModel: params.carModel,
      }),
    [params.carModel, params.driverName],
  );

  const [messages, setMessages] = useState<ChatMessage[]>(mock.messages);
  const [draft, setDraft] = useState('');

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

      const id = `m-${Date.now()}`;
      const next: ChatMessage = {
        id,
        sender: 'user',
        text: content,
        timeLabel: formatChatTime(),
        status: 'sent',
      };

      setMessages((prev) => [...prev, next]);
      setDraft('');
      scrollToEnd();

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((message) =>
            message.id === id ? { ...message, status: 'read' } : message,
          ),
        );
      }, 1500);
    },
    [draft, scrollToEnd],
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
      Alert.alert('Call', 'Unable to start a call right now.');
    });
  }, []);

  const openMore = useCallback(() => {
    Alert.alert(DRIVER_CHAT_SCREEN.moreTitle, DRIVER_CHAT_SCREEN.moreMessage);
  }, []);

  const attachFile = useCallback(() => {
    Alert.alert(DRIVER_CHAT_SCREEN.attachTitle, DRIVER_CHAT_SCREEN.attachMessage);
  }, []);

  return {
    profile: mock.profile,
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
