import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';
import {
  DEFAULT_DRIVER_ACTIVE_TRIP,
  getDriverTripCompletedPath,
} from '../constants';
import type { ActiveTripSummary } from '../types';

export interface UseDriverActiveTripResult {
  trip: ActiveTripSummary;
  completed: boolean;
  completeTrip: () => void;
  triggerSos: () => void;
  toggleVoice: () => void;
  goBack: () => void;
}

export const useDriverActiveTrip = (): UseDriverActiveTripResult => {
  const router = useRouter();
  const [completed, setCompleted] = useState(false);
  const trip = DEFAULT_DRIVER_ACTIVE_TRIP;

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  const completeTrip = useCallback(() => {
    if (completed) {
      return;
    }
    setCompleted(true);
    resetTo(
      router,
      getDriverTripCompletedPath({
        destination: trip.destinationLabel,
      }),
    );
  }, [completed, router, trip.destinationLabel]);

  const triggerSos = useCallback(() => {
    router.push(ROUTES.myRidesEmergencyEnd);
  }, [router]);

  const toggleVoice = useCallback(() => {
    Alert.alert('Voice guidance', 'Voice navigation will be available soon.');
  }, []);

  return {
    trip,
    completed,
    completeTrip,
    triggerSos,
    toggleVoice,
    goBack,
  };
};
