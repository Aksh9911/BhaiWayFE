import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { publishedRidesSheetStore, publishedRidesSheetSync } from '@/DemoData';
import { delay, triggerLightHaptic } from '@/shared/utils';
import { getCommuteReviewBookingPath } from '../constants/commute-review-booking.constants';
import { corporateVerificationStore } from '../store';
import type {
  CommuteRideResultItem,
  CommuteSearchSummary,
} from '../types/commute-ride-result.types';
import { getPublishedRidesForCommuteSearch } from '../utils';
import type { CommuteRequestState } from '../components/CommuteRideResultCard';

export interface UseCommuteRideResultParams {
  origin?: string;
  destination?: string;
  dateLabel?: string;
  timeLabel?: string;
  sameOrganizationOnly?: boolean;
  originLat?: number;
  originLng?: number;
  destinationLat?: number;
  destinationLng?: number;
}

export interface UseCommuteRideResultResult {
  summary: CommuteSearchSummary;
  rides: readonly CommuteRideResultItem[];
  loading: boolean;
  refreshing: boolean;
  requestStates: Record<string, CommuteRequestState>;
  refresh: () => void;
  editSearch: () => void;
  requestToJoin: (ride: CommuteRideResultItem) => void;
  goBack: () => void;
  openProfile: () => void;
}

export const useCommuteRideResult = (
  params: UseCommuteRideResultParams,
): UseCommuteRideResultResult => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sourceRides, setSourceRides] = useState<CommuteRideResultItem[]>([]);
  const [publishedVersion, setPublishedVersion] = useState(0);
  const [requestStates, setRequestStates] = useState<Record<string, CommuteRequestState>>({});
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedCompany = corporateVerificationStore
    .get()
    ?.companyName.trim()
    .toLowerCase();

  const summary = useMemo<CommuteSearchSummary>(
    () => ({
      origin: params.origin?.trim() || 'Cyber City',
      destination: params.destination?.trim() || 'Noida Sector 62',
      dateLabel: params.dateLabel?.trim() || 'Today',
      timeLabel: params.timeLabel?.trim() || '06:30 PM',
      sameOrganizationOnly: params.sameOrganizationOnly === true,
    }),
    [params.dateLabel, params.destination, params.origin, params.sameOrganizationOnly, params.timeLabel],
  );

  useEffect(
    () =>
      publishedRidesSheetStore.subscribe(() => {
        setPublishedVersion((value) => value + 1);
      }),
    [],
  );

  const loadRides = useCallback(
    (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }

      let cancelled = false;
      loadTimerRef.current = setTimeout(() => {
        void (async () => {
          if (isRefresh) {
            try {
              await publishedRidesSheetSync.pullIntoLocal();
            } catch (error) {
              console.log('[Commute search] published rides pull skipped', error);
            }
          }

          if (cancelled) {
            return;
          }

          setSourceRides(getPublishedRidesForCommuteSearch());
          setLoading(false);
          setRefreshing(false);
        })();
      }, isRefresh ? 400 : 700);

      return () => {
        cancelled = true;
        if (loadTimerRef.current) {
          clearTimeout(loadTimerRef.current);
        }
      };
    },
    [],
  );

  useEffect(() => {
    const cleanup = loadRides(false);
    return cleanup;
  }, [loadRides, publishedVersion, summary.origin, summary.destination, summary.dateLabel, summary.timeLabel]);

  const rides = useMemo(() => {
    if (!summary.sameOrganizationOnly || !normalizedCompany) {
      return sourceRides;
    }
    return sourceRides.filter(
      (ride) => ride.organization.trim().toLowerCase() === normalizedCompany,
    );
  }, [normalizedCompany, sourceRides, summary.sameOrganizationOnly]);

  const refresh = useCallback(() => {
    loadRides(true);
  }, [loadRides]);

  const editSearch = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.officeCommuteSearch);
  }, [router]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.officeCommuteSearch);
  }, [router]);

  const openProfile = useCallback(() => {
    router.push(ROUTES.profile);
  }, [router]);

  const requestToJoin = useCallback(
    (ride: CommuteRideResultItem) => {
      triggerLightHaptic();
      setRequestStates((prev) => ({ ...prev, [ride.id]: 'requesting' }));

      void delay(400).then(() => {
        setRequestStates((prev) => ({ ...prev, [ride.id]: 'idle' }));
        router.push(
          getCommuteReviewBookingPath({
            rideId: ride.id,
            origin: summary.origin,
            destination: summary.destination,
            driverName: ride.driver.name,
            carModel: `${ride.carModel} • ${ride.vehicleColor}`,
            price: ride.price,
            originLat: params.originLat,
            originLng: params.originLng,
            destinationLat: params.destinationLat,
            destinationLng: params.destinationLng,
          }),
        );
      });
    },
    [
      params.destinationLat,
      params.destinationLng,
      params.originLat,
      params.originLng,
      router,
      summary.destination,
      summary.origin,
    ],
  );

  return {
    summary,
    rides,
    loading,
    refreshing,
    requestStates,
    refresh,
    editSearch,
    requestToJoin,
    goBack,
    openProfile,
  };
};
