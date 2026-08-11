import { useMemo } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { getSearchParam } from '@/shared/utils';
import type { DriverRideKind } from '../types';
import { parseDriverRideKind } from '../utils';

/** Reads `rideType` from the current route once for Assured / Regular branching. */
export const useDriverRideKind = (
  fallback: DriverRideKind = 'assured',
): DriverRideKind => {
  const params = useLocalSearchParams<{ rideType?: string }>();
  return useMemo(() => {
    const raw = getSearchParam(params.rideType);
    if (!raw) return fallback;
    return parseDriverRideKind(raw);
  }, [fallback, params.rideType]);
};
