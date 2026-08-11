import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';

export interface UseCommuteCancelConfirmedResult {
  goHome: () => void;
  bookAgain: () => void;
}

export const useCommuteCancelConfirmed = (): UseCommuteCancelConfirmedResult => {
  const router = useRouter();

  const goHome = useCallback(() => {
    resetTo(router, ROUTES.home);
  }, [router]);

  const bookAgain = useCallback(() => {
    resetTo(router, ROUTES.officeCommuteSearch);
  }, [router]);

  return {
    goHome,
    bookAgain,
  };
};
