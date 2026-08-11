import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  bankAccountsSheetStore,
  bankAccountsSheetSync,
  formatBhaiWayWalletLabel,
  getBhaiWayWalletBalance,
  recordWalletTransaction,
  subscribeBhaiWayWallet,
  type BankAccountsSheetRow,
  updateBhaiWayWalletBalance,
} from '@/DemoData';
import { useSessionUser } from '@/shared/hooks';
import {
  formatBhaiWayCoins,
  triggerLightHaptic,
  triggerSuccessHaptic,
  showAppAlert,
} from '@/shared/utils';
import { DEFAULT_PROFILE_AVATAR } from '../constants/profile.constants';
import {
  DEFAULT_WITHDRAW_AMOUNT,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_SCREEN,
} from '../constants/withdraw.constants';
import type { WithdrawBankAccount, WithdrawQuickAmount } from '../types';

const formatAmountLabel = (amount: number) => formatBhaiWayCoins(amount);

const mapSheetRowToWithdrawAccount = (row: BankAccountsSheetRow): WithdrawBankAccount => ({
  id: String(row.bankAccountId),
  bankName: row.bankName,
  accountTypeLabel: row.accountType || 'Savings Account',
  maskedNumber: `•••• ${row.accountLast4 || row.accountNumber.slice(-4) || '----'}`,
});

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
  const walletBalance = useSyncExternalStore(subscribeBhaiWayWallet, getBhaiWayWalletBalance);
  const [banks, setBanks] = useState<WithdrawBankAccount[]>(() =>
    bankAccountsSheetStore.getForCurrentUser().map(mapSheetRowToWithdrawAccount),
  );
  const [amount, setAmountState] = useState(String(DEFAULT_WITHDRAW_AMOUNT));
  const [selectedBankId, setSelectedBankId] = useState('');

  useEffect(
    () =>
      bankAccountsSheetStore.subscribe(() => {
        setBanks(bankAccountsSheetStore.getForCurrentUser().map(mapSheetRowToWithdrawAccount));
      }),
    [],
  );

  useEffect(() => {
    void bankAccountsSheetSync.pullIntoLocal().catch((error) => {
      console.log('[Withdraw] bank accounts pull skipped', error);
    });
  }, []);

  useEffect(() => {
    if (banks.length === 0) {
      setSelectedBankId('');
      return;
    }
    if (banks.some((bank) => bank.id === selectedBankId)) {
      return;
    }
    setSelectedBankId(banks[0].id);
  }, [banks, selectedBankId]);

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
      showAppAlert(WITHDRAW_SCREEN.invalidAmountTitle, WITHDRAW_SCREEN.invalidAmountMessage);
      return;
    }

    if (numericAmount > walletBalance) {
      showAppAlert(WITHDRAW_SCREEN.exceedBalanceTitle, WITHDRAW_SCREEN.exceedBalanceMessage);
      return;
    }

    const bank = banks.find((item) => item.id === selectedBankId);
    if (!bank) {
      showAppAlert(WITHDRAW_SCREEN.selectAccountTitle, WITHDRAW_SCREEN.selectAccountMessage);
      return;
    }

    void (async () => {
      try {
        await updateBhaiWayWalletBalance(walletBalance - numericAmount, { mode: 'set' });

        const referenceNumber = `BW-REF-${Date.now().toString().slice(-8)}`;
        try {
          await recordWalletTransaction({
            title: 'Withdrawal',
            amount: numericAmount,
            type: 'debit',
            icon: 'business',
            reference: referenceNumber,
          });
        } catch (error) {
          console.log('[Withdraw] transaction record failed', error);
        }

        triggerSuccessHaptic();
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
      } catch (error) {
        showAppAlert(
          'Withdraw failed',
          error instanceof Error ? error.message : 'Unable to update wallet balance.',
        );
      }
    })();
  }, [amount, banks, router, selectedBankId, walletBalance]);

  return {
    title: WITHDRAW_SCREEN.title,
    balanceLabel: WITHDRAW_SCREEN.balanceLabel,
    balanceValueLabel: formatBhaiWayWalletLabel(walletBalance),
    amount,
    selectedBankId,
    banks,
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
