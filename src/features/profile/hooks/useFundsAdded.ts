import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  formatBhaiWayWalletLabel,
  getBhaiWayWalletBalance,
} from '@/DemoData';
import { useSessionUser } from '@/shared/hooks';
import { formatBhaiWayCoins, getSearchParam, triggerLightHaptic } from '@/shared/utils';
import { DEFAULT_PROFILE_AVATAR } from '../constants/profile.constants';
import { FUNDS_ADDED_SCREEN } from '../constants/funds-added.constants';

export interface UseFundsAddedResult {
  brandTitle: string;
  title: string;
  subtitle: string;
  amountLabel: string;
  balanceLabel: string;
  statusLabel: string;
  statusTitle: string;
  updatedLabel: string;
  goToWalletLabel: string;
  bookRideLabel: string;
  receiptLabel: string;
  avatarUri: string;
  goToWallet: () => void;
  bookRide: () => void;
  viewReceipt: () => void;
  openNotifications: () => void;
  openProfile: () => void;
}

export const useFundsAdded = (): UseFundsAddedResult => {
  const router = useRouter();
  const user = useSessionUser();
  const params = useLocalSearchParams<{
    amountLabel?: string;
    balanceLabel?: string;
    amount?: string;
    balance?: string;
  }>();

  const avatarUri = useMemo(
    () => user?.avatarUri ?? DEFAULT_PROFILE_AVATAR,
    [user?.avatarUri],
  );

  const amountLabel = useMemo(() => {
    const fromParam = getSearchParam(params.amountLabel);
    if (fromParam) {
      return fromParam;
    }
    const amount = Number(getSearchParam(params.amount));
    if (Number.isFinite(amount) && amount > 0) {
      return formatBhaiWayCoins(amount);
    }
    return FUNDS_ADDED_SCREEN.defaultAmountLabel;
  }, [params.amount, params.amountLabel]);

  const balanceLabel = useMemo(() => {
    const fromParam = getSearchParam(params.balanceLabel);
    if (fromParam) {
      return fromParam;
    }
    const balance = Number(getSearchParam(params.balance));
    if (Number.isFinite(balance) && balance >= 0) {
      return formatBhaiWayCoins(balance);
    }
    return formatBhaiWayWalletLabel(getBhaiWayWalletBalance());
  }, [params.balance, params.balanceLabel]);

  const goToWallet = useCallback(() => {
    triggerLightHaptic();
    router.replace(ROUTES.wallet);
  }, [router]);

  const bookRide = useCallback(() => {
    triggerLightHaptic();
    router.replace(ROUTES.rideSearch);
  }, [router]);

  const viewReceipt = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.walletTransactions);
  }, [router]);

  const openNotifications = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.notifications);
  }, [router]);

  const openProfile = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.profile);
  }, [router]);

  return {
    brandTitle: FUNDS_ADDED_SCREEN.brandTitle,
    title: FUNDS_ADDED_SCREEN.title,
    subtitle: FUNDS_ADDED_SCREEN.subtitle,
    amountLabel,
    balanceLabel,
    statusLabel: FUNDS_ADDED_SCREEN.statusLabel,
    statusTitle: FUNDS_ADDED_SCREEN.statusTitle,
    updatedLabel: FUNDS_ADDED_SCREEN.updatedLabel,
    goToWalletLabel: FUNDS_ADDED_SCREEN.goToWalletLabel,
    bookRideLabel: FUNDS_ADDED_SCREEN.bookRideLabel,
    receiptLabel: FUNDS_ADDED_SCREEN.receiptLabel,
    avatarUri,
    goToWallet,
    bookRide,
    viewReceipt,
    openNotifications,
    openProfile,
  };
};
