import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { Alert, type FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic } from '@/shared/utils';
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

export const useSupportChat = (): UseSupportChatResult => {
  const router = useRouter();
  const listRef = useRef<FlatList<SupportChatMessage> | null>(null);
  const [messages, setMessages] = useState<SupportChatMessage[]>([
    ...DEFAULT_SUPPORT_CHAT_MESSAGES,
  ]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  useEffect(() => {
    const hideTyping = setTimeout(() => setIsTyping(false), 2800);
    const scroll = setTimeout(scrollToEnd, 100);
    return () => {
      clearTimeout(hideTyping);
      clearTimeout(scroll);
    };
  }, [scrollToEnd]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.helpSupport);
  }, [router]);

  const attachFile = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(SUPPORT_CHAT_SCREEN.attachTitle, SUPPORT_CHAT_SCREEN.attachMessage);
  }, []);

  const sendMessage = useCallback(() => {
    const content = draft.trim();
    if (!content) {
      return;
    }

    const id = `u-${Date.now()}`;
    const next: SupportChatMessage = {
      id,
      sender: 'user',
      text: content,
      timeLabel: formatSupportChatTime(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, next]);
    setDraft('');
    setIsTyping(true);
    scrollToEnd();

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((message) => (message.id === id ? { ...message, status: 'read' } : message)),
      );
    }, 900);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `s-${Date.now()}`,
          sender: 'support',
          text: 'Thanks for the details. I am reviewing this now and will update you shortly.',
          timeLabel: formatSupportChatTime(),
        },
      ]);
      setIsTyping(false);
      scrollToEnd();
    }, 2200);
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
