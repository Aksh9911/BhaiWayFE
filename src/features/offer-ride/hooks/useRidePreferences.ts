import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { vehiclesSheetStore, vehiclesSheetSync } from '@/DemoData';
import {
  formatBhaiWayCoins,
  showAppAlert,
  triggerLightHaptic,
  triggerSuccessHaptic,
} from '@/shared/utils';
import {
  RIDE_PREFERENCE_OPTIONS,
  RIDE_PREFERENCES_SCREEN,
} from '../constants';
import { publishRideDraft } from '../store';
import type {
  PublishRideDraft,
  PublishRideVehicleOption,
  RidePreferenceId,
} from '../types';
import { commitPublishedFromDraft, mapGarageVehicleToOption } from '../utils';

export interface UseRidePreferencesResult {
  draft: PublishRideDraft;
  isAssured: boolean;
  preferenceOptions: typeof RIDE_PREFERENCE_OPTIONS;
  vehicles: readonly PublishRideVehicleOption[];
  notesLength: number;
  canPublish: boolean;
  refundableAmountLabel: string;
  totalToPayLabel: string;
  primaryCtaLabel: string;
  togglePreference: (id: RidePreferenceId) => void;
  setNotes: (notes: string) => void;
  selectVehicle: (vehicleId: string) => void;
  setPromoCode: (code: string) => void;
  applyPromo: () => void;
  addVehicle: () => void;
  publish: () => void;
  goBack: () => void;
}

const getGarageSnapshot = (): string =>
  vehiclesSheetStore
    .getForCurrentUser()
    .map(
      (row) =>
        `${row.row_id}:${row.vehicleId}:${row.vehicleModel}:${row.vehicleColor}:${row.vehicleNumberPlate}`,
    )
    .join('|');

const subscribeGarage = (onStoreChange: () => void): (() => void) =>
  vehiclesSheetStore.subscribe(() => onStoreChange());

export const useRidePreferences = (): UseRidePreferencesResult => {
  const router = useRouter();
  const [draft, setDraft] = useState<PublishRideDraft>(() => publishRideDraft.get());
  const garageSnapshot = useSyncExternalStore(subscribeGarage, getGarageSnapshot);

  useEffect(() => publishRideDraft.subscribe(setDraft), []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        try {
          await vehiclesSheetSync.pullIntoLocal();
        } catch {
          // keep local garage rows
        }
        if (!active) {
          return;
        }
        const options = vehiclesSheetStore.getForCurrentUser().map(mapGarageVehicleToOption);
        const current = publishRideDraft.get();
        const stillValid = options.some((item) => item.id === current.selectedVehicleId);
        if (!stillValid) {
          publishRideDraft.update({
            selectedVehicleId: options[0]?.id ?? null,
          });
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const vehicles = useMemo(
    () => vehiclesSheetStore.getForCurrentUser().map(mapGarageVehicleToOption),
    [garageSnapshot],
  );

  const isAssured = draft.rideType === 'assured';

  const refundableAmountLabel = useMemo(
    () =>
      formatBhaiWayCoins(Number(RIDE_PREFERENCES_SCREEN.assuredRefundableAmount), {
        spaced: false,
        minimumFractionDigits: 2,
      }),
    [],
  );

  const totalToPayLabel = useMemo(() => {
    if (!isAssured) {
      return formatBhaiWayCoins(0, { spaced: false, minimumFractionDigits: 2 });
    }
    return formatBhaiWayCoins(Number(RIDE_PREFERENCES_SCREEN.assuredRefundableAmount), {
      spaced: false,
      minimumFractionDigits: 2,
    });
  }, [isAssured]);

  const primaryCtaLabel = isAssured
    ? RIDE_PREFERENCES_SCREEN.confirmPayLabel
    : RIDE_PREFERENCES_SCREEN.publishLabel;

  const togglePreference = useCallback((id: RidePreferenceId) => {
    triggerLightHaptic();
    const current = publishRideDraft.get();
    publishRideDraft.update({
      preferences: {
        ...current.preferences,
        [id]: !current.preferences[id],
      },
    });
  }, []);

  const setNotes = useCallback((notes: string) => {
    const trimmed = notes.slice(0, RIDE_PREFERENCES_SCREEN.notesMaxLength);
    publishRideDraft.update({ notes: trimmed });
  }, []);

  const selectVehicle = useCallback((vehicleId: string) => {
    triggerLightHaptic();
    publishRideDraft.update({ selectedVehicleId: vehicleId });
  }, []);

  const setPromoCode = useCallback((code: string) => {
    publishRideDraft.update({
      promoCode: code,
      promoApplied: false,
    });
  }, []);

  const applyPromo = useCallback(() => {
    triggerLightHaptic();
    const current = publishRideDraft.get();
    const code = current.promoCode.trim();
    if (!code) {
      showAppAlert('Promo code', RIDE_PREFERENCES_SCREEN.promoInvalidMessage);
      return;
    }
    publishRideDraft.update({ promoApplied: true });
    showAppAlert('Promo code', RIDE_PREFERENCES_SCREEN.promoAppliedMessage);
  }, []);

  const addVehicle = useCallback(() => {
    triggerLightHaptic();
    router.push({
      pathname: ROUTES.addVehicle,
      params: { returnTo: 'offer-ride-preferences' },
    });
  }, [router]);

  const publish = useCallback(() => {
    const current = publishRideDraft.get();
    if (!current.selectedVehicleId) {
      showAppAlert(
        RIDE_PREFERENCES_SCREEN.missingVehicleTitle,
        RIDE_PREFERENCES_SCREEN.missingVehicleMessage,
      );
      return;
    }

    // Assured: collect payment method next, then confirm publish.
    if (current.rideType === 'assured') {
      triggerLightHaptic();
      router.push(ROUTES.offerRidePayment);
      return;
    }

    triggerSuccessHaptic();
    void (async () => {
      await commitPublishedFromDraft();
      router.replace(ROUTES.offerRidePublished);
    })();
  }, [router]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.offerRidePublish);
  }, [router]);

  return {
    draft,
    isAssured,
    preferenceOptions: RIDE_PREFERENCE_OPTIONS,
    vehicles,
    notesLength: draft.notes.length,
    canPublish: Boolean(draft.selectedVehicleId) && vehicles.length > 0,
    refundableAmountLabel,
    totalToPayLabel,
    primaryCtaLabel,
    togglePreference,
    setNotes,
    selectVehicle,
    setPromoCode,
    applyPromo,
    addVehicle,
    publish,
    goBack,
  };
};
