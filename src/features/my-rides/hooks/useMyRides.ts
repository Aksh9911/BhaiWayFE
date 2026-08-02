import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { useSessionUser } from '@/shared/hooks';
import { appModeStore, type AppMode } from '@/store';
import { publishedCommuteStore } from '@/features/office-commute/store';
import {
  DEFAULT_DRIVING_HISTORY_RIDES,
  DEFAULT_DRIVING_UPCOMING_RIDE,
  DEFAULT_HISTORY_RIDES,
  DEFAULT_PROFILE_AVATAR,
  DEFAULT_UPCOMING_RIDE,
  getCancelUpcomingRidePath,
  MY_RIDES_SCREEN,
} from '../constants';
import { upcomingRideCancelledStore } from '../store';
import type { HistoryRideItem, MyRidesTab, UpcomingRideSummary } from '../types';

export interface UseMyRidesResult {
  mode: AppMode;
  modeBadge: string;
  tab: MyRidesTab;
  setTab: (tab: MyRidesTab) => void;
  avatarUri: string | null;
  upcomingRide: UpcomingRideSummary | null;
  historyRides: readonly HistoryRideItem[];
  cancelLabel: string;
  trackLabel: string;
  peerLabel: string;
  emptyUpcomingSubtitle: string;
  emptyPastSubtitle: string;
  openProfile: () => void;
  openNotifications: () => void;
  trackRide: () => void;
  cancelRequest: () => void;
}

export const useMyRides = (): UseMyRidesResult => {
  const router = useRouter();
  const user = useSessionUser();
  const [tab, setTab] = useState<MyRidesTab>('upcoming');
  const [mode, setMode] = useState<AppMode>(() => appModeStore.get());
  const [publishedPickup, setPublishedPickup] = useState(() => publishedCommuteStore.get());
  const [upcomingCancelled, setUpcomingCancelled] = useState(() =>
    upcomingRideCancelledStore.get(),
  );

  useEffect(() => appModeStore.subscribe(setMode), []);

  useEffect(
    () => upcomingRideCancelledStore.subscribe(setUpcomingCancelled),
    [],
  );

  useEffect(
    () =>
      publishedCommuteStore.subscribe((summary) => {
        setPublishedPickup(summary);
      }),
    [],
  );

  const isDriving = mode === 'driving';

  const upcomingRide = useMemo((): UpcomingRideSummary | null => {
    if (upcomingCancelled) {
      return null;
    }

    if (isDriving) {
      return DEFAULT_DRIVING_UPCOMING_RIDE;
    }

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
  }, [isDriving, publishedPickup, upcomingCancelled]);

  const historyRides = isDriving ? DEFAULT_DRIVING_HISTORY_RIDES : DEFAULT_HISTORY_RIDES;

  const openProfile = useCallback(() => {
    router.push(ROUTES.profile);
  }, [router]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const trackRide = useCallback(() => {
    if (isDriving) {
      router.push(ROUTES.myRidesPickup);
      return;
    }
    router.push(ROUTES.rideSearchLiveTracking);
  }, [isDriving, router]);

  const cancelRequest = useCallback(() => {
    if (!upcomingRide) {
      return;
    }

    router.push(
      getCancelUpcomingRidePath({
        rideId: upcomingRide.id,
        dateLabel: upcomingRide.dateLabel,
        title: upcomingRide.title,
        pickupLabel: upcomingRide.pickupLabel,
        dropoffLabel: upcomingRide.dropoffLabel,
        mode,
      }),
    );
  }, [mode, router, upcomingRide]);

  return {
    mode,
    modeBadge: isDriving ? MY_RIDES_SCREEN.driverModeBadge : MY_RIDES_SCREEN.riderModeBadge,
    tab,
    setTab,
    avatarUri: user?.avatarUri ?? DEFAULT_PROFILE_AVATAR,
    upcomingRide,
    historyRides,
    cancelLabel: isDriving
      ? MY_RIDES_SCREEN.cancelLabelDriving
      : MY_RIDES_SCREEN.cancelLabelRiding,
    trackLabel: isDriving
      ? MY_RIDES_SCREEN.trackLabelDriving
      : MY_RIDES_SCREEN.trackLabelRiding,
    peerLabel: isDriving ? MY_RIDES_SCREEN.peerLabelDriving : MY_RIDES_SCREEN.peerLabelRiding,
    emptyUpcomingSubtitle: isDriving
      ? MY_RIDES_SCREEN.emptyUpcomingSubtitleDriving
      : MY_RIDES_SCREEN.emptyUpcomingSubtitleRiding,
    emptyPastSubtitle: isDriving
      ? MY_RIDES_SCREEN.emptyPastSubtitleDriving
      : MY_RIDES_SCREEN.emptyPastSubtitleRiding,
    openProfile,
    openNotifications,
    trackRide,
    cancelRequest,
  };
};
