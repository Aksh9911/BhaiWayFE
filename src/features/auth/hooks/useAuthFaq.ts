import { useCallback, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  getAuthFaqItems,
  getAuthFaqSubtitle,
  type AuthFaqItem,
  type AuthFaqTopic,
} from '../constants/auth-faq.constants';

const resolveTopic = (raw: string | string[] | undefined): AuthFaqTopic => {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === 'profile' ? 'profile' : 'auth';
};

export interface UseAuthFaqResult {
  topic: AuthFaqTopic;
  subtitle: string;
  items: readonly AuthFaqItem[];
  expandedId: string | null;
  toggleItem: (id: string) => void;
  goBack: () => void;
}

export const useAuthFaq = (): UseAuthFaqResult => {
  const router = useRouter();
  const { topic: topicParam } = useLocalSearchParams<{ topic?: string }>();
  const topic = resolveTopic(topicParam);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const items = useMemo(() => getAuthFaqItems(topic), [topic]);
  const subtitle = useMemo(() => getAuthFaqSubtitle(topic), [topic]);

  const toggleItem = useCallback((id: string) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(topic === 'profile' ? ROUTES.completeProfile : ROUTES.phone);
  }, [router, topic]);

  return {
    topic,
    subtitle,
    items,
    expandedId,
    toggleItem,
    goBack,
  };
};
