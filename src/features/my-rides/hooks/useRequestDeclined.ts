import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { getSearchParam, triggerLightHaptic } from '@/shared/utils';
import { getDriverTrackRidePath } from '../constants';

export interface UseRequestDeclinedResult {
  riderName: string;
  goToDashboard: () => void;
  viewOtherRequests: () => void;
  goBack: () => void;
}

export const useRequestDeclined = (): UseRequestDeclinedResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    riderId?: string;
    name?: string;
  }>();

  const rideId = getSearchParam(params.rideId) || 'driving-upcoming-regular-1';
  const riderName = useMemo(
    () => getSearchParam(params.name) || 'this rider',
    [params.name],
  );

  const goToDashboard = useCallback(() => {
    triggerLightHaptic();
    router.replace(ROUTES.myRides);
  }, [router]);

  const viewOtherRequests = useCallback(() => {
    triggerLightHaptic();
    router.replace(getDriverTrackRidePath(rideId));
  }, [rideId, router]);

  const goBack = useCallback(() => {
    triggerLightHaptic();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  return {
    riderName,
    goToDashboard,
    viewOtherRequests,
    goBack,
  };
};
