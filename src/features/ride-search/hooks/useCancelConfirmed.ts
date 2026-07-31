import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';

export interface UseCancelConfirmedResult {
  goBack: () => void;
  bookNewRide: () => void;
}

export const useCancelConfirmed = (): UseCancelConfirmedResult => {
  const router = useRouter();

  const goBack = useCallback(() => {
    resetTo(router, ROUTES.home);
  }, [router]);

  const bookNewRide = useCallback(() => {
    resetTo(router, ROUTES.rideSearch);
  }, [router]);

  return {
    goBack,
    bookNewRide,
  };
};
