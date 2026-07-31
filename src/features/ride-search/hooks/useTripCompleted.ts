import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';
import {
  getTripCompletedMock,
  getTripReviewPath,
  TRIP_COMPLETED_PAYMENT_OPTIONS,
} from '../constants';
import { fetchDrivingRoute } from '../services';
import type {
  MapCoordinate,
  RideType,
  TripCompletedData,
  TripCompletedPaymentId,
} from '../types';

export interface UseTripCompletedParams {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}

export interface UseTripCompletedResult {
  trip: TripCompletedData;
  routeCoordinates: MapCoordinate[];
  paymentOptions: typeof TRIP_COMPLETED_PAYMENT_OPTIONS;
  selectedPaymentId: TripCompletedPaymentId;
  selectPayment: (id: TripCompletedPaymentId) => void;
  payNow: () => void;
  openNotifications: () => void;
  goHome: () => void;
}

export const useTripCompleted = (params: UseTripCompletedParams): UseTripCompletedResult => {
  const router = useRouter();
  const [selectedPaymentId, setSelectedPaymentId] =
    useState<TripCompletedPaymentId>('wallet');
  const [routeCoordinates, setRouteCoordinates] = useState<MapCoordinate[]>([]);

  const trip = useMemo(
    () =>
      getTripCompletedMock({
        rideId: params.rideId,
        rideType: params.rideType,
        origin: params.origin,
        destination: params.destination,
        driverName: params.driverName,
        carModel: params.carModel,
        price: params.price,
        originLat: params.originLat,
        originLng: params.originLng,
        destinationLat: params.destinationLat,
        destinationLng: params.destinationLng,
      }),
    [
      params.carModel,
      params.destination,
      params.destinationLat,
      params.destinationLng,
      params.driverName,
      params.origin,
      params.originLat,
      params.originLng,
      params.price,
      params.rideId,
      params.rideType,
    ],
  );

  useEffect(() => {
    let cancelled = false;

    const loadRoute = async () => {
      try {
        const route = await fetchDrivingRoute(trip.pickup, trip.dropoff);
        if (!cancelled && route.coordinates.length >= 2) {
          setRouteCoordinates(route.coordinates);
        }
      } catch {
        if (!cancelled) {
          setRouteCoordinates([trip.pickup, trip.dropoff]);
        }
      }
    };

    void loadRoute();
    return () => {
      cancelled = true;
    };
  }, [trip.dropoff, trip.pickup]);

  const selectPayment = useCallback((id: TripCompletedPaymentId) => {
    setSelectedPaymentId(id);
  }, []);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const goHome = useCallback(() => {
    resetTo(router, ROUTES.home);
  }, [router]);

  const payNow = useCallback(() => {
    resetTo(
      router,
      getTripReviewPath({
        rideId: params.rideId,
        driverName: params.driverName || trip.driverName,
      }),
    );
  }, [params.driverName, params.rideId, router, trip.driverName]);

  return {
    trip,
    routeCoordinates,
    paymentOptions: TRIP_COMPLETED_PAYMENT_OPTIONS,
    selectedPaymentId,
    selectPayment,
    payNow,
    openNotifications,
    goHome,
  };
};
