import { useCallback, useEffect, useRef, useState } from 'react';
import { Share } from 'react-native';

import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic, triggerSuccessHaptic, showAppAlert } from '@/shared/utils';
import {
  REFERRAL_CODE,
  REFERRAL_HISTORY,
  REFERRAL_PERKS,
  REFER_EARN_SCREEN,
} from '../constants';
import type { ReferralHistoryItem, ReferralPerk } from '../types';

export interface UseReferEarnResult {
  code: string;
  perks: readonly ReferralPerk[];
  history: readonly ReferralHistoryItem[];
  copied: boolean;
  goBack: () => void;
  openHelp: () => void;
  copyCode: () => void;
  shareCode: () => void;
  viewAllHistory: () => void;
}

export const useReferEarn = (): UseReferEarnResult => {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copiedTimerRef.current) {
        clearTimeout(copiedTimerRef.current);
      }
    },
    [],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.profile);
  }, [router]);

  const openHelp = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(REFER_EARN_SCREEN.helpTitle, REFER_EARN_SCREEN.helpMessage);
  }, []);

  const markCopied = useCallback(() => {
    setCopied(true);
    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current);
    }
    copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  const copyCode = useCallback(() => {
    triggerLightHaptic();
    Share.share({ message: REFERRAL_CODE })
      .then((result) => {
        if (result.action !== Share.dismissedAction) {
          triggerSuccessHaptic();
          markCopied();
        }
      })
      .catch(() => {
        showAppAlert('Referral Code', REFERRAL_CODE);
        markCopied();
      });
  }, [markCopied]);

  const shareCode = useCallback(() => {
    triggerLightHaptic();
    Share.share({
      message: REFER_EARN_SCREEN.shareMessage(REFERRAL_CODE),
    }).catch(() => {
      showAppAlert(REFER_EARN_SCREEN.shareLabel, REFER_EARN_SCREEN.shareMessage(REFERRAL_CODE));
    });
  }, []);

  const viewAllHistory = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(REFER_EARN_SCREEN.viewAllTitle, REFER_EARN_SCREEN.viewAllMessage);
  }, []);

  return {
    code: REFERRAL_CODE,
    perks: REFERRAL_PERKS,
    history: REFERRAL_HISTORY,
    copied,
    goBack,
    openHelp,
    copyCode,
    shareCode,
    viewAllHistory,
  };
};
