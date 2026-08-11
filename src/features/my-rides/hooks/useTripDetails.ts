import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { getSearchParam, showAppAlert, triggerLightHaptic } from '@/shared/utils';
import { TRIP_DETAILS_SCREEN, getTripDetailsMock } from '../constants';
import type { TripDetailsSummary } from '../types';
import { useDriverRideKind } from './useDriverRideKind';

export interface UseTripDetailsResult {
  trip: TripDetailsSummary;
  downloadInvoice: () => void;
  goBack: () => void;
}

export const useTripDetails = (): UseTripDetailsResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    origin?: string;
    destination?: string;
  }>();
  const rideType = useDriverRideKind();

  const trip = useMemo(
    () =>
      getTripDetailsMock({
        rideId: getSearchParam(params.rideId) || undefined,
        origin: getSearchParam(params.origin) || undefined,
        destination: getSearchParam(params.destination) || undefined,
        rideType,
      }),
    [params.destination, params.origin, params.rideId, rideType],
  );

  const downloadInvoice = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(
      TRIP_DETAILS_SCREEN.downloadInvoiceTitle,
      TRIP_DETAILS_SCREEN.downloadInvoiceMessage,
    );
  }, []);

  const goBack = useCallback(() => {
    triggerLightHaptic();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  return {
    trip,
    downloadInvoice,
    goBack,
  };
};
