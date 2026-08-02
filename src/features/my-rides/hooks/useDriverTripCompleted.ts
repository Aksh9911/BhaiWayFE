import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';
import { getDriverTripCompletedMock } from '../constants';
import type {
  DriverTripCompletedCoordinate,
  DriverTripCompletedSummary,
} from '../types';

export interface UseDriverTripCompletedParams {
  destination?: string;
}

export interface UseDriverTripCompletedResult {
  trip: DriverTripCompletedSummary;
  routeCoordinates: DriverTripCompletedCoordinate[];
  finishTrip: () => void;
  openNotifications: () => void;
}

export const useDriverTripCompleted = (
  params: UseDriverTripCompletedParams,
): UseDriverTripCompletedResult => {
  const router = useRouter();
  const [routeCoordinates, setRouteCoordinates] = useState<
    DriverTripCompletedCoordinate[]
  >([]);

  const trip = useMemo(
    () => getDriverTripCompletedMock({ destination: params.destination }),
    [params.destination],
  );

  useEffect(() => {
    setRouteCoordinates([trip.pickup, trip.dropoff]);
  }, [trip.dropoff, trip.pickup]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const finishTrip = useCallback(() => {
    resetTo(router, ROUTES.myRides);
  }, [router]);

  return {
    trip,
    routeCoordinates,
    finishTrip,
    openNotifications,
  };
};
