import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo, showAppAlert, triggerLightHaptic } from '@/shared/utils';
import {
  CANCEL_RIDE_SCREEN,
  CANCEL_REASONS,
  getCancelConfirmedPath,
  getCancelRideSummary,
} from '../constants';
import type { CancelReasonId, CancelRideSummary, RideType } from '../types';

export interface UseCancelRideParams {
  rideId: string;
  rideType: RideType;
  origin?: string;
  destination?: string;
}

export interface UseCancelRideResult {
  summary: CancelRideSummary;
  reasons: typeof CANCEL_REASONS;
  selectedReason: CancelReasonId | null;
  comments: string;
  isAssured: boolean;
  subtitle: string;
  showOtherNote: boolean;
  submitting: boolean;
  selectReason: (id: CancelReasonId) => void;
  setComments: (value: string) => void;
  confirmCancellation: () => void;
  goBack: () => void;
  openNotifications: () => void;
}

export const useCancelRide = (params: UseCancelRideParams): UseCancelRideResult => {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<CancelReasonId | null>(null);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const summary = useMemo(
    () =>
      getCancelRideSummary({
        rideId: params.rideId,
        rideType: params.rideType,
        origin: params.origin,
        destination: params.destination,
      }),
    [params.destination, params.origin, params.rideId, params.rideType],
  );

  const isAssured = summary.rideType === 'assured';

  const selectReason = useCallback((id: CancelReasonId) => {
    triggerLightHaptic();
    setSelectedReason(id);
    if (id !== 'other') {
      setComments('');
    }
  }, []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.rideSearchRideDetails);
  }, [router]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const confirmCancellation = useCallback(() => {
    if (!selectedReason) {
      showAppAlert(
        CANCEL_RIDE_SCREEN.reasonRequiredTitle,
        CANCEL_RIDE_SCREEN.reasonRequiredMessage,
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      resetTo(
        router,
        getCancelConfirmedPath({
          rideType: summary.rideType,
        }),
      );
    }, 1200);
  }, [router, selectedReason, summary.rideType]);

  return {
    summary,
    reasons: CANCEL_REASONS,
    selectedReason,
    comments,
    isAssured,
    subtitle: isAssured
      ? CANCEL_RIDE_SCREEN.subtitleAssured
      : CANCEL_RIDE_SCREEN.subtitleRegular,
    showOtherNote: selectedReason === 'other',
    submitting,
    selectReason,
    setComments,
    confirmCancellation,
    goBack,
    openNotifications,
  };
};
