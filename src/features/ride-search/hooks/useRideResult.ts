import { useCallback, useEffect, useMemo, useState } from 'react';

import type { RideTypeTabId } from '../components/ResultFilterChips';
import {
  getPassengerLabel,
  MOCK_RIDE_RESULTS,
} from '../constants';
import type { RideResultItem, RideSearchSummary } from '../types';

const shortPlaceName = (value: string): string => {
  const segment = value.split(',')[0]?.trim();
  return segment && segment.length > 0 ? segment : value;
};

export interface UseRideResultParams {
  origin?: string;
  destination?: string;
  dateLabel?: string;
  passengers?: string | number;
}

export interface UseRideResultResult {
  summary: RideSearchSummary;
  rides: RideResultItem[];
  totalCount: number;
  loading: boolean;
  refreshing: boolean;
  activeFilter: RideTypeTabId;
  setActiveFilter: (id: RideTypeTabId) => void;
  refresh: () => void;
}

export const useRideResult = (params: UseRideResultParams): UseRideResultResult => {
  const passengers = Math.max(1, Number(params.passengers) || 1);

  const summary = useMemo<RideSearchSummary>(
    () => ({
      originCity: shortPlaceName(params.origin || 'Bengaluru'),
      destinationCity: shortPlaceName(params.destination || 'Mumbai'),
      dateLabel: params.dateLabel || 'Today',
      passengers,
      passengerLabel: getPassengerLabel(passengers),
    }),
    [params.dateLabel, params.destination, params.origin, passengers],
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sourceRides, setSourceRides] = useState<RideResultItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<RideTypeTabId>('regular');

  const loadRides = useCallback(
    (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const timer = setTimeout(() => {
        const withRoute = MOCK_RIDE_RESULTS.map((ride) => ({
          ...ride,
          originCity: shortPlaceName(params.origin || ride.originCity),
          destinationCity: shortPlaceName(params.destination || ride.destinationCity),
        }));
        setSourceRides(withRoute);
        setLoading(false);
        setRefreshing(false);
      }, isRefresh ? 600 : 900);

      return () => clearTimeout(timer);
    },
    [params.destination, params.origin],
  );

  useEffect(() => {
    const cleanup = loadRides(false);
    return cleanup;
  }, [loadRides]);

  const rides = useMemo(
    () => sourceRides.filter((ride) => ride.rideType === activeFilter),
    [activeFilter, sourceRides],
  );

  const refresh = useCallback(() => {
    loadRides(true);
  }, [loadRides]);

  return {
    summary,
    rides,
    totalCount: rides.length,
    loading,
    refreshing,
    activeFilter,
    setActiveFilter,
    refresh,
  };
};
