import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { recordWalletTransaction, updateBhaiWayWalletBalance } from '@/DemoData';
import { useSessionUser } from '@/shared/hooks';
import {
  formatBhaiWayCoins,
  triggerLightHaptic,
  triggerSuccessHaptic,
  showAppAlert,
} from '@/shared/utils';
import { DEFAULT_PROFILE_AVATAR } from '../constants/profile.constants';
import {
  ADD_MONEY_PAYMENT_SOURCES,
  ADD_MONEY_QUICK_AMOUNTS,
  ADD_MONEY_SCREEN,
  DEFAULT_ADD_MONEY_AMOUNT,
  DEFAULT_ADD_MONEY_SOURCE_ID,
} from '../constants/add-money.constants';
import { getFundsAddedPath } from '../constants/funds-added.constants';
import type { AddMoneyPaymentSource, AddMoneyQuickAmount } from '../types';

export interface UseAddMoneyResult {
  amount: string;
  selectedSourceId: string;
  sources: readonly AddMoneyPaymentSource[];
  quickAmounts: readonly AddMoneyQuickAmount[];
  avatarUri: string;
  setAmount: (value: string) => void;
  setQuickAmount: (amount: number) => void;
  selectSource: (sourceId: string) => void;
  linkUpi: () => void;
  linkBank: () => void;
  submit: () => void;
  goBack: () => void;
  openProfile: () => void;
}

export const useAddMoney = (): UseAddMoneyResult => {
  const router = useRouter();
  const user = useSessionUser();
  const [amount, setAmountState] = useState(DEFAULT_ADD_MONEY_AMOUNT);
  const [selectedSourceId, setSelectedSourceId] = useState(DEFAULT_ADD_MONEY_SOURCE_ID);

  const avatarUri = useMemo(
    () => user?.avatarUri ?? DEFAULT_PROFILE_AVATAR,
    [user?.avatarUri],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.wallet);
  }, [router]);

  const openProfile = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.profile);
  }, [router]);

  const setAmount = useCallback((value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    if (parts[1] && parts[1].length > 2) {
      return;
    }
    setAmountState(cleaned);
  }, []);

  const setQuickAmount = useCallback((value: number) => {
    triggerLightHaptic();
    setAmountState(String(value));
  }, []);

  const selectSource = useCallback((sourceId: string) => {
    triggerLightHaptic();
    setSelectedSourceId(sourceId);
  }, []);

  const linkUpi = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.linkUpi);
  }, [router]);

  const linkBank = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.addBankAccount);
  }, [router]);

  const submit = useCallback(() => {
    triggerLightHaptic();
    const numericAmount = Number.parseFloat(amount) || 0;

    if (numericAmount <= 0) {
      showAppAlert(ADD_MONEY_SCREEN.invalidAmountTitle, ADD_MONEY_SCREEN.invalidAmountMessage);
      return;
    }

    const source = ADD_MONEY_PAYMENT_SOURCES.find((item) => item.id === selectedSourceId);
    if (!source) {
      showAppAlert(ADD_MONEY_SCREEN.selectSourceTitle, ADD_MONEY_SCREEN.selectSourceMessage);
      return;
    }

    const amountLabel = formatBhaiWayCoins(numericAmount);

    void (async () => {
      try {
        const nextBalance = await updateBhaiWayWalletBalance(numericAmount, { mode: 'add' });
        try {
          await recordWalletTransaction({
            title: 'Added to Wallet',
            amount: numericAmount,
            type: 'credit',
            icon: 'card',
            reference: source.id,
          });
        } catch (error) {
          console.log('[AddMoney] transaction record failed', error);
        }
        triggerSuccessHaptic();
        router.replace(
          getFundsAddedPath({
            amountLabel,
            balanceLabel: formatBhaiWayCoins(nextBalance),
            amount: numericAmount,
            balance: nextBalance,
          }),
        );
      } catch (error) {
        showAppAlert(
          'Add money failed',
          error instanceof Error ? error.message : 'Unable to update wallet balance.',
        );
      }
    })();
  }, [amount, router, selectedSourceId]);

  return {
    amount,
    selectedSourceId,
    sources: ADD_MONEY_PAYMENT_SOURCES,
    quickAmounts: ADD_MONEY_QUICK_AMOUNTS,
    avatarUri,
    setAmount,
    setQuickAmount,
    selectSource,
    linkUpi,
    linkBank,
    submit,
    goBack,
    openProfile,
  };
};
