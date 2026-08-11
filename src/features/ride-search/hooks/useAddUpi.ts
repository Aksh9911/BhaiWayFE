import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { showAppAlert } from '@/store';
import { isValidUpiId, triggerSuccessHaptic } from '@/shared/utils';
import { ADD_UPI_SCREEN } from '../constants/add-upi.constants';
import { savedUpiStore } from '../store/savedUpiStore';

export interface UseAddUpiResult {
  upiId: string;
  displayName: string;
  canSave: boolean;
  saving: boolean;
  setUpiId: (value: string) => void;
  setDisplayName: (value: string) => void;
  saveUpi: () => void;
  goBack: () => void;
}

export const useAddUpi = (): UseAddUpiResult => {
  const router = useRouter();
  const [upiId, setUpiIdState] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => isValidUpiId(upiId) && !saving, [saving, upiId]);

  const setUpiId = useCallback((value: string) => {
    setUpiIdState(value.replace(/\s+/g, ''));
  }, []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.rideSearchPayment);
  }, [router]);

  const saveUpi = useCallback(() => {
    const trimmed = upiId.trim();
    if (!isValidUpiId(trimmed)) {
      showAppAlert(ADD_UPI_SCREEN.invalidTitle, ADD_UPI_SCREEN.invalidMessage);
      return;
    }

    const normalized = trimmed.toLowerCase();
    const alreadySaved = savedUpiStore
      .get()
      .some((item) => item.upiId === normalized);

    setSaving(true);
    setTimeout(() => {
      const saved = savedUpiStore.add(normalized, displayName.trim() || undefined);
      setSaving(false);

      if (!saved) {
        showAppAlert(ADD_UPI_SCREEN.invalidTitle, ADD_UPI_SCREEN.invalidMessage);
        return;
      }

      triggerSuccessHaptic();
      if (alreadySaved) {
        showAppAlert(ADD_UPI_SCREEN.duplicateTitle, ADD_UPI_SCREEN.duplicateMessage);
      }
      goBack();
    }, 600);
  }, [displayName, goBack, upiId]);

  return {
    upiId,
    displayName,
    canSave,
    saving,
    setUpiId,
    setDisplayName,
    saveUpi,
    goBack,
  };
};
