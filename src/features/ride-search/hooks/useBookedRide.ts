import { useCallback, useMemo } from 'react';
import { Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  BOOKED_SCREEN,
  getBookedRideMock,
  getDriverChatPath,
  getLiveTrackingPath,
  getRideDetailsPath,
} from '../constants';
import type { BookedRideDetails, RideType } from '../types';

export interface UseBookedRideParams {
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

export interface UseBookedRideResult {
  details: BookedRideDetails;
  meetMessage: string;
  isAssured: boolean;
  addToCalendar: () => void;
  trackRide: () => void;
  viewRideDetails: () => void;
  chatDriver: () => void;
  callDriver: () => void;
  goHome: () => void;
}

export const useBookedRide = (params: UseBookedRideParams): UseBookedRideResult => {
  const router = useRouter();

  const details = useMemo(
    () =>
      getBookedRideMock({
        rideId: params.rideId,
        rideType: params.rideType,
        origin: params.origin,
        destination: params.destination,
        driverName: params.driverName,
        carModel: params.carModel,
      }),
    [
      params.carModel,
      params.destination,
      params.driverName,
      params.origin,
      params.rideId,
      params.rideType,
    ],
  );

  const meetMessage = useMemo(
    () => `${details.driverName.split(' ')[0]} will see you at ${details.meetTimeLabel}.`,
    [details.driverName, details.meetTimeLabel],
  );

  const addToCalendar = useCallback(() => {
    Alert.alert(BOOKED_SCREEN.addToCalendarLabel, 'Calendar sync will be available soon.');
  }, []);

  const trackRide = useCallback(() => {
    router.push(
      getLiveTrackingPath({
        rideId: details.rideId,
        rideType: details.rideType,
        origin: params.origin || details.pickup,
        destination: params.destination || details.dropoff,
        driverName: details.driverName,
        carModel: details.vehicle,
        price: params.price,
        originLat: params.originLat,
        originLng: params.originLng,
        destinationLat: params.destinationLat,
        destinationLng: params.destinationLng,
      }),
    );
  }, [details, params, router]);

  const viewRideDetails = useCallback(() => {
    router.push(
      getRideDetailsPath({
        rideId: details.rideId,
        rideType: details.rideType,
        origin: params.origin || details.pickup,
        destination: params.destination || details.dropoff,
        driverName: details.driverName,
        carModel: details.vehicle,
        price: params.price,
        originLat: params.originLat,
        originLng: params.originLng,
        destinationLat: params.destinationLat,
        destinationLng: params.destinationLng,
      }),
    );
  }, [details, params, router]);

  const chatDriver = useCallback(() => {
    router.push(
      getDriverChatPath({
        driverName: details.driverName,
        carModel: details.vehicle,
      }),
    );
  }, [details.driverName, details.vehicle, router]);

  const callDriver = useCallback(() => {
    Linking.openURL('tel:+919999999999').catch(() => {
      Alert.alert('Call', 'Unable to start a call right now.');
    });
  }, []);

  const goHome = useCallback(() => {
    router.replace(ROUTES.home);
  }, [router]);

  return {
    details,
    meetMessage,
    isAssured: details.rideType === 'assured',
    addToCalendar,
    trackRide,
    viewRideDetails,
    chatDriver,
    callDriver,
    goHome,
  };
};
