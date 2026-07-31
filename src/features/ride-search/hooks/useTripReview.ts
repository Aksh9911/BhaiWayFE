import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  DRIVER_FEEDBACK_TAGS,
  getFeedbackSubmittedPath,
  getTripReviewMock,
  TRIP_REVIEW_SCREEN,
  VEHICLE_FEEDBACK_TAGS,
} from '../constants';
import type { RatingValue, TripReviewData } from '../types';
import { resetTo } from '@/shared/utils';

export interface UseTripReviewParams {
  rideId: string;
  driverName?: string;
}

export interface UseTripReviewResult {
  review: TripReviewData;
  driverTags: typeof DRIVER_FEEDBACK_TAGS;
  vehicleTags: typeof VEHICLE_FEEDBACK_TAGS;
  driverRating: RatingValue;
  vehicleRating: RatingValue;
  selectedDriverTags: string[];
  selectedVehicleTags: string[];
  comments: string;
  submitting: boolean;
  setDriverRating: (value: RatingValue) => void;
  setVehicleRating: (value: RatingValue) => void;
  toggleDriverTag: (id: string) => void;
  toggleVehicleTag: (id: string) => void;
  setComments: (value: string) => void;
  submitFeedback: () => void;
  close: () => void;
}

const toggleId = (list: string[], id: string): string[] =>
  list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

export const useTripReview = (params: UseTripReviewParams): UseTripReviewResult => {
  const router = useRouter();
  const [driverRating, setDriverRating] = useState<RatingValue>(0);
  const [vehicleRating, setVehicleRating] = useState<RatingValue>(0);
  const [selectedDriverTags, setSelectedDriverTags] = useState<string[]>([]);
  const [selectedVehicleTags, setSelectedVehicleTags] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const review = useMemo(
    () =>
      getTripReviewMock({
        rideId: params.rideId,
        driverName: params.driverName,
      }),
    [params.driverName, params.rideId],
  );

  const toggleDriverTag = useCallback((id: string) => {
    setSelectedDriverTags((prev) => toggleId(prev, id));
  }, []);

  const toggleVehicleTag = useCallback((id: string) => {
    setSelectedVehicleTags((prev) => toggleId(prev, id));
  }, []);

  const close = useCallback(() => {
    resetTo(router, ROUTES.home);
  }, [router]);

  const submitFeedback = useCallback(() => {
    if (driverRating < 1) {
      Alert.alert(
        TRIP_REVIEW_SCREEN.ratingRequiredTitle,
        TRIP_REVIEW_SCREEN.ratingRequiredMessage,
      );
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      resetTo(router, getFeedbackSubmittedPath({ rating: driverRating }));
    }, 1000);
  }, [driverRating, router]);

  return {
    review,
    driverTags: DRIVER_FEEDBACK_TAGS,
    vehicleTags: VEHICLE_FEEDBACK_TAGS,
    driverRating,
    vehicleRating,
    selectedDriverTags,
    selectedVehicleTags,
    comments,
    submitting,
    setDriverRating,
    setVehicleRating,
    toggleDriverTag,
    toggleVehicleTag,
    setComments,
    submitFeedback,
    close,
  };
};
