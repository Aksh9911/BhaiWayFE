import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { appModeStore } from '@/store';
import { resetTo } from '@/shared/utils';
import { CANCEL_UPCOMING_CONFIRMED_SCREEN } from '../constants';

export interface UseCancelUpcomingConfirmedResult {
  subtitle: string;
  backLabel: string;
  goToMyRides: () => void;
}

export const useCancelUpcomingConfirmed = (): UseCancelUpcomingConfirmedResult => {
  const router = useRouter();
  const isDriving = appModeStore.get() === 'driving';

  const goToMyRides = useCallback(() => {
    resetTo(router, ROUTES.myRides);
  }, [router]);

  return {
    subtitle: isDriving
      ? CANCEL_UPCOMING_CONFIRMED_SCREEN.subtitleDriving
      : CANCEL_UPCOMING_CONFIRMED_SCREEN.subtitleRiding,
    backLabel: CANCEL_UPCOMING_CONFIRMED_SCREEN.backLabel,
    goToMyRides,
  };
};
