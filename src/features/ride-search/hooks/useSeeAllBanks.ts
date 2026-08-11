import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic } from '@/shared/utils';
import { ALL_BANKS, POPULAR_BANKS } from '../constants';
import { selectedBankStore } from '../store/selectedBankStore';
import type { PaymentBankOption } from '../types';

export interface UseSeeAllBanksResult {
  query: string;
  setQuery: (value: string) => void;
  popularBanks: readonly PaymentBankOption[];
  filteredBanks: PaymentBankOption[];
  selectBank: (bankId: string) => void;
  goBack: () => void;
}

export const useSeeAllBanks = (): UseSeeAllBanksResult => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredBanks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [...ALL_BANKS];
    }
    return ALL_BANKS.filter((bank) => bank.label.toLowerCase().includes(normalized));
  }, [query]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.rideSearchPayment);
  }, [router]);

  const selectBank = useCallback(
    (bankId: string) => {
      triggerLightHaptic();
      selectedBankStore.select(bankId);
      goBack();
    },
    [goBack],
  );

  return {
    query,
    setQuery,
    popularBanks: POPULAR_BANKS,
    filteredBanks,
    selectBank,
    goBack,
  };
};
