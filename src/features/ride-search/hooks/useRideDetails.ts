import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { showAppAlert } from '@/store';

import { ROUTES } from '@/config';
import {
  getCancelRidePath,
  getDriverChatPath,
  getReviewBookingPath,
  getRideDetailsMock,
} from '../constants';
import { fetchDrivingRoute } from '../services';
import type {
  MapCoordinate,
  RideDetailsData,
  RideDetailsMode,
  RideType,
} from '../types';

export interface UseRideDetailsParams {
  rideId: string;
  rideType: RideType;
  mode?: RideDetailsMode;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
  distanceLabel?: string;
  durationLabel?: string;
  dateLabel?: string;
  departureTime?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}

export interface UseRideDetailsResult {
  details: RideDetailsData;
  mode: RideDetailsMode;
  isPreview: boolean;
  routeCoordinates: MapCoordinate[];
  bookRide: () => void;
  contactDriver: () => void;
  cancelRide: () => void;
  chatPassenger: (name: string) => void;
  goHome: () => void;
  openMore: () => void;
}

export const useRideDetails = (params: UseRideDetailsParams): UseRideDetailsResult => {
  const router = useRouter();
  const mode: RideDetailsMode = params.mode === 'booked' ? 'booked' : 'preview';

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
        distanceLabel: params.distanceLabel,
        durationLabel: params.durationLabel,
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

  const bookRide = useCallback(() => {
    router.push(
      getReviewBookingPath({
        rideId: details.rideId,
        rideType: details.rideType,
        origin: params.origin || details.pickup.address || details.pickup.title,
        destination: params.destination || details.dropoff.address || details.dropoff.title,
        driverName: details.driver.name,
        carModel: details.driver.vehicleModel,
        price: details.fare.total,
        dateLabel: params.dateLabel,
        departureTime: params.departureTime,
        originLat: params.originLat ?? details.pickup.latitude,
        originLng: params.originLng ?? details.pickup.longitude,
        destinationLat: params.destinationLat ?? details.dropoff.latitude,
        destinationLng: params.destinationLng ?? details.dropoff.longitude,
      }),
    );
  }, [details, params, router]);

  const contactDriver = useCallback(() => {
    router.push(
      getDriverChatPath({
        driverName: details.driver.name,
        carModel: details.driver.vehicleModel,
      }),
    );
  }, [details.driver.name, details.driver.vehicleModel, router]);

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
    showAppAlert('Chat', `Chat with ${name} will be available soon.`);
  }, []);

  const goHome = useCallback(() => {
    router.replace(ROUTES.home);
  }, [router]);

  const openMore = useCallback(() => {
    showAppAlert('More', 'More ride actions will be available soon.');
  }, []);

  return {
    details,
    mode,
    isPreview: mode === 'preview',
    routeCoordinates,
    bookRide,
    contactDriver,
    cancelRide,
    chatPassenger,
    goHome,
    openMore,
  };
};
