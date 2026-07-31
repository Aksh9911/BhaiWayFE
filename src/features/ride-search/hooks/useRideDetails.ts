import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { getCancelRidePath, getRideDetailsMock } from '../constants';
import { fetchDrivingRoute } from '../services';
import type { MapCoordinate, RideDetailsData, RideType } from '../types';

export interface UseRideDetailsParams {
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

export interface UseRideDetailsResult {
  details: RideDetailsData;
  routeCoordinates: MapCoordinate[];
  cancelRide: () => void;
  chatPassenger: (name: string) => void;
  goHome: () => void;
  openMore: () => void;
}

export const useRideDetails = (params: UseRideDetailsParams): UseRideDetailsResult => {
  const router = useRouter();

  const details = useMemo(
    () =>
      getRideDetailsMock({
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
    [params],
  );

  const [routeCoordinates, setRouteCoordinates] = useState<MapCoordinate[]>([
    { latitude: details.pickup.latitude, longitude: details.pickup.longitude },
    { latitude: details.dropoff.latitude, longitude: details.dropoff.longitude },
  ]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const route = await fetchDrivingRoute(
        { latitude: details.pickup.latitude, longitude: details.pickup.longitude },
        { latitude: details.dropoff.latitude, longitude: details.dropoff.longitude },
      );
      if (!cancelled) {
        setRouteCoordinates(route.coordinates);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [
    details.dropoff.latitude,
    details.dropoff.longitude,
    details.pickup.latitude,
    details.pickup.longitude,
  ]);

  const cancelRide = useCallback(() => {
    router.push(
      getCancelRidePath({
        rideId: details.rideId,
        rideType: details.rideType,
        origin: details.pickup.address || details.pickup.title,
        destination: details.dropoff.address || details.dropoff.title,
      }),
    );
  }, [details, router]);

  const chatPassenger = useCallback((name: string) => {
    Alert.alert('Chat', `Chat with ${name} will be available soon.`);
  }, []);

  const goHome = useCallback(() => {
    router.replace(ROUTES.home);
  }, [router]);

  const openMore = useCallback(() => {
    Alert.alert('More', 'More ride actions will be available soon.');
  }, []);

  return {
    details,
    routeCoordinates,
    cancelRide,
    chatPassenger,
    goHome,
    openMore,
  };
};
