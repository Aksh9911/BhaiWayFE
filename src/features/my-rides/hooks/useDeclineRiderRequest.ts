import { useCallback, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { getSearchParam, showAppAlert, triggerLightHaptic, triggerSuccessHaptic } from '@/shared/utils';
import {
  DECLINE_RIDER_REASONS,
  DECLINE_RIDER_SCREEN,
  getRequestDeclinedPath,
  type DeclineRiderReasonId,
} from '../constants';
import { regularRideRidersStore } from '../store';

export interface UseDeclineRiderRequestResult {
  riderName: string;
  reasons: typeof DECLINE_RIDER_REASONS;
  selectedReason: DeclineRiderReasonId | null;
  notes: string;
  canConfirm: boolean;
  selectReason: (id: DeclineRiderReasonId) => void;
  setNotes: (value: string) => void;
  confirmDecline: () => void;
  goBack: () => void;
}

export const useDeclineRiderRequest = (): UseDeclineRiderRequestResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    riderId?: string;
    name?: string;
  }>();

  const rideId = getSearchParam(params.rideId) || 'driving-upcoming-regular-1';
  const riderId = getSearchParam(params.riderId) || '';
  const riderName = getSearchParam(params.name) || 'this rider';

  const [selectedReason, setSelectedReason] = useState<DeclineRiderReasonId | null>(null);
  const [notes, setNotes] = useState('');

  const canConfirm = Boolean(selectedReason && riderId);

  const selectReason = useCallback((id: DeclineRiderReasonId) => {
    triggerLightHaptic();
    setSelectedReason(id);
  }, []);

  const confirmDecline = useCallback(() => {
    if (!selectedReason || !riderId) {
      showAppAlert('Decline request', DECLINE_RIDER_SCREEN.selectReasonMessage);
      return;
    }
    triggerSuccessHaptic();
    regularRideRidersStore.decline(rideId, riderId);
    router.replace(
      getRequestDeclinedPath({
        rideId,
        riderId,
        name: riderName,
      }),
    );
  }, [riderId, rideId, riderName, router, selectedReason]);

  const goBack = useCallback(() => {
    triggerLightHaptic();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRidesTrack);
  }, [router]);

  return {
    riderName,
    reasons: DECLINE_RIDER_REASONS,
    selectedReason,
    notes,
    canConfirm,
    selectReason,
    setNotes,
    confirmDecline,
    goBack,
  };
};
