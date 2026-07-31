import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Share } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  getLiveTrackingMock,
  getDriverChatPath,
  getOngoingTripPath,
  LIVE_TRACKING_SCREEN,
} from '../constants';
import { fetchDrivingRoute } from '../services';
import type { LiveTrackingData, MapCoordinate, RideType } from '../types';

export interface UseLiveTrackingParams {
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

export interface UseLiveTrackingResult {
  tracking: LiveTrackingData;
  routeCoordinates: MapCoordinate[];
  otpDigits: string[];
  goBack: () => void;
  openNotifications: () => void;
  shareTrip: () => void;
  explainOtp: () => void;
  openOngoingTrip: () => void;
  callDriver: () => void;
  chatDriver: () => void;
  openSupport: () => void;
}

export const useLiveTracking = (params: UseLiveTrackingParams): UseLiveTrackingResult => {
  const router = useRouter();
  const [routeCoordinates, setRouteCoordinates] = useState<MapCoordinate[]>([]);

  const tracking = useMemo(
    () =>
      getLiveTrackingMock({
        rideId: params.rideId,
        rideType: params.rideType,
        origin: params.origin,
        destination: params.destination,
        driverName: params.driverName,
        carModel: params.carModel,
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
      params.rideId,
      params.rideType,
    ],
  );

  const otpDigits = useMemo(
    () => tracking.startOtp.padEnd(4, '0').slice(0, 4).split(''),
    [tracking.startOtp],
  );

  useEffect(() => {
    let cancelled = false;

    const loadRoute = async () => {
      try {
        const route = await fetchDrivingRoute(tracking.pickup, tracking.dropoff);
        if (!cancelled && route.coordinates.length >= 2) {
          setRouteCoordinates(route.coordinates);
        }
      } catch {
        if (!cancelled) {
          setRouteCoordinates([tracking.pickup, tracking.dropoff]);
        }
      }
    };

    loadRoute();
    return () => {
      cancelled = true;
    };
  }, [tracking.dropoff, tracking.pickup]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.rideSearchBooked);
  }, [router]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const shareTrip = useCallback(() => {
    Share.share({
      message: LIVE_TRACKING_SCREEN.shareTripMessage(
        tracking.driver.name,
        tracking.etaMinutes,
        tracking.startOtp,
      ),
    }).catch(() => {
      Alert.alert(
        LIVE_TRACKING_SCREEN.shareTripLabel,
        LIVE_TRACKING_SCREEN.shareTripMessage(
          tracking.driver.name,
          tracking.etaMinutes,
          tracking.startOtp,
        ),
      );
    });
  }, [tracking.driver.name, tracking.etaMinutes, tracking.startOtp]);

  const explainOtp = useCallback(() => {
    Alert.alert(LIVE_TRACKING_SCREEN.whyOtpTitle, LIVE_TRACKING_SCREEN.whyOtpMessage);
  }, []);

  const openOngoingTrip = useCallback(() => {
    router.push(
      getOngoingTripPath({
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

  const callDriver = useCallback(() => {
    Linking.openURL('tel:+919999999999').catch(() => {
      Alert.alert('Call', 'Unable to start a call right now.');
    });
  }, []);

  const chatDriver = useCallback(() => {
    router.push(
      getDriverChatPath({
        driverName: tracking.driver.name,
        carModel: tracking.driver.vehicleLabel.replace(/^White\s+/i, ''),
      }),
    );
  }, [router, tracking.driver.name, tracking.driver.vehicleLabel]);

  const openSupport = useCallback(() => {
    Alert.alert(LIVE_TRACKING_SCREEN.supportTitle, LIVE_TRACKING_SCREEN.supportMessage);
  }, []);

  return {
    tracking,
    routeCoordinates,
    otpDigits,
    goBack,
    openNotifications,
    shareTrip,
    explainOtp,
    openOngoingTrip,
    callDriver,
    chatDriver,
    openSupport,
  };
};
