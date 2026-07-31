import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { delay, triggerLightHaptic } from '@/shared/utils';
import { getCommuteReviewBookingPath } from '../constants/commute-review-booking.constants';
import { MOCK_COMMUTE_RIDE_RESULTS } from '../constants/commute-ride-result.constants';
import type {
  CommuteRideResultItem,
  CommuteSearchSummary,
} from '../types/commute-ride-result.types';
import type { CommuteRequestState } from '../components/CommuteRideResultCard';

export interface UseCommuteRideResultParams {
  origin?: string;
  destination?: string;
  dateLabel?: string;
  timeLabel?: string;
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
  const [requestStates, setRequestStates] = useState<Record<string, CommuteRequestState>>({});
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const summary = useMemo<CommuteSearchSummary>(
    () => ({
      origin: params.origin?.trim() || 'Cyber City',
      destination: params.destination?.trim() || 'Noida Sector 62',
      dateLabel: params.dateLabel?.trim() || 'Today',
      timeLabel: params.timeLabel?.trim() || '06:30 PM',
    }),
    [params.dateLabel, params.destination, params.origin, params.timeLabel],
  );

  const rides = MOCK_COMMUTE_RIDE_RESULTS;

  useEffect(() => {
    setLoading(true);
    loadTimerRef.current = setTimeout(() => setLoading(false), 700);
    return () => {
      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }
    };
  }, [summary.origin, summary.destination, summary.dateLabel, summary.timeLabel]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    void delay(600).then(() => setRefreshing(false));
  }, []);

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
