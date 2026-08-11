import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { showAppAlert } from '@/store';

import {
  DEFAULT_PROMO_CODE,
  DEFAULT_PROMO_DISCOUNT,
  getPaymentPath,
  getReviewBookingMock,
} from '../constants';
import { fetchDrivingRoute, type RouteGeometry } from '../services';
import type { MapCoordinate, ReviewBookingData, RideType } from '../types';

export interface UseReviewBookingParams {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
  driverName?: string;
  carModel?: string;
  price?: number;
  dateLabel?: string;
  departureTime?: string;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}

export interface UseReviewBookingResult {
  booking: ReviewBookingData;
  routeCoordinates: MapCoordinate[];
  promoInput: string;
  promoApplied: boolean;
  setPromoInput: (value: string) => void;
  applyPromo: () => void;
  confirmBooking: () => void;
}

const parseCoordinate = (
  latitude?: number,
  longitude?: number,
): MapCoordinate | null => {
  if (
    latitude == null ||
    longitude == null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude)
  ) {
    return null;
  }
  if (latitude === 0 && longitude === 0) {
    return null;
  }
  return { latitude, longitude };
};

export const useReviewBooking = (params: UseReviewBookingParams): UseReviewBookingResult => {
  const router = useRouter();

  const pickupCoord = useMemo(
    () => parseCoordinate(params.originLat, params.originLng),
    [params.originLat, params.originLng],
  );
  const dropoffCoord = useMemo(
    () => parseCoordinate(params.destinationLat, params.destinationLng),
    [params.destinationLat, params.destinationLng],
  );

  const bookingBase = useMemo(() => {
    const data = getReviewBookingMock(params.rideId, params.rideType);
    const pickupAddress = params.origin || data.pickup.address;
    const dropoffAddress = params.destination || data.dropoff.address;
    const driverName = params.driverName || data.driver.name;
    const driverSubtitle = params.carModel || data.driver.subtitle;

    let fare = { ...data.fare };
    if (params.price != null && params.price > 0) {
      fare = {
        ...fare,
        rideFare: params.price,
        total: params.price + fare.platformFee + fare.assuredFee - fare.promoDiscount,
      };
    }

    return {
      ...data,
      pickup: {
        ...data.pickup,
        address: pickupAddress,
        latitude: pickupCoord?.latitude ?? data.pickup.latitude,
        longitude: pickupCoord?.longitude ?? data.pickup.longitude,
      },
      dropoff: {
        ...data.dropoff,
        address: dropoffAddress,
        latitude: dropoffCoord?.latitude ?? data.dropoff.latitude,
        longitude: dropoffCoord?.longitude ?? data.dropoff.longitude,
      },
      driver: {
        ...data.driver,
        name: driverName,
        subtitle: driverSubtitle,
      },
      fare,
    };
  }, [
    dropoffCoord,
    params.carModel,
    params.destination,
    params.driverName,
    params.origin,
    params.price,
    params.rideId,
    params.rideType,
    pickupCoord,
  ]);

  const [route, setRoute] = useState<RouteGeometry | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadRoute = async () => {
      const origin = {
        latitude: bookingBase.pickup.latitude,
        longitude: bookingBase.pickup.longitude,
      };
      const destination = {
        latitude: bookingBase.dropoff.latitude,
        longitude: bookingBase.dropoff.longitude,
      };

      const next = await fetchDrivingRoute(origin, destination);
      if (!cancelled) {
        setRoute(next);
      }
    };

    void loadRoute();

    return () => {
      cancelled = true;
    };
  }, [
    bookingBase.dropoff.latitude,
    bookingBase.dropoff.longitude,
    bookingBase.pickup.latitude,
    bookingBase.pickup.longitude,
  ]);

  const fare = useMemo(() => {
    if (!promoApplied) {
      return {
        ...bookingBase.fare,
        promoDiscount: 0,
        total: bookingBase.fare.rideFare + bookingBase.fare.platformFee + bookingBase.fare.assuredFee,
      };
    }

    const promoDiscount = DEFAULT_PROMO_DISCOUNT;
    return {
      ...bookingBase.fare,
      promoDiscount,
      total:
        bookingBase.fare.rideFare +
        bookingBase.fare.platformFee +
        bookingBase.fare.assuredFee -
        promoDiscount,
    };
  }, [bookingBase.fare, promoApplied]);

  const booking = useMemo(
    () => ({
      ...bookingBase,
      promoCode: promoInput,
      fare,
      distanceLabel: route?.distanceLabel ?? bookingBase.distanceLabel,
      durationLabel: route?.durationLabel ?? bookingBase.durationLabel,
    }),
    [bookingBase, fare, promoInput, route],
  );

  const routeCoordinates = useMemo(
    () =>
      route?.coordinates ?? [
        { latitude: booking.pickup.latitude, longitude: booking.pickup.longitude },
        { latitude: booking.dropoff.latitude, longitude: booking.dropoff.longitude },
      ],
    [booking.dropoff.latitude, booking.dropoff.longitude, booking.pickup.latitude, booking.pickup.longitude, route],
  );

  const applyPromo = useCallback(() => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      showAppAlert('Promo required', 'Please enter a promo code.');
      return;
    }
    if (code === DEFAULT_PROMO_CODE) {
      setPromoApplied(true);
      return;
    }
    setPromoApplied(false);
    showAppAlert('Invalid promo', 'Please enter a valid promo code.');
  }, [promoInput]);

  const confirmBooking = useCallback(() => {
    router.push(
      getPaymentPath({
        rideId: booking.rideId,
        rideType: booking.rideType,
        origin: booking.pickup.address,
        destination: booking.dropoff.address,
        driverName: booking.driver.name,
        carModel: booking.driver.subtitle,
        price: fare.total,
        assuredFee: fare.assuredFee,
        dateLabel: params.dateLabel,
        departureTime: params.departureTime,
        originLat: booking.pickup.latitude,
        originLng: booking.pickup.longitude,
        destinationLat: booking.dropoff.latitude,
        destinationLng: booking.dropoff.longitude,
      }),
    );
  }, [booking, fare.assuredFee, fare.total, params.dateLabel, params.departureTime, router]);

  return {
    booking,
    routeCoordinates,
    promoInput,
    promoApplied,
    setPromoInput,
    applyPromo,
    confirmBooking,
  };
};
