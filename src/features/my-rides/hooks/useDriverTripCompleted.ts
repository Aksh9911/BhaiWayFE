import { useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic } from '@/shared/utils';
import {
  getDriverTripCompletedMock,
  getRatePassengersPath,
  getTripDetailsPath,
} from '../constants';
import type { DriverRideKind, DriverTripCompletedSummary } from '../types';
import { useDriverRideKind } from './useDriverRideKind';

export interface UseDriverTripCompletedParams {
  destination?: string;
  /** Prefer reading from route via useDriverRideKind when omitted. */
  rideType?: DriverRideKind;
}

export interface UseDriverTripCompletedResult {
  trip: DriverTripCompletedSummary;
  openNotifications: () => void;
  ratePassengers: () => void;
  viewTripDetails: () => void;
}

export const useDriverTripCompleted = (
  params: UseDriverTripCompletedParams = {},
): UseDriverTripCompletedResult => {
  const router = useRouter();
  const routeRideType = useDriverRideKind();
  const rideType = params.rideType ?? routeRideType;

  const trip = useMemo(
    () =>
      getDriverTripCompletedMock({
        destination: params.destination,
        rideType,
      }),
    [params.destination, rideType],
  );

  const openNotifications = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.notifications);
  }, [router]);

  const ratePassengers = useCallback(() => {
    triggerLightHaptic();
    router.push(getRatePassengersPath({ rideId: trip.rideId }));
  }, [router, trip.rideId]);

  const viewTripDetails = useCallback(() => {
    triggerLightHaptic();
    router.push(
      getTripDetailsPath({
        rideId: trip.rideId,
        origin: trip.pickupTitle,
        destination: trip.dropoffTitle,
        rideType: trip.rideType,
      }),
    );
  }, [router, trip.dropoffTitle, trip.pickupTitle, trip.rideId, trip.rideType]);

  return {
    trip,
    openNotifications,
    ratePassengers,
    viewTripDetails,
  };
};
