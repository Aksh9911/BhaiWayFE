import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { useSessionUser } from '@/shared/hooks';
import { publishedCommuteStore } from '@/features/office-commute/store';
import {
  DEFAULT_HISTORY_RIDES,
  DEFAULT_PROFILE_AVATAR,
  DEFAULT_UPCOMING_RIDE,
  MY_RIDES_SCREEN,
} from '../constants';
import type { HistoryRideItem, MyRidesTab, UpcomingRideSummary } from '../types';

export interface UseMyRidesResult {
  tab: MyRidesTab;
  setTab: (tab: MyRidesTab) => void;
  avatarUri: string | null;
  upcomingRide: UpcomingRideSummary | null;
  historyRides: readonly HistoryRideItem[];
  openProfile: () => void;
  openNotifications: () => void;
  trackRide: () => void;
  cancelRequest: () => void;
}

export const useMyRides = (): UseMyRidesResult => {
  const router = useRouter();
  const user = useSessionUser();
  const [tab, setTab] = useState<MyRidesTab>('upcoming');
  const [publishedPickup, setPublishedPickup] = useState(() => publishedCommuteStore.get());

  useEffect(
    () =>
      publishedCommuteStore.subscribe((summary) => {
        setPublishedPickup(summary);
      }),
    [],
  );

  const upcomingRide = useMemo((): UpcomingRideSummary | null => {
    if (publishedPickup) {
      return {
        ...DEFAULT_UPCOMING_RIDE,
        id: 'published-upcoming',
        dateLabel: `TODAY, ${publishedPickup.departureLabel}`,
        pickupLabel: publishedPickup.pickupLabel,
        dropoffLabel: publishedPickup.dropoffLabel,
      };
    }
    return DEFAULT_UPCOMING_RIDE;
  }, [publishedPickup]);

  const openProfile = useCallback(() => {
    router.push(ROUTES.profile);
  }, [router]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const trackRide = useCallback(() => {
    router.push(ROUTES.rideSearchLiveTracking);
  }, [router]);

  const cancelRequest = useCallback(() => {
    Alert.alert(MY_RIDES_SCREEN.cancelTitle, MY_RIDES_SCREEN.cancelMessage);
  }, []);

  return {
    tab,
    setTab,
    avatarUri: user?.avatarUri ?? DEFAULT_PROFILE_AVATAR,
    upcomingRide,
    historyRides: DEFAULT_HISTORY_RIDES,
    openProfile,
    openNotifications,
    trackRide,
    cancelRequest,
  };
};
