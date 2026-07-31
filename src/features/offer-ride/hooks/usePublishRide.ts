import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getSearchParam, formatSlashDate, parseSlashDate, startOfDay } from '@/shared/utils';
import { useOptionPicker } from '@/shared/hooks';
import { getSelectLocationPath } from '../constants';
import { publishRideDraft } from '../store';
import type { LocationFieldType, OutstationRideTypeId, PublishRideDraft } from '../types';

const TIME_OPTIONS = ['08:00 AM', '09:30 AM', '12:00 PM', '06:00 PM', '08:00 PM'] as const;

const isRideType = (value: string): value is OutstationRideTypeId =>
  value === 'regular' || value === 'assured';

export const usePublishRide = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ rideType?: string }>();
  const rideTypeParam = getSearchParam(params.rideType);
  const showOptionPicker = useOptionPicker();
  const minimumDate = useMemo(() => startOfDay(new Date()), []);

  const [draft, setDraft] = useState<PublishRideDraft>(() => publishRideDraft.get());
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    if (isRideType(rideTypeParam)) {
      publishRideDraft.reset(rideTypeParam);
      setDraft(publishRideDraft.get());
    }
    return publishRideDraft.subscribe(setDraft);
  }, [rideTypeParam]);

  const updateDraft = useCallback((partial: Partial<PublishRideDraft>) => {
    publishRideDraft.update(partial);
  }, []);

  const openLocationPicker = useCallback(
    (field: LocationFieldType) => {
      router.push(getSelectLocationPath(field));
    },
    [router],
  );

  const openDatePicker = useCallback(() => {
    setDatePickerOpen(true);
  }, []);

  const closeDatePicker = useCallback(() => {
    setDatePickerOpen(false);
  }, []);

  const selectDate = useCallback(
    (date: Date) => {
      updateDraft({ departureDate: formatSlashDate(date) });
    },
    [updateDraft],
  );

  const pickTime = useCallback(() => {
    showOptionPicker('Departure Time', TIME_OPTIONS, (value) => {
      updateDraft({ departureTime: value });
    });
  }, [showOptionPicker, updateDraft]);

  const submit = useCallback(() => {
    if (!draft.origin.trim() || !draft.destination.trim()) {
      Alert.alert('Missing route', 'Please select both origin and destination.');
      return;
    }
    if (!draft.departureDate || !draft.departureTime) {
      Alert.alert('Missing schedule', 'Please select departure date and time.');
      return;
    }

    Alert.alert(
      'Ride published',
      `${draft.rideType === 'assured' ? 'Assured' : 'Regular'} ride from ${draft.origin} to ${draft.destination} on ${draft.departureDate} at ${draft.departureTime}.`,
    );
  }, [draft]);

  const isValid =
    draft.origin.trim().length > 0 &&
    draft.destination.trim().length > 0 &&
    draft.departureDate.length > 0 &&
    draft.departureTime.length > 0 &&
    Number(draft.pricePerSeat) > 0;

  const selectedDate = parseSlashDate(draft.departureDate) ?? minimumDate;

  return {
    draft,
    updateDraft,
    openLocationPicker,
    openDatePicker,
    closeDatePicker,
    datePickerOpen,
    selectedDate,
    minimumDate,
    selectDate,
    pickTime,
    submit,
    isValid,
  };
};
