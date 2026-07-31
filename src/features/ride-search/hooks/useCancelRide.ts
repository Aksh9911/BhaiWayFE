import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';
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

  const selectReason = useCallback((id: CancelReasonId) => {
    setSelectedReason(id);
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
      Alert.alert(
        CANCEL_RIDE_SCREEN.reasonRequiredTitle,
        CANCEL_RIDE_SCREEN.reasonRequiredMessage,
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      resetTo(router, getCancelConfirmedPath());
    }, 1200);
  }, [router, selectedReason]);

  return {
    summary,
    reasons: CANCEL_REASONS,
    selectedReason,
    comments,
    isAssured: summary.rideType === 'assured',
    submitting,
    selectReason,
    setComments,
    confirmCancellation,
    goBack,
    openNotifications,
  };
};
