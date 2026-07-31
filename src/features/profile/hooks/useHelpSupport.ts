import { useCallback, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';

import { APP_CONFIG, ROUTES } from '@/config';
import { triggerLightHaptic } from '@/shared/utils';
import {
  HELP_SUPPORT_SCREEN,
  SUPPORT_CATEGORIES,
  SUPPORT_TICKETS,
} from '../constants';
import type { SupportCategory, SupportCategoryId, SupportTicket } from '../types';

export interface UseHelpSupportResult {
  query: string;
  setQuery: (value: string) => void;
  categories: readonly SupportCategory[];
  tickets: readonly SupportTicket[];
  goBack: () => void;
  openCategory: (id: SupportCategoryId) => void;
  openTicket: (id: string) => void;
  viewAllTickets: () => void;
  chatWithSupport: () => void;
  emailSupport: () => void;
}

export const useHelpSupport = (): UseHelpSupportResult => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const categories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return SUPPORT_CATEGORIES;
    }
    return SUPPORT_CATEGORIES.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.subtitle.toLowerCase().includes(normalized),
    );
  }, [query]);

  const tickets = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return SUPPORT_TICKETS;
    }
    return SUPPORT_TICKETS.filter(
      (item) =>
        item.title.toLowerCase().includes(normalized) ||
        item.submittedLabel.toLowerCase().includes(normalized),
    );
  }, [query]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.profile);
  }, [router]);

  const openCategory = useCallback((_id: SupportCategoryId) => {
    triggerLightHaptic();
    Alert.alert(HELP_SUPPORT_SCREEN.comingSoonTitle, HELP_SUPPORT_SCREEN.comingSoonMessage);
  }, []);

  const openTicket = useCallback((_id: string) => {
    triggerLightHaptic();
    Alert.alert(HELP_SUPPORT_SCREEN.comingSoonTitle, HELP_SUPPORT_SCREEN.comingSoonMessage);
  }, []);

  const viewAllTickets = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(HELP_SUPPORT_SCREEN.comingSoonTitle, HELP_SUPPORT_SCREEN.comingSoonMessage);
  }, []);

  const chatWithSupport = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.supportChat);
  }, [router]);

  const emailSupport = useCallback(() => {
    triggerLightHaptic();
    const url = `mailto:${APP_CONFIG.supportEmail}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(HELP_SUPPORT_SCREEN.emailErrorTitle, HELP_SUPPORT_SCREEN.emailErrorMessage);
    });
  }, []);

  return {
    query,
    setQuery,
    categories,
    tickets,
    goBack,
    openCategory,
    openTicket,
    viewAllTickets,
    chatWithSupport,
    emailSupport,
  };
};
