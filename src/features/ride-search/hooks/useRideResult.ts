import { useCallback, useEffect, useMemo, useState } from 'react';

import type { RideTypeTabId } from '../components/ResultFilterChips';
import {
  departureTimeToMinutes,
  getPassengerLabel,
  MOCK_RIDE_RESULTS,
} from '../constants';
import type { RideResultItem, RideResultSortId, RideSearchSummary } from '../types';

const shortPlaceName = (value: string): string => {
  const segment = value.split(',')[0]?.trim();
  return segment && segment.length > 0 ? segment : value;
};

const matchesSearch = (ride: RideResultItem, query: string): boolean => {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return (
    ride.driver.name.toLowerCase().includes(q) ||
    ride.carModel.toLowerCase().includes(q) ||
    ride.originCity.toLowerCase().includes(q) ||
    ride.destinationCity.toLowerCase().includes(q)
  );
};

const sortRides = (rides: RideResultItem[], sortId: RideResultSortId): RideResultItem[] => {
  const next = [...rides];
  switch (sortId) {
    case 'price-asc':
      return next.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return next.sort((a, b) => b.price - a.price);
    case 'departure':
      return next.sort(
        (a, b) => departureTimeToMinutes(a.departureTime) - departureTimeToMinutes(b.departureTime),
      );
    case 'rating':
      return next.sort((a, b) => b.driver.rating - a.driver.rating);
    case 'duration':
      return next.sort((a, b) => a.durationMinutes - b.durationMinutes);
    default:
      return next;
  }
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
  sortId: RideResultSortId;
  setSortId: (id: RideResultSortId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
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
  const [sortId, setSortId] = useState<RideResultSortId>('price-asc');
  const [searchQuery, setSearchQuery] = useState('');

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

  const rides = useMemo(() => {
    const filtered = sourceRides
      .filter((ride) => ride.rideType === activeFilter)
      .filter((ride) => matchesSearch(ride, searchQuery));
    return sortRides(filtered, sortId);
  }, [activeFilter, searchQuery, sortId, sourceRides]);

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
    sortId,
    setSortId,
    searchQuery,
    setSearchQuery,
    refresh,
  };
};
