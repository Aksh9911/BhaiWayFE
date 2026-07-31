import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic } from '@/shared/utils';

export interface UseAccountDeletedResult {
  goHome: () => void;
}

export const useAccountDeleted = (): UseAccountDeletedResult => {
  const router = useRouter();

  const goHome = useCallback(() => {
    triggerLightHaptic();
    router.replace(ROUTES.welcome);
  }, [router]);

  return { goHome };
};
