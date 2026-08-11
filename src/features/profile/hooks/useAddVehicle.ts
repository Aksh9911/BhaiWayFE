import { useCallback, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  demoVehiclesStore,
  mapVehicleCategoryToDemo,
  resolveDemoOwnerId,
  splitVehicleModel,
  vehiclesSheetSync,
} from '@/DemoData';
import { authSession } from '@/store';
import { saveVehicleRcUrl } from '@/features/media';
import { createVehicle } from '@/features/profile/api';
import { uploadFile } from '@/services/cloudinary';
import type { UploadedDocument } from '@/shared/components';
import { compressImage } from '@/utils/imageCompression';
import { CloudinaryUploadError } from '@/types/cloudinary';
import {
  getSearchParam,
  logger,
  triggerLightHaptic,
  triggerSuccessHaptic,
  showAppAlert,
} from '@/shared/utils';
import { ADD_VEHICLE_SCREEN, VEHICLE_CATEGORIES } from '../constants';
import type { AddVehicleForm, VehicleCategoryId, VehicleCategoryOption } from '../types';

const INITIAL_FORM: AddVehicleForm = {
  category: 'sedan',
  model: '',
  color: '',
  plateNumber: '',
  documentUri: null,
  documentName: null,
  documentSecureUrl: null,
  documentPublicId: null,
};

const isFolderRestrictionError = (error: unknown): boolean => {
  if (!(error instanceof CloudinaryUploadError)) {
    return false;
  }
  const message = error.message.toLowerCase();
  return (
    message.includes('folder') ||
    message.includes('preset') ||
    message.includes('not allowed')
  );
};

export type AddVehicleSubmitState = 'idle' | 'submitting' | 'success';

export interface UseAddVehicleResult {
  form: AddVehicleForm;
  categories: readonly VehicleCategoryOption[];
  submitState: AddVehicleSubmitState;
  uploadSheetVisible: boolean;
  isUploadingDocument: boolean;
  uploadProgress: number;
  /** Latest Cloudinary HTTPS URL ready for the backend. */
  cloudinaryUrl: string | null;
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
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const returnTo = getSearchParam(params.returnTo);
  const [form, setForm] = useState<AddVehicleForm>(INITIAL_FORM);
  const [submitState, setSubmitState] = useState<AddVehicleSubmitState>('idle');
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadGenerationRef = useRef(0);

  const leaveAfterSave = useCallback(() => {
    if (returnTo === 'offer-ride-preferences') {
      router.replace(ROUTES.offerRidePreferences);
      return;
    }
    if (returnTo === 'modify-ride') {
      if (router.canGoBack()) {
        router.back();
        return;
      }
      router.replace(ROUTES.myRides);
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myGarage);
  }, [returnTo, router]);

  const goBack = useCallback(() => {
    leaveAfterSave();
  }, [leaveAfterSave]);

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
    if (isUploadingDocument) {
      return;
    }
    triggerLightHaptic();
    setUploadSheetVisible(true);
  }, [isUploadingDocument]);

  const closeUpload = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyDocument = useCallback((document: UploadedDocument) => {
    const generation = ++uploadGenerationRef.current;
    const stamp = Date.now();
    const fileName = document.fileName?.trim() || `rc_${stamp}.jpg`;
    const mimeType = document.mimeType?.trim() || 'image/jpeg';

    setForm((prev) => ({
      ...prev,
      documentUri: document.uri,
      documentName: fileName,
      documentSecureUrl: null,
      documentPublicId: null,
    }));
    setIsUploadingDocument(true);
    setUploadProgress(0);

    void (async () => {
      try {
        const compressed = await compressImage(document.uri, {
          maxDimension: 1600,
          quality: 0.75,
          squareCrop: false,
        });

        if (generation !== uploadGenerationRef.current) {
          return;
        }

        let uploaded;
        try {
          uploaded = await uploadFile({
            uri: compressed.uri,
            kind: 'rc',
            fileName,
            mimeType: compressed.mimeType ?? mimeType,
            resourceType: 'image',
            onProgress: setUploadProgress,
          });
        } catch (firstError) {
          if (!isFolderRestrictionError(firstError)) {
            throw firstError;
          }
          logger.warn('RC folder rejected by preset — retrying without folder', firstError);
          uploaded = await uploadFile({
            uri: compressed.uri,
            fileName,
            mimeType: compressed.mimeType ?? mimeType,
            resourceType: 'image',
            publicId: `rc_${stamp}`,
            skipFolder: true,
            onProgress: setUploadProgress,
          });
        }

        if (generation !== uploadGenerationRef.current) {
          return;
        }

        // Persist URL to backend media table (or mock log).
        await saveVehicleRcUrl(uploaded);

        setForm((prev) => ({
          ...prev,
          documentUri: uploaded.secureUrl,
          documentName: fileName,
          documentSecureUrl: uploaded.secureUrl,
          documentPublicId: uploaded.publicId,
        }));

        logger.info('RC Cloudinary URL ready for backend', {
          secureUrl: uploaded.secureUrl,
          publicId: uploaded.publicId,
        });

        triggerSuccessHaptic();
      } catch (error) {
        if (generation !== uploadGenerationRef.current) {
          return;
        }
        logger.error('Vehicle RC Cloudinary upload failed', error);
        setForm((prev) => ({
          ...prev,
          documentUri: null,
          documentName: null,
          documentSecureUrl: null,
          documentPublicId: null,
        }));
        const message =
          error instanceof CloudinaryUploadError
            ? error.message
            : 'Unable to upload your RC document. Please try again.';
        showAppAlert('Upload failed', message);
      } finally {
        if (generation === uploadGenerationRef.current) {
          setIsUploadingDocument(false);
          setUploadProgress(0);
        }
      }
    })();
  }, []);

  const submit = useCallback(async () => {
    if (submitState !== 'idle' || isUploadingDocument) {
      return;
    }

    const model = form.model.trim();
    const plateNumber = form.plateNumber.trim();
    if (!model || !plateNumber) {
      showAppAlert(ADD_VEHICLE_SCREEN.validationTitle, ADD_VEHICLE_SCREEN.validationMessage);
      return;
    }

    if (form.documentUri && !form.documentSecureUrl) {
      showAppAlert(
        'Document still uploading',
        'Please wait for the RC upload to finish, or re-upload the document.',
      );
      return;
    }

    triggerLightHaptic();
    setSubmitState('submitting');

    try {
      const response = await createVehicle({
        category: form.category,
        model,
        color: form.color.trim(),
        plateNumber,
        // Backend receives Cloudinary HTTPS URL (not a local file:// URI).
        rcDocumentUrl: form.documentSecureUrl,
        rcDocumentPublicId: form.documentPublicId,
      });

      logger.info('Vehicle created with Cloudinary RC URL', {
        vehicleId: response.id,
        rcDocumentUrl: response.rcDocumentUrl ?? form.documentSecureUrl,
      });

      const { make, model: modelName } = splitVehicleModel(model);
      const vehicleType = mapVehicleCategoryToDemo(form.category);
      await demoVehiclesStore.add({
        owner_id: resolveDemoOwnerId(),
        make,
        model: modelName,
        vehicle_number: plateNumber,
        vehicle_type: vehicleType,
        color: form.color.trim() || 'Unknown',
        year: new Date().getFullYear(),
        seats: 4,
        ac: true,
      });

      const sessionUser = authSession.getUser();
      try {
        await vehiclesSheetSync.upsertAndSync({
          mobile: sessionUser?.phone ?? '',
          vehicleModel: model.trim(),
          vehicleColor: form.color.trim(),
          vehicleType,
          vehicleNumberPlate: plateNumber,
          rc: form.documentSecureUrl ?? undefined,
        });
      } catch (error) {
        console.log('[AddVehicle] sheet sync failed', error);
      }

      triggerSuccessHaptic();
      setSubmitState('success');

      setTimeout(() => {
        leaveAfterSave();
      }, 700);
    } catch (error) {
      setSubmitState('idle');
      const message =
        error instanceof Error ? error.message : 'Unable to save the vehicle. Please try again.';
      showAppAlert('Save failed', message);
    }
  }, [form, isUploadingDocument, leaveAfterSave, submitState]);

  return {
    form,
    categories: VEHICLE_CATEGORIES,
    submitState,
    uploadSheetVisible,
    isUploadingDocument,
    uploadProgress,
    cloudinaryUrl: form.documentSecureUrl,
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
