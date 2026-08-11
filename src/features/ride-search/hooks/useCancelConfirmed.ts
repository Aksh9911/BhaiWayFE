import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';
import { CANCEL_CONFIRMED_SCREEN } from '../constants';
import type { RideType } from '../types';

export interface UseCancelConfirmedParams {
  rideType?: string;
}

export interface UseCancelConfirmedResult {
  subtitle: string;
  isAssured: boolean;
  goBack: () => void;
  bookNewRide: () => void;
}

const isRideType = (value?: string): value is RideType =>
  value === 'regular' || value === 'assured';

export const useCancelConfirmed = (
  params: UseCancelConfirmedParams = {},
): UseCancelConfirmedResult => {
  const router = useRouter();
  const rideType: RideType = isRideType(params.rideType) ? params.rideType : 'regular';
  const isAssured = rideType === 'assured';

  const goBack = useCallback(() => {
    resetTo(router, ROUTES.home);
  }, [router]);

  const bookNewRide = useCallback(() => {
    resetTo(router, ROUTES.rideSearch);
  }, [router]);

  return {
    subtitle: isAssured
      ? CANCEL_CONFIRMED_SCREEN.subtitleAssured
      : CANCEL_CONFIRMED_SCREEN.subtitleRegular,
    isAssured,
    goBack,
    bookNewRide,
  };
};
