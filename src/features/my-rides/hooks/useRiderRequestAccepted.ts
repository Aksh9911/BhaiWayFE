import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { getSearchParam, showAppAlert, triggerLightHaptic } from '@/shared/utils';
import { RIDER_REQUEST_ACCEPTED_SCREEN } from '../constants';

export interface RiderAcceptedSummary {
  rideId: string;
  riderId: string;
  name: string;
  subtitle: string;
  avatarUri: string;
  rating: number;
  ridesCount: number;
  seatsBooked: number;
}

export interface UseRiderRequestAcceptedResult {
  rider: RiderAcceptedSummary;
  goToDashboard: () => void;
  messageRider: () => void;
  goBack: () => void;
}

export const useRiderRequestAccepted = (): UseRiderRequestAcceptedResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    riderId?: string;
    name?: string;
    subtitle?: string;
    avatarUri?: string;
    rating?: string;
    ridesCount?: string;
    seatsBooked?: string;
  }>();

  const rider = useMemo((): RiderAcceptedSummary => {
    const rating = Number(getSearchParam(params.rating));
    const ridesCount = Number(getSearchParam(params.ridesCount));
    const seatsBooked = Number(getSearchParam(params.seatsBooked));
    return {
      rideId: getSearchParam(params.rideId) || 'driving-upcoming-regular-1',
      riderId: getSearchParam(params.riderId) || 'pending-rohan',
      name: getSearchParam(params.name) || 'Rohan M.',
      subtitle: getSearchParam(params.subtitle) || 'Senior Engineer @ Google',
      avatarUri: getSearchParam(params.avatarUri) || '',
      rating: Number.isFinite(rating) ? rating : 4.7,
      ridesCount: Number.isFinite(ridesCount) ? ridesCount : 124,
      seatsBooked: Number.isFinite(seatsBooked) ? seatsBooked : 1,
    };
  }, [params]);

  const goToDashboard = useCallback(() => {
    triggerLightHaptic();
    router.replace(ROUTES.myRides);
  }, [router]);

  const messageRider = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(
      RIDER_REQUEST_ACCEPTED_SCREEN.messageLabel(rider.name),
      'Chat will be available soon.',
    );
  }, [rider.name]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  return {
    rider,
    goToDashboard,
    messageRider,
    goBack,
  };
};
