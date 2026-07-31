import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { useSessionUser } from '@/shared/hooks';
import { triggerLightHaptic, triggerSuccessHaptic } from '@/shared/utils';
import { DEFAULT_PROFILE_AVATAR } from '../constants/profile.constants';
import {
  DEFAULT_WITHDRAW_AMOUNT,
  DEFAULT_WITHDRAW_BANK_ID,
  WITHDRAW_AVAILABLE_BALANCE,
  WITHDRAW_AVAILABLE_BALANCE_LABEL,
  WITHDRAW_BANK_ACCOUNTS,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_SCREEN,
} from '../constants/withdraw.constants';
import type { WithdrawBankAccount, WithdrawQuickAmount } from '../types';

const formatAmountLabel = (amount: number) =>
  `₹ ${amount.toLocaleString('en-IN')}`;

export interface UseWithdrawResult {
  title: string;
  balanceLabel: string;
  balanceValueLabel: string;
  amount: string;
  selectedBankId: string;
  banks: readonly WithdrawBankAccount[];
  quickAmounts: readonly WithdrawQuickAmount[];
  avatarUri: string;
  setAmount: (value: string) => void;
  addQuickAmount: (amount: number) => void;
  selectBank: (bankId: string) => void;
  addBankAccount: () => void;
  proceed: () => void;
  goBack: () => void;
  openProfile: () => void;
}

export const useWithdraw = (): UseWithdrawResult => {
  const router = useRouter();
  const user = useSessionUser();
  const [amount, setAmountState] = useState(String(DEFAULT_WITHDRAW_AMOUNT));
  const [selectedBankId, setSelectedBankId] = useState(DEFAULT_WITHDRAW_BANK_ID);

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

  const addQuickAmount = useCallback((increment: number) => {
    triggerLightHaptic();
    setAmountState((prev) => {
      const current = Number.parseFloat(prev) || 0;
      return String(current + increment);
    });
  }, []);

  const selectBank = useCallback((bankId: string) => {
    triggerLightHaptic();
    setSelectedBankId(bankId);
  }, []);

  const addBankAccount = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.addBankAccount);
  }, [router]);

  const proceed = useCallback(() => {
    triggerLightHaptic();
    const numericAmount = Number.parseFloat(amount) || 0;

    if (numericAmount <= 0) {
      Alert.alert(WITHDRAW_SCREEN.invalidAmountTitle, WITHDRAW_SCREEN.invalidAmountMessage);
      return;
    }

    if (numericAmount > WITHDRAW_AVAILABLE_BALANCE) {
      Alert.alert(WITHDRAW_SCREEN.exceedBalanceTitle, WITHDRAW_SCREEN.exceedBalanceMessage);
      return;
    }

    const bank = WITHDRAW_BANK_ACCOUNTS.find((item) => item.id === selectedBankId);
    if (!bank) {
      Alert.alert(WITHDRAW_SCREEN.selectAccountTitle, WITHDRAW_SCREEN.selectAccountMessage);
      return;
    }

    triggerSuccessHaptic();
    const referenceNumber = `BW-REF-${Date.now().toString().slice(-8)}`;
    router.replace({
      pathname: ROUTES.withdrawalInitiated,
      params: {
        kind: 'withdrawal-initiated',
        amountLabel: formatAmountLabel(numericAmount),
        bankName: bank.bankName,
        maskedNumber: bank.maskedNumber.replace('••••', '****'),
        referenceNumber,
      },
    });
  }, [amount, router, selectedBankId]);

  return {
    title: WITHDRAW_SCREEN.title,
    balanceLabel: WITHDRAW_SCREEN.balanceLabel,
    balanceValueLabel: WITHDRAW_AVAILABLE_BALANCE_LABEL,
    amount,
    selectedBankId,
    banks: WITHDRAW_BANK_ACCOUNTS,
    quickAmounts: WITHDRAW_QUICK_AMOUNTS,
    avatarUri,
    setAmount,
    addQuickAmount,
    selectBank,
    addBankAccount,
    proceed,
    goBack,
    openProfile,
  };
};
