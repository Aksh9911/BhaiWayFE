import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { delay, triggerLightHaptic } from '@/shared/utils';
import {
  getCommutePaymentPath,
  getCommuteReviewBookingMock,
} from '../constants';
import type { CommuteReviewBookingData } from '../types/commute-review-booking.types';

export interface UseCommuteReviewBookingParams {
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

export interface UseCommuteReviewBookingResult {
  booking: CommuteReviewBookingData;
  routeCoordinates: Array<{ latitude: number; longitude: number }>;
  promoInput: string;
  promoApplied: boolean;
  confirming: boolean;
  setPromoInput: (value: string) => void;
  applyPromo: () => void;
  confirmBooking: () => void;
  goBack: () => void;
  openProfile: () => void;
}

const PROMO_CODE = 'BHAIWAY10';
const PROMO_DISCOUNT = 20;

export const useCommuteReviewBooking = (
  params: UseCommuteReviewBookingParams,
): UseCommuteReviewBookingResult => {
  const router = useRouter();
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const baseBooking = useMemo(
    () =>
      getCommuteReviewBookingMock({
        rideId: params.rideId,
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

  const booking = useMemo(() => {
    if (!promoApplied) {
      return baseBooking;
    }
    const promoDiscount = PROMO_DISCOUNT;
    const total = Math.max(
      0,
      baseBooking.fare.baseFare +
        baseBooking.fare.platformFee +
        baseBooking.fare.taxes -
        promoDiscount,
    );
    return {
      ...baseBooking,
      fare: {
        ...baseBooking.fare,
        promoDiscount,
        total,
      },
    };
  }, [baseBooking, promoApplied]);

  const routeCoordinates = useMemo(
    () => [
      {
        latitude: booking.pickup.latitude,
        longitude: booking.pickup.longitude,
      },
      {
        latitude: booking.dropoff.latitude,
        longitude: booking.dropoff.longitude,
      },
    ],
    [booking.dropoff.latitude, booking.dropoff.longitude, booking.pickup.latitude, booking.pickup.longitude],
  );

  const applyPromo = useCallback(() => {
    triggerLightHaptic();
    if (promoInput.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      return;
    }
    setPromoApplied(false);
  }, [promoInput]);

  const confirmBooking = useCallback(() => {
    if (confirming) {
      return;
    }
    triggerLightHaptic();
    setConfirming(true);
    void delay(900).then(() => {
      setConfirming(false);
      router.push(
        getCommutePaymentPath({
          rideId: booking.rideId,
          origin: booking.pickup.label,
          destination: booking.dropoff.label,
          driverName: booking.driverName,
          carModel: booking.carModel,
          price: booking.fare.total,
          originLat: booking.pickup.latitude,
          originLng: booking.pickup.longitude,
          destinationLat: booking.dropoff.latitude,
          destinationLng: booking.dropoff.longitude,
        }),
      );
    });
  }, [booking, confirming, router]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.officeCommuteResult);
  }, [router]);

  const openProfile = useCallback(() => {
    router.push(ROUTES.profile);
  }, [router]);

  return {
    booking,
    routeCoordinates,
    promoInput,
    promoApplied,
    confirming,
    setPromoInput,
    applyPromo,
    confirmBooking,
    goBack,
    openProfile,
  };
};
