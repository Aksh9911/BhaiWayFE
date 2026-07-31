import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  formatEstimatedEarnings,
  formatTimeLabel,
  getSelectCommuteLocationPath,
  parseTimeLabel,
  PUBLISH_COMMUTE_SCREEN,
  WEEKDAY_OPTIONS,
} from '../constants';
import { publishCommuteDraft } from '../store';
import type { CommuteLocationField, PublishCommuteDraft, WeekdayId } from '../types';

export interface UsePublishCommuteResult {
  draft: PublishCommuteDraft;
  weekdays: typeof WEEKDAY_OPTIONS;
  estimatedEarnings: string;
  timePickerOpen: boolean;
  selectedTime: Date;
  updateDraft: (patch: Partial<PublishCommuteDraft>) => void;
  incrementSeats: () => void;
  decrementSeats: () => void;
  toggleDay: (id: WeekdayId) => void;
  openTimePicker: () => void;
  closeTimePicker: () => void;
  selectTime: (date: Date) => void;
  openLocationPicker: (field: CommuteLocationField) => void;
  submit: () => void;
  goBack: () => void;
  openNotifications: () => void;
}

export const usePublishCommute = (): UsePublishCommuteResult => {
  const router = useRouter();
  const [draft, setDraft] = useState<PublishCommuteDraft>(() => publishCommuteDraft.get());
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  useEffect(() => publishCommuteDraft.subscribe(setDraft), []);

  const updateDraft = useCallback((patch: Partial<PublishCommuteDraft>) => {
    publishCommuteDraft.update(patch);
  }, []);

  const incrementSeats = useCallback(() => {
    const current = publishCommuteDraft.get();
    publishCommuteDraft.update({
      seats: Math.min(PUBLISH_COMMUTE_SCREEN.maxSeats, current.seats + 1),
    });
  }, []);

  const decrementSeats = useCallback(() => {
    const current = publishCommuteDraft.get();
    publishCommuteDraft.update({
      seats: Math.max(PUBLISH_COMMUTE_SCREEN.minSeats, current.seats - 1),
    });
  }, []);

  const toggleDay = useCallback((id: WeekdayId) => {
    const current = publishCommuteDraft.get();
    const selected = current.recurringDays.includes(id)
      ? current.recurringDays.filter((day) => day !== id)
      : [...current.recurringDays, id];
    publishCommuteDraft.update({ recurringDays: selected });
  }, []);

  const openTimePicker = useCallback(() => setTimePickerOpen(true), []);
  const closeTimePicker = useCallback(() => setTimePickerOpen(false), []);

  const selectTime = useCallback((date: Date) => {
    publishCommuteDraft.update({ departureTime: formatTimeLabel(date) });
    setTimePickerOpen(false);
  }, []);

  const openLocationPicker = useCallback(
    (field: CommuteLocationField) => {
      router.push(getSelectCommuteLocationPath(field));
    },
    [router],
  );

  const estimatedEarnings = useMemo(
    () => formatEstimatedEarnings(draft.pricePerSeat, draft.seats),
    [draft.pricePerSeat, draft.seats],
  );

  const selectedTime = useMemo(
    () => parseTimeLabel(draft.departureTime),
    [draft.departureTime],
  );

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.officeCommute);
  }, [router]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const submit = useCallback(() => {
    if (!draft.startLocation.trim() || !draft.officeLocation.trim()) {
      Alert.alert('Missing route', 'Please select both start and office locations.');
      return;
    }
    if (!draft.departureTime) {
      Alert.alert('Missing schedule', 'Please select a departure time.');
      return;
    }
    if (!(Number(draft.pricePerSeat) > 0)) {
      Alert.alert('Missing price', 'Please enter a price per seat.');
      return;
    }

    router.push(ROUTES.officeCommuteReview);
  }, [draft, router]);

  return {
    draft,
    weekdays: WEEKDAY_OPTIONS,
    estimatedEarnings,
    timePickerOpen,
    selectedTime,
    updateDraft,
    incrementSeats,
    decrementSeats,
    toggleDay,
    openTimePicker,
    closeTimePicker,
    selectTime,
    openLocationPicker,
    submit,
    goBack,
    openNotifications,
  };
};
