import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic, showAppAlert } from '@/shared/utils';
import {
  SAFETY_HUB_SCREEN,
  SAFETY_REPORT_OPTIONS,
} from '../constants';
import { trustedContactsStore } from '../store';
import type { SafetyReportOption, TrustedContact } from '../types';

export interface UseSafetyHubResult {
  contacts: readonly TrustedContact[];
  reportOptions: readonly SafetyReportOption[];
  goBack: () => void;
  openInfo: () => void;
  manageContacts: () => void;
  triggerSos: () => void;
  openReport: (id: string) => void;
  chatWithSupport: () => void;
}

export const useSafetyHub = (): UseSafetyHubResult => {
  const router = useRouter();
  const [contacts, setContacts] = useState<TrustedContact[]>(trustedContactsStore.get());

  useEffect(() => trustedContactsStore.subscribe(setContacts), []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.profile);
  }, [router]);

  const openInfo = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(SAFETY_HUB_SCREEN.infoTitle, SAFETY_HUB_SCREEN.infoMessage);
  }, []);

  const manageContacts = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.trustedContacts);
  }, [router]);

  const triggerSos = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.emergencyAssistance);
  }, [router]);

  const openReport = useCallback((_id: string) => {
    triggerLightHaptic();
    showAppAlert(SAFETY_HUB_SCREEN.reportTitle, SAFETY_HUB_SCREEN.reportMessage);
  }, []);

  const chatWithSupport = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.supportChat);
  }, [router]);

  return {
    contacts,
    reportOptions: SAFETY_REPORT_OPTIONS,
    goBack,
    openInfo,
    manageContacts,
    triggerSos,
    openReport,
    chatWithSupport,
  };
};
