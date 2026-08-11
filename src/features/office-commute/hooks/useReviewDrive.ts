import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  fetchDrivingRoute,
  type RouteGeometry,
} from '@/features/ride-search/services';
import {
  formatDistanceLabel,
  haversineDistanceKm,
} from '@/features/ride-search/utils';
import type { MapCoordinate } from '@/features/ride-search/types';
import {
  DEFAULT_OFFICE_LOCATION,
  DEFAULT_START_LOCATION,
  formatDisplayTime,
  formatEstimatedEarnings,
  WEEKDAY_OPTIONS,
} from '../constants';
import { corporateVerificationStore, publishCommuteDraft } from '../store';
import { publishedCommuteStore } from '../store/publishedCommuteStore';
import type { PublishCommuteDraft } from '../types';

export interface UseReviewDriveResult {
  draft: PublishCommuteDraft;
  pickup: MapCoordinate;
  destination: MapCoordinate;
  routeCoordinates: MapCoordinate[];
  pickupLabel: string;
  destinationLabel: string;
  departureLabel: string;
  distanceLabel: string;
  durationLabel: string;
  routeLoading: boolean;
  estimatedEarnings: string;
  weekdays: typeof WEEKDAY_OPTIONS;
  publishing: boolean;
  isCorporateVerified: boolean;
  goBack: () => void;
  verifyIdentity: () => void;
  publishRide: () => void;
}

const fallbackRoute = (origin: MapCoordinate, destination: MapCoordinate): RouteGeometry => {
  const distanceKm = haversineDistanceKm(origin, destination);
  return {
    coordinates: [origin, destination],
    distanceKm,
    durationMinutes: Math.max(1, (distanceKm / 28) * 60),
    distanceLabel: formatDistanceLabel(distanceKm),
    durationLabel: `${Math.max(1, Math.round((distanceKm / 28) * 60))} min`,
  };
};

export const useReviewDrive = (): UseReviewDriveResult => {
  const router = useRouter();
  const [draft, setDraft] = useState<PublishCommuteDraft>(() => publishCommuteDraft.get());
  const [publishing, setPublishing] = useState(false);
  const [route, setRoute] = useState<RouteGeometry | null>(null);
  const [routeLoading, setRouteLoading] = useState(true);
  const [isCorporateVerified, setIsCorporateVerified] = useState(() =>
    corporateVerificationStore.isVerified(),
  );

  useEffect(() => publishCommuteDraft.subscribe(setDraft), []);
  useEffect(
    () =>
      corporateVerificationStore.subscribe((record) => {
        setIsCorporateVerified(record != null);
      }),
    [],
  );

  const pickupDetail = draft.startLocationDetail ?? DEFAULT_START_LOCATION;
  const destinationDetail = draft.officeLocationDetail ?? DEFAULT_OFFICE_LOCATION;

  const pickup = useMemo(
    () => ({
      latitude: pickupDetail.latitude,
      longitude: pickupDetail.longitude,
    }),
    [pickupDetail.latitude, pickupDetail.longitude],
  );

  const destination = useMemo(
    () => ({
      latitude: destinationDetail.latitude,
      longitude: destinationDetail.longitude,
    }),
    [destinationDetail.latitude, destinationDetail.longitude],
  );

  useEffect(() => {
    let cancelled = false;

    const loadRoute = async () => {
      setRouteLoading(true);
      try {
        const next = await fetchDrivingRoute(pickup, destination);
        if (!cancelled) {
          setRoute(next);
        }
      } catch {
        if (!cancelled) {
          setRoute(fallbackRoute(pickup, destination));
        }
      } finally {
        if (!cancelled) {
          setRouteLoading(false);
        }
      }
    };

    void loadRoute();

    return () => {
      cancelled = true;
    };
  }, [destination.latitude, destination.longitude, pickup.latitude, pickup.longitude]);

  const pickupLabel = draft.startLocation || pickupDetail.placeName || pickupDetail.address;
  const destinationLabel =
    draft.officeLocation || destinationDetail.placeName || destinationDetail.address;

  const departureLabel = formatDisplayTime(draft.departureTime);

  const resolvedRoute = route ?? fallbackRoute(pickup, destination);
  const routeCoordinates = resolvedRoute.coordinates;
  const distanceLabel = resolvedRoute.distanceLabel;
  const durationLabel = resolvedRoute.durationLabel;

  const estimatedEarnings = useMemo(
    () => formatEstimatedEarnings(draft.pricePerSeat, draft.seats),
    [draft.pricePerSeat, draft.seats],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.officeCommutePublish);
  }, [router]);

  const verifyIdentity = useCallback(() => {
    router.push(ROUTES.officeCommuteVerify);
  }, [router]);

  const publishRide = useCallback(() => {
    if (publishing) {
      return;
    }

    setPublishing(true);

    setTimeout(() => {
      publishedCommuteStore.set({
        pickupLabel,
        dropoffLabel: destinationLabel,
        departureLabel,
        seats: draft.seats,
        pricePerSeat: draft.pricePerSeat,
        recurringDays: [...draft.recurringDays],
      });
      publishCommuteDraft.reset();
      setPublishing(false);
      router.replace(ROUTES.officeCommutePublished);
    }, 1200);
  }, [
    departureLabel,
    destinationLabel,
    draft.pricePerSeat,
    draft.recurringDays,
    draft.seats,
    pickupLabel,
    publishing,
    router,
  ]);

  return {
    draft,
    pickup,
    destination,
    routeCoordinates,
    pickupLabel,
    destinationLabel,
    departureLabel,
    distanceLabel,
    durationLabel,
    routeLoading,
    estimatedEarnings,
    weekdays: WEEKDAY_OPTIONS,
    publishing,
    isCorporateVerified,
    goBack,
    verifyIdentity,
    publishRide,
  };
};
