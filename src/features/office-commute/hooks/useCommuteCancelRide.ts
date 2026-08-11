import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo, showAppAlert, triggerLightHaptic } from '@/shared/utils';
import { getCommuteCancelConfirmedPath } from '../constants/commute-cancel-confirmed.constants';
import {
  COMMUTE_CANCEL_REASONS,
  COMMUTE_CANCEL_RIDE_SCREEN,
  shortCommutePlaceName,
  type CommuteCancelReasonId,
} from '../constants/commute-cancel-ride.constants';

export interface UseCommuteCancelRideParams {
  rideId: string;
  origin?: string;
  destination?: string;
  dateLabel?: string;
  timeLabel?: string;
}

export interface UseCommuteCancelRideResult {
  summary: {
    rideId: string;
    pickupLabel: string;
    dropoffLabel: string;
    dateLabel: string;
    timeLabel: string;
  };
  reasons: typeof COMMUTE_CANCEL_REASONS;
  selectedReason: CommuteCancelReasonId | null;
  otherNote: string;
  showOtherNote: boolean;
  submitting: boolean;
  selectReason: (id: CommuteCancelReasonId) => void;
  setOtherNote: (value: string) => void;
  confirmCancellation: () => void;
  goBack: () => void;
}

export const useCommuteCancelRide = (
  params: UseCommuteCancelRideParams,
): UseCommuteCancelRideResult => {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<CommuteCancelReasonId | null>(null);
  const [otherNote, setOtherNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const summary = useMemo(
    () => ({
      rideId: params.rideId,
      pickupLabel: shortCommutePlaceName(params.origin) || 'Sector 62',
      dropoffLabel: shortCommutePlaceName(params.destination) || 'Cyber Hub',
      dateLabel: params.dateLabel?.trim() || 'Today, Oct 24',
      timeLabel: params.timeLabel?.trim() || '08:30 AM',
    }),
    [params.dateLabel, params.destination, params.origin, params.rideId, params.timeLabel],
  );

  const selectReason = useCallback((id: CommuteCancelReasonId) => {
    triggerLightHaptic();
    setSelectedReason(id);
    if (id !== 'other') {
      setOtherNote('');
    }
  }, []);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.officeCommuteBooked);
  }, [router]);

  const confirmCancellation = useCallback(() => {
    if (!selectedReason) {
      showAppAlert(
        COMMUTE_CANCEL_RIDE_SCREEN.reasonRequiredTitle,
        COMMUTE_CANCEL_RIDE_SCREEN.reasonRequiredMessage,
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      resetTo(router, getCommuteCancelConfirmedPath());
    }, 900);
  }, [router, selectedReason]);

  return {
    summary,
    reasons: COMMUTE_CANCEL_REASONS,
    selectedReason,
    otherNote,
    showOtherNote: selectedReason === 'other',
    submitting,
    selectReason,
    setOtherNote,
    confirmCancellation,
    goBack,
  };
};
