import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  formatWalletTransactionAmountLabel,
  walletTransactionsSheetStore,
  walletTransactionsSheetSync,
  type WalletTransactionsSheetRow,
} from '@/DemoData';
import { triggerLightHaptic, showAppAlert } from '@/shared/utils';
import { WALLET_TRANSACTIONS_SCREEN } from '../constants/wallet-transactions.constants';
import type { WalletTransaction, WalletTransactionFilter } from '../types';

export interface UseWalletTransactionsResult {
  title: string;
  subtitle: string;
  filters: typeof WALLET_TRANSACTIONS_SCREEN.filters;
  activeFilter: WalletTransactionFilter;
  transactions: readonly WalletTransaction[];
  setFilter: (filter: WalletTransactionFilter) => void;
  openTransaction: (transaction: WalletTransaction) => void;
  goBack: () => void;
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

export const useWalletTransactions = (): UseWalletTransactionsResult => {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<WalletTransactionFilter>('all');
  const txSnapshot = useSyncExternalStore(subscribeTx, getTxSnapshot);

  useFocusEffect(
    useCallback(() => {
      void walletTransactionsSheetSync.pullIntoLocal().catch(() => undefined);
    }, []),
  );

  const transactions = useMemo(() => {
    const all = walletTransactionsSheetStore.getForCurrentUser().map(mapRow);
    if (activeFilter === 'all') {
      return all;
    }
    return all.filter((tx) => tx.type === activeFilter);
  }, [activeFilter, txSnapshot]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.wallet);
  }, [router]);

  const setFilter = useCallback((filter: WalletTransactionFilter) => {
    triggerLightHaptic();
    setActiveFilter(filter);
  }, []);

  const openTransaction = useCallback((transaction: WalletTransaction) => {
    triggerLightHaptic();
    showAppAlert(
      transaction.title,
      `${transaction.amountLabel}\n${transaction.dateLabel}\n${transaction.type}`,
    );
  }, []);

  return {
    title: WALLET_TRANSACTIONS_SCREEN.title,
    subtitle: WALLET_TRANSACTIONS_SCREEN.subtitle,
    filters: WALLET_TRANSACTIONS_SCREEN.filters,
    activeFilter,
    transactions,
    setFilter,
    openTransaction,
    goBack,
  };
};
