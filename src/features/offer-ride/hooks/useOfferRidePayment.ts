import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { showAppAlert, triggerLightHaptic, triggerSuccessHaptic } from '@/shared/utils';
import { getAddCardPath, getAddUpiPath, getSeeAllBanksPath } from '@/features/ride-search/constants';
import { savedCardStore, savedUpiStore, selectedBankStore } from '@/features/ride-search/store';
import type { PaymentMethodId } from '@/features/ride-search/types';
import { OFFER_RIDE_PAYMENT_SCREEN } from '../constants';
import { commitPublishedFromDraft } from '../utils';

export interface UseOfferRidePaymentResult {
  selectedId: PaymentMethodId;
  setSelectedId: (id: PaymentMethodId) => void;
  confirmAndPublish: () => void;
  onAddCoins: () => void;
  onAddUpi: () => void;
  onAddCard: () => void;
  onSeeAllBanks: () => void;
  goBack: () => void;
}

export const useOfferRidePayment = (): UseOfferRidePaymentResult => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<PaymentMethodId>('wallet');

  useEffect(() => {
    const unsubUpi = savedUpiStore.subscribe(() => {
      const lastAddedId = savedUpiStore.getLastAddedId();
      if (!lastAddedId) {
        return;
      }
      setSelectedId(lastAddedId);
      savedUpiStore.clearLastAddedId();
    });
    const unsubCard = savedCardStore.subscribe(() => {
      const lastAddedId = savedCardStore.getLastAddedId();
      if (!lastAddedId) {
        return;
      }
      setSelectedId(lastAddedId);
      savedCardStore.clearLastAddedId();
    });
    const unsubBank = selectedBankStore.subscribe(() => {
      const lastSelectedId = selectedBankStore.getLastSelectedId();
      if (!lastSelectedId) {
        return;
      }
      setSelectedId(lastSelectedId);
      selectedBankStore.clearLastSelectedId();
    });
    return () => {
      unsubUpi();
      unsubCard();
      unsubBank();
    };
  }, []);

  const confirmAndPublish = useCallback(() => {
    triggerSuccessHaptic();
    void (async () => {
      const committed = await commitPublishedFromDraft();
      if (!committed) {
        showAppAlert(
          OFFER_RIDE_PAYMENT_SCREEN.missingVehicleTitle,
          OFFER_RIDE_PAYMENT_SCREEN.missingVehicleMessage,
        );
        return;
      }
      router.replace(ROUTES.offerRidePublished);
    })();
  }, [router]);

  const onAddCoins = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.addMoney);
  }, [router]);

  const onAddUpi = useCallback(() => {
    triggerLightHaptic();
    router.push(getAddUpiPath());
  }, [router]);

  const onAddCard = useCallback(() => {
    triggerLightHaptic();
    router.push(getAddCardPath());
  }, [router]);

  const onSeeAllBanks = useCallback(() => {
    triggerLightHaptic();
    router.push(getSeeAllBanksPath());
  }, [router]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.offerRidePreferences);
  }, [router]);

  return {
    selectedId,
    setSelectedId,
    confirmAndPublish,
    onAddCoins,
    onAddUpi,
    onAddCard,
    onSeeAllBanks,
    goBack,
  };
};
