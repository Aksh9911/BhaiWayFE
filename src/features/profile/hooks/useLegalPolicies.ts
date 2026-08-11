import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic, showAppAlert } from '@/shared/utils';
import { LEGAL_POLICY_ITEMS, LEGAL_SCREEN } from '../constants';
import type { LegalPolicyId, LegalPolicyItem } from '../types';

export interface UseLegalPoliciesResult {
  items: readonly LegalPolicyItem[];
  goBack: () => void;
  openPolicy: (id: LegalPolicyId) => void;
}

export const useLegalPolicies = (): UseLegalPoliciesResult => {
  const router = useRouter();

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.profile);
  }, [router]);

  const openPolicy = useCallback(
    (id: LegalPolicyId) => {
      triggerLightHaptic();

      if (id === 'deletion') {
        router.push(ROUTES.deleteAccount);
        return;
      }

      showAppAlert(LEGAL_SCREEN.comingSoonTitle, LEGAL_SCREEN.comingSoonMessage);
    },
    [router],
  );

  return {
    items: LEGAL_POLICY_ITEMS,
    goBack,
    openPolicy,
  };
};
