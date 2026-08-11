import { useCallback, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { getSearchParam, resetTo, triggerLightHaptic } from '@/shared/utils';
import { getRatingsSubmittedMock } from '../constants';
import type { RatingsSubmittedItem, RatingsSubmittedSummary } from '../types';

const parseItems = (raw: string | undefined): RatingsSubmittedItem[] | undefined => {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as RatingsSubmittedItem[];
    if (!Array.isArray(parsed)) return undefined;
    return parsed
      .filter(
        (item) =>
          item &&
          typeof item.id === 'string' &&
          typeof item.name === 'string' &&
          typeof item.rating === 'number',
      )
      .map((item) => ({
        id: item.id,
        name: item.name,
        avatarUri: typeof item.avatarUri === 'string' ? item.avatarUri : '',
        rating: Math.min(5, Math.max(0, Math.round(item.rating))),
      }));
  } catch {
    return undefined;
  }
};

export interface UseRatingsSubmittedResult {
  summary: RatingsSubmittedSummary;
  goToDashboard: () => void;
  contactSupport: () => void;
  close: () => void;
}

export const useRatingsSubmitted = (): UseRatingsSubmittedResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{ rideId?: string; items?: string }>();

  const summary = useMemo(
    () =>
      getRatingsSubmittedMock({
        rideId: getSearchParam(params.rideId) || undefined,
        items: parseItems(getSearchParam(params.items) || undefined),
      }),
    [params.items, params.rideId],
  );

  const goToDashboard = useCallback(() => {
    triggerLightHaptic();
    resetTo(router, ROUTES.myRides);
  }, [router]);

  const contactSupport = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.supportChat);
  }, [router]);

  const close = useCallback(() => {
    triggerLightHaptic();
    resetTo(router, ROUTES.myRides);
  }, [router]);

  return {
    summary,
    goToDashboard,
    contactSupport,
    close,
  };
};
