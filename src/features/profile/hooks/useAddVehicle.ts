import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import type { UploadedDocument } from '@/shared/components';
import { delay, triggerLightHaptic, triggerSuccessHaptic } from '@/shared/utils';
import { ADD_VEHICLE_SCREEN, VEHICLE_CATEGORIES } from '../constants';
import type { AddVehicleForm, VehicleCategoryId, VehicleCategoryOption } from '../types';

const INITIAL_FORM: AddVehicleForm = {
  category: 'sedan',
  model: '',
  color: '',
  plateNumber: '',
  documentUri: null,
  documentName: null,
};

export type AddVehicleSubmitState = 'idle' | 'submitting' | 'success';

export interface UseAddVehicleResult {
  form: AddVehicleForm;
  categories: readonly VehicleCategoryOption[];
  submitState: AddVehicleSubmitState;
  uploadSheetVisible: boolean;
  setCategory: (id: VehicleCategoryId) => void;
  setModel: (value: string) => void;
  setColor: (value: string) => void;
  setPlateNumber: (value: string) => void;
  openUpload: () => void;
  closeUpload: () => void;
  applyDocument: (document: UploadedDocument) => void;
  submit: () => Promise<void>;
  goBack: () => void;
}

export const useAddVehicle = (): UseAddVehicleResult => {
  const router = useRouter();
  const [form, setForm] = useState<AddVehicleForm>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<AddVehicleSubmitState>('idle');
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myGarage);
  }, [router]);

  const setCategory = useCallback((id: VehicleCategoryId) => {
    triggerLightHaptic();
    setForm((prev) => ({ ...prev, category: id }));
  }, []);

  const setModel = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, model: value }));
  }, []);

  const setColor = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, color: value }));
  }, []);

  const setPlateNumber = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, plateNumber: value.toUpperCase() }));
  }, []);

  const openUpload = useCallback(() => {
    triggerLightHaptic();
    setUploadSheetVisible(true);
  }, []);

  const closeUpload = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyDocument = useCallback((document: UploadedDocument) => {
    setForm((prev) => ({
      ...prev,
      documentUri: document.uri,
      documentName: document.fileName ?? 'RC Document',
    }));
  }, []);

  const submit = useCallback(async () => {
    if (submitState !== 'idle') {
      return;
    }

    const model = form.model.trim();
    const plateNumber = form.plateNumber.trim();
    if (!model || !plateNumber) {
      Alert.alert(ADD_VEHICLE_SCREEN.validationTitle, ADD_VEHICLE_SCREEN.validationMessage);
      return;
    }

    triggerLightHaptic();
    setSubmitState('submitting');
    await delay(1400);
    triggerSuccessHaptic();
    setSubmitState('success');
    await delay(900);
    router.replace(ROUTES.myGarage);
  }, [form.model, form.plateNumber, router, submitState]);

  return {
    form,
    categories: VEHICLE_CATEGORIES,
    submitState,
    uploadSheetVisible,
    setCategory,
    setModel,
    setColor,
    setPlateNumber,
    openUpload,
    closeUpload,
    applyDocument,
    submit,
    goBack,
  };
};
