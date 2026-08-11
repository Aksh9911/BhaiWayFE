import { useCallback, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  getSearchParam,
  showAppAlert,
  triggerLightHaptic,
  triggerSuccessHaptic,
} from '@/shared/utils';
import {
  RATE_PASSENGERS_SCREEN,
  getRatePassengersMock,
  getRatingsSubmittedPath,
} from '../constants';
import type { PassengerRatingValue, RatePassengersSummary } from '../types';

export interface UseRatePassengersResult {
  passengers: RatePassengersSummary['passengers'];
  ratings: Record<string, PassengerRatingValue>;
  canSubmit: boolean;
  setRating: (passengerId: string, value: PassengerRatingValue) => void;
  submitRatings: () => void;
  openNotifications: () => void;
  goBack: () => void;
}

export const useRatePassengers = (): UseRatePassengersResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{ rideId?: string }>();
  const rideId = getSearchParam(params.rideId) || 'driver-trip-1';

  const summary = useMemo(() => getRatePassengersMock({ rideId }), [rideId]);

  const [ratings, setRatings] = useState<Record<string, PassengerRatingValue>>(() =>
    Object.fromEntries(summary.passengers.map((p) => [p.id, 0 as PassengerRatingValue])),
  );

  const canSubmit = useMemo(
    () => summary.passengers.every((p) => (ratings[p.id] ?? 0) > 0),
    [ratings, summary.passengers],
  );

  const setRating = useCallback((passengerId: string, value: PassengerRatingValue) => {
    triggerLightHaptic();
    setRatings((prev) => ({ ...prev, [passengerId]: value }));
  }, []);

  const submitRatings = useCallback(() => {
    if (!canSubmit) {
      showAppAlert(
        RATE_PASSENGERS_SCREEN.incompleteTitle,
        RATE_PASSENGERS_SCREEN.incompleteMessage,
      );
      return;
    }
    triggerSuccessHaptic();
    router.replace(
      getRatingsSubmittedPath({
        rideId,
        items: summary.passengers.map((passenger) => ({
          id: passenger.id,
          name: passenger.name,
          avatarUri: passenger.avatarUri,
          rating: ratings[passenger.id] ?? 0,
        })),
      }),
    );
  }, [canSubmit, ratings, rideId, router, summary.passengers]);

  const openNotifications = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.notifications);
  }, [router]);

  const goBack = useCallback(() => {
    triggerLightHaptic();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  return {
    passengers: summary.passengers,
    ratings,
    canSubmit,
    setRating,
    submitRatings,
    openNotifications,
    goBack,
  };
};
