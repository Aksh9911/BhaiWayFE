import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import type { AppMode } from '@/store';
import { logger, triggerLightHaptic } from '@/shared/utils';
import {
  CANCEL_RIDE_REASONS,
  CANCEL_UPCOMING_RIDE_SCREEN,
  type CancelRideReasonId,
} from '../constants';
import { upcomingRideCancelledStore } from '../store';

export interface CancelUpcomingRideParams {
  rideId?: string;
  dateLabel?: string;
  title?: string;
  pickupLabel?: string;
  dropoffLabel?: string;
  mode?: string;
  assured?: string;
}

export interface UseCancelUpcomingRideResult {
  summary: {
    rideId: string;
    dateLabel: string;
    title: string;
    pickupLabel: string;
    dropoffLabel: string;
    assured: boolean;
  };
  isDriving: boolean;
  subtitle: string;
  policyText: string;
  reasons: typeof CANCEL_RIDE_REASONS;
  selectedReasonId: CancelRideReasonId | null;
  otherNote: string;
  showOtherNote: boolean;
  confirming: boolean;
  selectReason: (id: CancelRideReasonId) => void;
  setOtherNote: (value: string) => void;
  keepRide: () => void;
  confirmCancel: () => void;
  goBack: () => void;
}

export const useCancelUpcomingRide = (
  params: CancelUpcomingRideParams,
): UseCancelUpcomingRideResult => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [selectedReasonId, setSelectedReasonId] = useState<CancelRideReasonId | null>(null);
  const [otherNote, setOtherNote] = useState('');
  const mode: AppMode = params.mode === 'driving' ? 'driving' : 'riding';
  const isDriving = mode === 'driving';
  const assured = params.assured === '1' || params.assured === 'true';

  const summary = useMemo(
    () => ({
      rideId: params.rideId || 'upcoming-ride',
      dateLabel: params.dateLabel || 'Today, 08:30 AM',
      title: params.title || 'Upcoming Ride',
      pickupLabel: params.pickupLabel || 'Delhi Center',
      dropoffLabel: params.dropoffLabel || 'Altus Office',
      assured,
    }),
    [
      assured,
      params.dateLabel,
      params.dropoffLabel,
      params.pickupLabel,
      params.rideId,
      params.title,
    ],
  );

  const policyText = useMemo(() => {
    if (isDriving) {
      return CANCEL_UPCOMING_RIDE_SCREEN.policyDriving;
    }
    return assured
      ? CANCEL_UPCOMING_RIDE_SCREEN.policyAssured
      : CANCEL_UPCOMING_RIDE_SCREEN.policyRegular;
  }, [assured, isDriving]);

  const selectReason = useCallback((id: CancelRideReasonId) => {
    triggerLightHaptic();
    setSelectedReasonId(id);
    if (id !== 'other') {
      setOtherNote('');
    }
  }, []);

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
    logger.info('Upcoming ride cancellation confirmed', {
      rideId: summary.rideId,
      reasonId: selectedReasonId,
      otherNote: selectedReasonId === 'other' ? otherNote.trim() : undefined,
      assured: summary.assured,
      mode,
    });
    upcomingRideCancelledStore.setCancelled(true);
    router.replace(ROUTES.myRidesCancelConfirmed);
  }, [confirming, mode, otherNote, router, selectedReasonId, summary.assured, summary.rideId]);

  return {
    summary,
    isDriving,
    subtitle: isDriving
      ? CANCEL_UPCOMING_RIDE_SCREEN.subtitleDriving
      : CANCEL_UPCOMING_RIDE_SCREEN.subtitleRiding,
    policyText,
    reasons: CANCEL_RIDE_REASONS,
    selectedReasonId,
    otherNote,
    showOtherNote: selectedReasonId === 'other',
    confirming,
    selectReason,
    setOtherNote,
    keepRide,
    confirmCancel,
    goBack,
  };
};
