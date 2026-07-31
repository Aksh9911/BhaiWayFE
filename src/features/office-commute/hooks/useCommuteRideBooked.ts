import { useCallback, useMemo } from 'react';
import { Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { getDriverChatPath, getLiveTrackingPath } from '@/features/ride-search/constants';
import { triggerLightHaptic } from '@/shared/utils';
import { COMMUTE_RIDE_BOOKED_SCREEN } from '../constants/commute-ride-booked.constants';

export interface UseCommuteRideBookedParams {
  rideId: string;
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

export interface CommuteBookedDetails {
  rideId: string;
  driverName: string;
  driverRating: number;
  driverAvatarUri: string;
  vehicleLabel: string;
  dateLabel: string;
  timeLabel: string;
  pickupTitle: string;
  pickupAddress: string;
  dropoffTitle: string;
  dropoffAddress: string;
  etaMinutes: number;
  mapImageUri: string;
}

export interface UseCommuteRideBookedResult {
  details: CommuteBookedDetails;
  openNotifications: () => void;
  messageDriver: () => void;
  callDriver: () => void;
  trackRide: () => void;
  openRideOptions: () => void;
}

export const useCommuteRideBooked = (
  params: UseCommuteRideBookedParams,
): UseCommuteRideBookedResult => {
  const router = useRouter();

  const details = useMemo<CommuteBookedDetails>(() => {
    const pickupTitle =
      params.origin?.trim() || COMMUTE_RIDE_BOOKED_SCREEN.defaultPickupTitle;
    const dropoffTitle =
      params.destination?.trim() || COMMUTE_RIDE_BOOKED_SCREEN.defaultDropoffTitle;

    return {
      rideId: params.rideId,
      driverName: params.driverName?.trim() || COMMUTE_RIDE_BOOKED_SCREEN.defaultDriverName,
      driverRating: COMMUTE_RIDE_BOOKED_SCREEN.defaultDriverRating,
      driverAvatarUri: COMMUTE_RIDE_BOOKED_SCREEN.driverAvatarUri,
      vehicleLabel: params.carModel?.trim() || COMMUTE_RIDE_BOOKED_SCREEN.defaultVehicle,
      dateLabel: COMMUTE_RIDE_BOOKED_SCREEN.defaultDateLabel,
      timeLabel: COMMUTE_RIDE_BOOKED_SCREEN.defaultTimeLabel,
      pickupTitle,
      pickupAddress: COMMUTE_RIDE_BOOKED_SCREEN.defaultPickupAddress,
      dropoffTitle,
      dropoffAddress: COMMUTE_RIDE_BOOKED_SCREEN.defaultDropoffAddress,
      etaMinutes: COMMUTE_RIDE_BOOKED_SCREEN.driverEtaMinutes,
      mapImageUri: COMMUTE_RIDE_BOOKED_SCREEN.mapImageUri,
    };
  }, [params.carModel, params.destination, params.driverName, params.origin, params.rideId]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const messageDriver = useCallback(() => {
    triggerLightHaptic();
    router.push(
      getDriverChatPath({
        driverName: details.driverName,
        carModel: details.vehicleLabel,
      }),
    );
  }, [details.driverName, details.vehicleLabel, router]);

  const callDriver = useCallback(() => {
    triggerLightHaptic();
    Linking.openURL('tel:+919999999999').catch(() => {
      Alert.alert('Call', 'Unable to start a call right now.');
    });
  }, []);

  const trackRide = useCallback(() => {
    triggerLightHaptic();
    router.push(
      getLiveTrackingPath({
        rideId: details.rideId,
        rideType: 'regular',
        origin: details.pickupTitle,
        destination: details.dropoffTitle,
        driverName: details.driverName,
        carModel: details.vehicleLabel,
        price: params.price,
        originLat: params.originLat,
        originLng: params.originLng,
        destinationLat: params.destinationLat,
        destinationLng: params.destinationLng,
      }),
    );
  }, [details, params, router]);

  const openRideOptions = useCallback(() => {
    triggerLightHaptic();
    Alert.alert(
      COMMUTE_RIDE_BOOKED_SCREEN.optionsLabel,
      'Ride options and cancellation will be available soon.',
    );
  }, []);

  return {
    details,
    openNotifications,
    messageDriver,
    callDriver,
    trackRide,
    openRideOptions,
  };
};
