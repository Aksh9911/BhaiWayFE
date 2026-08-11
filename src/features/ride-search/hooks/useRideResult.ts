import { useCallback, useEffect, useMemo, useState } from 'react';

import { publishedRidesSheetStore, publishedRidesSheetSync } from '@/DemoData';
import { useSearchRidesQuery } from '@/services/api';

import type { RideTypeTabId } from '../components/ResultFilterChips';
import { departureTimeToMinutes, getPassengerLabel } from '../constants';
import type { RideResultItem, RideResultSortId, RideSearchSummary } from '../types';

const shortPlaceName = (value: string): string => {
  const segment = value.split(',')[0]?.trim();
  return segment && segment.length > 0 ? segment : value;
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

  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<RideTypeTabId>('regular');
  const [sortId, setSortId] = useState<RideResultSortId>('price-asc');

  const { data, isLoading, isFetching, refetch } = useSearchRidesQuery({
    from: params.origin,
    destination: params.destination,
    date: params.dateLabel,
    passengers,
  });

  useEffect(
    () =>
      publishedRidesSheetStore.subscribe(() => {
        void refetch();
      }),
    [refetch],
  );

  const sourceRides = data?.rides ?? [];

  const rides = useMemo(() => {
    const filtered = sourceRides.filter((ride) => ride.rideType === activeFilter);
    return sortRides(filtered, sortId);
  }, [activeFilter, sortId, sourceRides]);

  const refresh = useCallback(() => {
    setRefreshing(true);
    void (async () => {
      try {
        await publishedRidesSheetSync.pullIntoLocal();
      } catch (error) {
        console.log('[Ride search] published rides pull skipped', error);
      }
      await refetch();
      setRefreshing(false);
    })();
  }, [refetch]);

  useEffect(() => {
    if (!isFetching) {
      setRefreshing(false);
    }
  }, [isFetching]);

  return {
    summary,
    rides,
    totalCount: rides.length,
    loading: isLoading && !data,
    refreshing: refreshing || (isFetching && !!data),
    activeFilter,
    setActiveFilter,
    sortId,
    setSortId,
    refresh,
  };
};
