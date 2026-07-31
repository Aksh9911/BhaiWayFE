import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';
import { FEEDBACK_SUBMITTED_SCREEN } from '../constants';

export interface UseFeedbackSubmittedParams {
  rating: number;
}

export interface UseFeedbackSubmittedResult {
  rating: number;
  goHome: () => void;
  viewReceipt: () => void;
  openNotifications: () => void;
  openSearch: () => void;
}

export const useFeedbackSubmitted = (
  params: UseFeedbackSubmittedParams,
): UseFeedbackSubmittedResult => {
  const router = useRouter();
  const rating = Math.min(5, Math.max(1, Math.round(params.rating) || 5));

  const goHome = useCallback(() => {
    resetTo(router, ROUTES.home);
  }, [router]);

  const viewReceipt = useCallback(() => {
    Alert.alert(
      FEEDBACK_SUBMITTED_SCREEN.receiptTitle,
      FEEDBACK_SUBMITTED_SCREEN.receiptMessage,
    );
  }, []);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const openSearch = useCallback(() => {
    resetTo(router, ROUTES.rideSearch);
  }, [router]);

  return {
    rating,
    goHome,
    viewReceipt,
    openNotifications,
    openSearch,
  };
};
