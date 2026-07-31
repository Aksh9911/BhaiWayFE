import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic } from '@/shared/utils';
import {
  DEFAULT_WALLET_SUMMARY,
  WALLET_FILTERS,
  WALLET_SCREEN,
  WALLET_TRANSACTIONS,
} from '../constants';
import type {
  WalletSummary,
  WalletTransaction,
  WalletTransactionFilter,
} from '../types';

export interface UseWalletResult {
  summary: WalletSummary;
  filters: typeof WALLET_FILTERS;
  activeFilter: WalletTransactionFilter;
  transactions: readonly WalletTransaction[];
  goBack: () => void;
  openNotifications: () => void;
  setFilter: (filter: WalletTransactionFilter) => void;
  withdraw: () => void;
  addMoney: () => void;
  viewAll: () => void;
  openPromo: () => void;
  openTransaction: (transaction: WalletTransaction) => void;
}

export const useWallet = (): UseWalletResult => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<WalletTransactionFilter>('all');

  const transactions = useMemo(() => {
    if (activeFilter === 'all') {
      return WALLET_TRANSACTIONS;
    }
    return WALLET_TRANSACTIONS.filter((tx) => tx.type === activeFilter);
  }, [activeFilter]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.profile);
  }, [router]);

  const openNotifications = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.notifications);
  }, [router]);

  const setFilter = useCallback((filter: WalletTransactionFilter) => {
    triggerLightHaptic();
    setActiveFilter(filter);
  }, []);

  const withdraw = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.withdraw);
  }, [router]);

  const addMoney = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(WALLET_SCREEN.comingSoonTitle, WALLET_SCREEN.comingSoonMessage);
  }, []);

  const viewAll = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(WALLET_SCREEN.viewAllTitle, WALLET_SCREEN.viewAllMessage);
  }, []);

  const openPromo = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(WALLET_SCREEN.promoEyebrow, WALLET_SCREEN.promoTitle);
  }, []);

  const openTransaction = useCallback((transaction: WalletTransaction) => {
    triggerLightHaptic();
    Alert.alert(transaction.title, `${transaction.amountLabel}\n${transaction.dateLabel}`);
  }, []);

  return {
    summary: DEFAULT_WALLET_SUMMARY,
    filters: WALLET_FILTERS,
    activeFilter,
    transactions,
    goBack,
    openNotifications,
    setFilter,
    withdraw,
    addMoney,
    viewAll,
    openPromo,
    openTransaction,
  };
};
