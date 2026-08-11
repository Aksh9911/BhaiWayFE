import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { showAppAlert } from '@/store';
import { triggerSuccessHaptic } from '@/shared/utils';
import {
  ADD_CARD_SCREEN,
  cardBrandLabel,
  detectCardBrand,
  digitsOnly,
  formatCardNumber,
  formatExpiry,
  isValidCardNumber,
  isValidCvv,
  isValidExpiry,
} from '../constants/add-card.constants';
import { savedCardStore } from '../store/savedCardStore';

export interface UseAddCardResult {
  cardNumber: string;
  holderName: string;
  expiry: string;
  cvv: string;
  brandLabel: string;
  canSave: boolean;
  saving: boolean;
  setCardNumber: (value: string) => void;
  setHolderName: (value: string) => void;
  setExpiry: (value: string) => void;
  setCvv: (value: string) => void;
  saveCard: () => void;
  goBack: () => void;
}

export const useAddCard = (): UseAddCardResult => {
  const router = useRouter();
  const [cardNumber, setCardNumberState] = useState('');
  const [holderName, setHolderName] = useState('');
  const [expiry, setExpiryState] = useState('');
  const [cvv, setCvvState] = useState('');
  const [saving, setSaving] = useState(false);

  const digits = digitsOnly(cardNumber);
  const brand = detectCardBrand(digits);
  const brandLabel = cardBrandLabel(brand);

  const canSave = useMemo(
    () =>
      isValidCardNumber(cardNumber) &&
      holderName.trim().length >= 2 &&
      isValidExpiry(expiry) &&
      isValidCvv(cvv, brand) &&
      !saving,
    [brand, cardNumber, cvv, expiry, holderName, saving],
  );

  const setCardNumber = useCallback((value: string) => {
    setCardNumberState(formatCardNumber(value));
  }, []);

  const setExpiry = useCallback((value: string) => {
    setExpiryState(formatExpiry(value));
  }, []);

  const setCvv = useCallback(
    (value: string) => {
      const max = brand === 'amex' ? 4 : 3;
      setCvvState(digitsOnly(value).slice(0, max));
    },
    [brand],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.rideSearchPayment);
  }, [router]);

  const saveCard = useCallback(() => {
    if (!isValidCardNumber(cardNumber)) {
      showAppAlert(ADD_CARD_SCREEN.invalidTitle, ADD_CARD_SCREEN.invalidNumberMessage);
      return;
    }
    if (holderName.trim().length < 2) {
      showAppAlert(ADD_CARD_SCREEN.invalidTitle, ADD_CARD_SCREEN.invalidNameMessage);
      return;
    }
    if (!isValidExpiry(expiry)) {
      showAppAlert(ADD_CARD_SCREEN.invalidTitle, ADD_CARD_SCREEN.invalidExpiryMessage);
      return;
    }
    if (!isValidCvv(cvv, brand)) {
      showAppAlert(ADD_CARD_SCREEN.invalidTitle, ADD_CARD_SCREEN.invalidCvvMessage);
      return;
    }

    const last4 = digits.slice(-4);
    setSaving(true);
    setTimeout(() => {
      savedCardStore.add({
        brand,
        brandLabel,
        last4,
        holderName: holderName.trim(),
        expiryLabel: expiry,
        label: `${brandLabel} •••• ${last4}`,
        subtitle: `Expires ${expiry}`,
      });
      setSaving(false);
      triggerSuccessHaptic();
      goBack();
    }, 600);
  }, [brand, brandLabel, cardNumber, cvv, digits, expiry, goBack, holderName]);

  return {
    cardNumber,
    holderName,
    expiry,
    cvv,
    brandLabel,
    canSave,
    saving,
    setCardNumber,
    setHolderName,
    setExpiry,
    setCvv,
    saveCard,
    goBack,
  };
};
