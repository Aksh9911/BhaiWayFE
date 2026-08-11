import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  formatBhaiWayWalletLabel,
  formatWalletTransactionAmountLabel,
  getBhaiWayWalletBalance,
  subscribeBhaiWayWallet,
  walletTransactionsSheetStore,
  walletTransactionsSheetSync,
  type WalletTransactionsSheetRow,
} from '@/DemoData';
import { triggerLightHaptic, showAppAlert } from '@/shared/utils';
import {
  DEFAULT_WALLET_SUMMARY,
  WALLET_FILTERS,
  WALLET_ID,
  WALLET_RECENT_TRANSACTION_LIMIT,
  WALLET_SCREEN,
} from '../constants';
import type {
  WalletSummary,
  WalletTransaction,
  WalletTransactionFilter,
} from '../types';

export interface UseWalletResult {
  summary: WalletSummary;
  balance: number;
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

const mapRow = (row: WalletTransactionsSheetRow): WalletTransaction => ({
  id: String(row.transactionId),
  title: row.title,
  dateLabel: row.dateLabel,
  amountLabel: formatWalletTransactionAmountLabel(row.amount, row.type),
  type: row.type,
  icon: row.icon,
});

const getTxSnapshot = (): string =>
  walletTransactionsSheetStore
    .getForCurrentUser()
    .map((row) => `${row.transactionId}:${row.amount}:${row.type}:${row.title}`)
    .join('|');

const subscribeTx = (onStoreChange: () => void): (() => void) =>
  walletTransactionsSheetStore.subscribe(() => onStoreChange());

export const useWallet = (): UseWalletResult => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<WalletTransactionFilter>('all');
  const walletBalance = useSyncExternalStore(subscribeBhaiWayWallet, getBhaiWayWalletBalance);
  const txSnapshot = useSyncExternalStore(subscribeTx, getTxSnapshot);

  useFocusEffect(
    useCallback(() => {
      void walletTransactionsSheetSync.pullIntoLocal().catch(() => undefined);
    }, []),
  );

  const summary = useMemo(
    (): WalletSummary => ({
      ...DEFAULT_WALLET_SUMMARY,
      balanceLabel: formatBhaiWayWalletLabel(walletBalance),
      walletId: WALLET_ID,
    }),
    [walletBalance],
  );

  const transactions = useMemo(() => {
    const all = walletTransactionsSheetStore.getForCurrentUser().map(mapRow);
    const filtered =
      activeFilter === 'all' ? all : all.filter((tx) => tx.type === activeFilter);
    return filtered.slice(0, WALLET_RECENT_TRANSACTION_LIMIT);
  }, [activeFilter, txSnapshot]);

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
    router.push(ROUTES.addMoney);
  }, [router]);

  const viewAll = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.walletTransactions);
  }, [router]);

  const openPromo = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(WALLET_SCREEN.promoEyebrow, WALLET_SCREEN.promoTitle);
  }, []);

  const openTransaction = useCallback((transaction: WalletTransaction) => {
    triggerLightHaptic();
    showAppAlert(transaction.title, `${transaction.amountLabel}\n${transaction.dateLabel}`);
  }, []);

  return {
    summary,
    balance: walletBalance,
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
