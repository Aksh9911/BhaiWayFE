import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { vehiclesSheetStore, vehiclesSheetSync } from '@/DemoData';
import {
  getSearchParam,
  showAppAlert,
  triggerLightHaptic,
  triggerSuccessHaptic,
} from '@/shared/utils';
import type { PublishRideVehicleOption } from '@/features/offer-ride/types';
import { mapGarageVehicleToOption } from '@/features/offer-ride/utils';
import {
  DEFAULT_MODIFY_RIDE_FORM,
  MODIFY_RIDE_PREFERENCE_OPTIONS,
  MODIFY_RIDE_SCREEN,
  type ModifyRideFormState,
  type ModifyRidePreferenceId,
} from '../constants';

const parseDateLabel = (dateLabel: string): { date: string; time: string } | null => {
  // e.g. "OCT 25, 09:00 AM"
  const match = dateLabel.match(/^([A-Z]{3})\s+(\d{1,2}),\s+(.+)$/i);
  if (!match) return null;
  const monthMap: Record<string, string> = {
    JAN: '01',
    FEB: '02',
    MAR: '03',
    APR: '04',
    MAY: '05',
    JUN: '06',
    JUL: '07',
    AUG: '08',
    SEP: '09',
    OCT: '10',
    NOV: '11',
    DEC: '12',
  };
  const month = monthMap[match[1].toUpperCase()];
  if (!month) return null;
  const day = match[2].padStart(2, '0');
  return {
    date: `${day}/${month}/2026`,
    time: match[3].trim(),
  };
};

export interface UseModifyRideResult {
  form: ModifyRideFormState;
  preferenceOptions: typeof MODIFY_RIDE_PREFERENCE_OPTIONS;
  vehicles: readonly PublishRideVehicleOption[];
  datePickerOpen: boolean;
  timePickerOpen: boolean;
  selectedDate: Date;
  selectedTime: Date;
  minimumDate: Date;
  updateField: <K extends keyof ModifyRideFormState>(
    key: K,
    value: ModifyRideFormState[K],
  ) => void;
  togglePreference: (id: ModifyRidePreferenceId) => void;
  selectVehicle: (id: string) => void;
  openDatePicker: () => void;
  closeDatePicker: () => void;
  openTimePicker: () => void;
  closeTimePicker: () => void;
  selectDate: (date: Date) => void;
  selectTime: (date: Date) => void;
  addVehicle: () => void;
  updateRide: () => void;
  goBack: () => void;
}

const formatDisplayDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDisplayTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${String(hour12).padStart(2, '0')}:${minutes} ${period}`;
};

const parseDisplayDate = (value: string): Date => {
  const parts = value.split('/');
  if (parts.length === 3) {
    const day = Number(parts[0]);
    const month = Number(parts[1]) - 1;
    const year = Number(parts[2]);
    if (Number.isFinite(day) && Number.isFinite(month) && Number.isFinite(year)) {
      return new Date(year, month, day);
    }
  }
  return new Date(2026, 9, 28);
};

const parseDisplayTime = (value: string, base: Date): Date => {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return base;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  const next = new Date(base);
  next.setHours(hours, minutes, 0, 0);
  return next;
};

export const useModifyRide = (): UseModifyRideResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    pickupLabel?: string;
    dropoffLabel?: string;
    dateLabel?: string;
  }>();

  const rideId = getSearchParam(params.rideId) || DEFAULT_MODIFY_RIDE_FORM.rideId;
  const pickupLabel = getSearchParam(params.pickupLabel);
  const dropoffLabel = getSearchParam(params.dropoffLabel);
  const dateLabel = getSearchParam(params.dateLabel);

  const initialForm = useMemo((): ModifyRideFormState => {
    const parsed = dateLabel ? parseDateLabel(dateLabel) : null;
    return {
      ...DEFAULT_MODIFY_RIDE_FORM,
      rideId,
      origin: pickupLabel
        ? pickupLabel.includes(',')
          ? pickupLabel
          : `${pickupLabel}, South Delhi`
        : DEFAULT_MODIFY_RIDE_FORM.origin,
      destination: dropoffLabel
        ? dropoffLabel.includes(',')
          ? dropoffLabel
          : `${dropoffLabel}, Gurgaon`
        : DEFAULT_MODIFY_RIDE_FORM.destination,
      departureDate: parsed?.date ?? DEFAULT_MODIFY_RIDE_FORM.departureDate,
      departureTime: parsed?.time ?? DEFAULT_MODIFY_RIDE_FORM.departureTime,
    };
  }, [dateLabel, dropoffLabel, pickupLabel, rideId]);

  const [form, setForm] = useState<ModifyRideFormState>(initialForm);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  const getGarageSnapshot = useCallback(
    () =>
      vehiclesSheetStore
        .getForCurrentUser()
        .map(
          (row) =>
            `${row.row_id}:${row.vehicleModel}:${row.vehicleNumberPlate}`,
        )
        .join('|'),
    [],
  );
  const garageSnapshot = useSyncExternalStore(
    (onStoreChange) => vehiclesSheetStore.subscribe(() => onStoreChange()),
    getGarageSnapshot,
  );

  useFocusEffect(
    useCallback(() => {
      void vehiclesSheetSync.pullIntoLocal().catch(() => undefined);
      const options = vehiclesSheetStore.getForCurrentUser().map(mapGarageVehicleToOption);
      setForm((prev) => {
        const stillValid = options.some((item) => item.id === prev.selectedVehicleId);
        if (stillValid) {
          return prev;
        }
        return { ...prev, selectedVehicleId: options[0]?.id ?? '' };
      });
    }, []),
  );

  const vehicles = useMemo(
    () => vehiclesSheetStore.getForCurrentUser().map(mapGarageVehicleToOption),
    [garageSnapshot],
  );

  const minimumDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const selectedDate = useMemo(
    () => parseDisplayDate(form.departureDate),
    [form.departureDate],
  );

  const selectedTime = useMemo(
    () => parseDisplayTime(form.departureTime, selectedDate),
    [form.departureTime, selectedDate],
  );

  const updateField = useCallback(
    <K extends keyof ModifyRideFormState>(key: K, value: ModifyRideFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const togglePreference = useCallback((id: ModifyRidePreferenceId) => {
    triggerLightHaptic();
    setForm((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [id]: !prev.preferences[id],
      },
    }));
  }, []);

  const selectVehicle = useCallback((id: string) => {
    triggerLightHaptic();
    setForm((prev) => ({ ...prev, selectedVehicleId: id }));
  }, []);

  const openDatePicker = useCallback(() => {
    triggerLightHaptic();
    setDatePickerOpen(true);
  }, []);

  const closeDatePicker = useCallback(() => setDatePickerOpen(false), []);

  const openTimePicker = useCallback(() => {
    triggerLightHaptic();
    setTimePickerOpen(true);
  }, []);

  const closeTimePicker = useCallback(() => setTimePickerOpen(false), []);

  const selectDate = useCallback((date: Date) => {
    setForm((prev) => ({ ...prev, departureDate: formatDisplayDate(date) }));
    setDatePickerOpen(false);
  }, []);

  const selectTime = useCallback((date: Date) => {
    setForm((prev) => ({ ...prev, departureTime: formatDisplayTime(date) }));
    setTimePickerOpen(false);
  }, []);

  const addVehicle = useCallback(() => {
    triggerLightHaptic();
    router.push({
      pathname: ROUTES.addVehicle,
      params: { returnTo: 'modify-ride' },
    });
  }, [router]);

  const updateRide = useCallback(() => {
    triggerSuccessHaptic();
    showAppAlert(MODIFY_RIDE_SCREEN.updateSuccessTitle, MODIFY_RIDE_SCREEN.updateSuccessMessage);
    router.replace(ROUTES.myRides);
  }, [router]);

  const goBack = useCallback(() => {
    triggerLightHaptic();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  return {
    form,
    preferenceOptions: MODIFY_RIDE_PREFERENCE_OPTIONS,
    vehicles,
    datePickerOpen,
    timePickerOpen,
    selectedDate,
    selectedTime,
    minimumDate,
    updateField,
    togglePreference,
    selectVehicle,
    openDatePicker,
    closeDatePicker,
    openTimePicker,
    closeTimePicker,
    selectDate,
    selectTime,
    addVehicle,
    updateRide,
    goBack,
  };
};
