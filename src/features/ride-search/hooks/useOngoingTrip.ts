import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking } from 'react-native';

import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  getOngoingTripMock,
  getDriverChatPath,
  getTripCompletedPath,
  ONGOING_TRIP_SCREEN,
} from '../constants';
import { fetchDrivingRoute } from '../services';
import type { MapCoordinate, OngoingTripData, RideType } from '../types';
import { resetTo, showAppAlert } from '@/shared/utils';

export interface UseOngoingTripParams {
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

export interface UseOngoingTripResult {
  trip: OngoingTripData;
  routeCoordinates: MapCoordinate[];
  goBack: () => void;
  callDriver: () => void;
  chatDriver: () => void;
  openSafety: () => void;
  triggerSos: () => void;
  completeTrip: () => void;
}

export const useOngoingTrip = (params: UseOngoingTripParams): UseOngoingTripResult => {
  const router = useRouter();
  const [routeCoordinates, setRouteCoordinates] = useState<MapCoordinate[]>([]);

  const trip = useMemo(
    () =>
      getOngoingTripMock({
        rideId: params.rideId,
        rideType: params.rideType,
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
      params.destinationLat,
      params.destinationLng,
      params.driverName,
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

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.rideSearchLiveTracking);
  }, [router]);

  const callDriver = useCallback(() => {
    Linking.openURL('tel:+919999999999').catch(() => {
      showAppAlert('Call', 'Unable to start a call right now.');
    });
  }, []);

  const chatDriver = useCallback(() => {
    router.push(
      getDriverChatPath({
        driverName: trip.driver.name,
        carModel: trip.driver.vehicleLabel.replace(/^White\s+/i, ''),
      }),
    );
  }, [router, trip.driver.name, trip.driver.vehicleLabel]);

  const openSafety = useCallback(() => {
    router.push(ROUTES.safetyHub);
  }, [router]);

  const triggerSos = useCallback(() => {
    router.push(ROUTES.emergencyAssistance);
  }, [router]);

  const completeTrip = useCallback(() => {
    resetTo(
      router,
      getTripCompletedPath({
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
    );
  }, [params, router]);

  return {
    trip,
    routeCoordinates,
    goBack,
    callDriver,
    chatDriver,
    openSafety,
    triggerSos,
    completeTrip,
  };
};
