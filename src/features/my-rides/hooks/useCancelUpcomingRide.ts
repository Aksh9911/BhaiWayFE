import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import type { AppMode } from '@/store';
import {
  CANCEL_UPCOMING_RIDE_SCREEN,
} from '../constants';
import { upcomingRideCancelledStore } from '../store';

export interface CancelUpcomingRideParams {
  rideId?: string;
  dateLabel?: string;
  title?: string;
  pickupLabel?: string;
  dropoffLabel?: string;
  mode?: string;
}

export interface UseCancelUpcomingRideResult {
  summary: {
    rideId: string;
    dateLabel: string;
    title: string;
    routeLabel: string;
  };
  isDriving: boolean;
  subtitle: string;
  note: string;
  confirming: boolean;
  keepRide: () => void;
  confirmCancel: () => void;
  goBack: () => void;
  openNotifications: () => void;
}

export const useCancelUpcomingRide = (
  params: CancelUpcomingRideParams,
): UseCancelUpcomingRideResult => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const mode: AppMode = params.mode === 'driving' ? 'driving' : 'riding';
  const isDriving = mode === 'driving';

  const summary = useMemo(
    () => ({
      rideId: params.rideId || 'upcoming-ride',
      dateLabel: params.dateLabel || 'Upcoming',
      title: params.title || 'Upcoming Ride',
      routeLabel: `${params.pickupLabel || 'Pickup'} → ${params.dropoffLabel || 'Drop-off'}`,
    }),
    [params.dateLabel, params.dropoffLabel, params.pickupLabel, params.rideId, params.title],
  );

  const keepRide = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  const goBack = keepRide;

  const confirmCancel = useCallback(() => {
    if (confirming) {
      return;
    }
    setConfirming(true);
    upcomingRideCancelledStore.setCancelled(true);
    router.replace(ROUTES.myRidesCancelConfirmed);
  }, [confirming, router]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  return {
    summary,
    isDriving,
    subtitle: isDriving
      ? CANCEL_UPCOMING_RIDE_SCREEN.subtitleDriving
      : CANCEL_UPCOMING_RIDE_SCREEN.subtitleRiding,
    note: isDriving
      ? CANCEL_UPCOMING_RIDE_SCREEN.noteDriving
      : CANCEL_UPCOMING_RIDE_SCREEN.noteRiding,
    confirming,
    keepRide,
    confirmCancel,
    goBack,
    openNotifications,
  };
};
