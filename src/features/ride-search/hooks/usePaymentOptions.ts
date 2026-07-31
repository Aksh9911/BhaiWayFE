import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { getBookedPath, PAYMENT_SCREEN } from '../constants';
import type { PaymentMethodId, RideType } from '../types';

export interface UsePaymentOptionsParams {
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
  /** When set, Continue navigates here instead of /ride-search/booked. */
  successPath?: '/ride-search/booked' | '/office-commute/booked';
}

export interface UsePaymentOptionsResult {
  selectedId: PaymentMethodId;
  setSelectedId: (id: PaymentMethodId) => void;
  continuePayment: () => void;
  onAddUpi: () => void;
  onAddCard: () => void;
  onSeeAllBanks: () => void;
}

export const usePaymentOptions = (
  params: UsePaymentOptionsParams,
): UsePaymentOptionsResult => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<PaymentMethodId>('wallet');

  const continuePayment = useCallback(() => {
    if (params.successPath) {
      router.push({
        pathname: params.successPath,
        params: {
          rideId: params.rideId,
          rideType: params.rideType,
          origin: params.origin ?? '',
          destination: params.destination ?? '',
          driverName: params.driverName ?? '',
          carModel: params.carModel ?? '',
          price: params.price != null ? String(params.price) : '',
          originLat: params.originLat != null ? String(params.originLat) : '',
          originLng: params.originLng != null ? String(params.originLng) : '',
          destinationLat: params.destinationLat != null ? String(params.destinationLat) : '',
          destinationLng: params.destinationLng != null ? String(params.destinationLng) : '',
        },
      });
      return;
    }

    router.push(
      getBookedPath({
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

  const onAddUpi = useCallback(() => {
    Alert.alert(PAYMENT_SCREEN.addUpiLabel, 'Add UPI will be available soon.');
  }, []);

  const onAddCard = useCallback(() => {
    Alert.alert(PAYMENT_SCREEN.addCardLabel, 'Add card will be available soon.');
  }, []);

  const onSeeAllBanks = useCallback(() => {
    Alert.alert(PAYMENT_SCREEN.seeAllBanksLabel, 'All banks list will be available soon.');
  }, []);

  return {
    selectedId,
    setSelectedId,
    continuePayment,
    onAddUpi,
    onAddCard,
    onSeeAllBanks,
  };
};
