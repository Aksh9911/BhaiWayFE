import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { saveIssueReportUrl } from '@/features/media';
import { uploadFile } from '@/services/cloudinary';
import type { UploadedDocument } from '@/shared/components';
import {
  logger,
  getSearchParam,
  showAppAlert,
  triggerLightHaptic,
  triggerSuccessHaptic,
} from '@/shared/utils';
import { showUploadFeedback } from '@/shared/utils/feedback';
import { CloudinaryUploadError } from '@/types/cloudinary';
import { compressImage } from '@/utils/imageCompression';
import {
  REPORT_ISSUE_CATEGORIES,
  REPORT_ISSUE_SCREEN,
  createIssueReportReference,
  getIssueReportedPath,
  getReportIssueRideSummary,
} from '../constants';
import type {
  ReportIssueCategoryId,
  ReportIssueFormState,
  ReportIssueRideSummary,
} from '../types';

const INITIAL_FORM: ReportIssueFormState = {
  categoryId: 'driver',
  description: '',
  photoUri: null,
  photoFileName: null,
  photoSecureUrl: null,
  photoPublicId: null,
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

export interface UseReportIssueResult {
  ride: ReportIssueRideSummary;
  form: ReportIssueFormState;
  categories: typeof REPORT_ISSUE_CATEGORIES;
  photoStatus: 'idle' | 'uploading' | 'uploaded';
  submitting: boolean;
  uploadSheetVisible: boolean;
  selectCategory: (id: ReportIssueCategoryId) => void;
  setDescription: (value: string) => void;
  openUpload: () => void;
  closeUpload: () => void;
  applyUploadedDocument: (document: UploadedDocument) => Promise<void>;
  submit: () => Promise<void>;
  openInfo: () => void;
  goBack: () => void;
}

export const useReportIssue = (): UseReportIssueResult => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    rideId?: string;
    pickupLabel?: string;
    dropoffLabel?: string;
    dateLabel?: string;
  }>();
  const uploadGenerationRef = useRef(0);

  const [form, setForm] = useState<ReportIssueFormState>(INITIAL_FORM);
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);

  const ride = useMemo(
    () =>
      getReportIssueRideSummary({
        rideId: getSearchParam(params.rideId) || undefined,
        pickupLabel: getSearchParam(params.pickupLabel) || undefined,
        dropoffLabel: getSearchParam(params.dropoffLabel) || undefined,
        dateLabel: getSearchParam(params.dateLabel) || undefined,
      }),
    [params.dateLabel, params.dropoffLabel, params.pickupLabel, params.rideId],
  );

  useEffect(
    () => () => {
      uploadGenerationRef.current += 1;
    },
    [],
  );

  const selectCategory = useCallback((id: ReportIssueCategoryId) => {
    triggerLightHaptic();
    setForm((prev) => ({ ...prev, categoryId: id }));
  }, []);

  const setDescription = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, description: value }));
  }, []);

  const openUpload = useCallback(() => {
    if (photoStatus === 'uploading' || submitting) {
      return;
    }
    triggerLightHaptic();
    setUploadSheetVisible(true);
  }, [photoStatus, submitting]);

  const closeUpload = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyUploadedDocument = useCallback(async (document: UploadedDocument) => {
    const generation = ++uploadGenerationRef.current;
    const stamp = Date.now();
    const fileName = document.fileName?.trim() || `issue_report_${stamp}.jpg`;
    const mimeType = document.mimeType?.trim() || 'image/jpeg';

    setUploadSheetVisible(false);
    setPhotoStatus('uploading');
    setForm((prev) => ({
      ...prev,
      photoUri: document.uri,
      photoFileName: fileName,
      photoSecureUrl: null,
      photoPublicId: null,
    }));

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
          kind: 'issueReport',
          fileName,
          mimeType: compressed.mimeType ?? mimeType,
          resourceType: 'image',
        });
      } catch (firstError) {
        if (!isFolderRestrictionError(firstError)) {
          throw firstError;
        }
        logger.warn('Issue report folder rejected by preset — retrying without folder', firstError);
        uploaded = await uploadFile({
          uri: compressed.uri,
          fileName,
          mimeType: compressed.mimeType ?? mimeType,
          resourceType: 'image',
          publicId: `issue_report_${stamp}`,
          skipFolder: true,
        });
      }

      if (generation !== uploadGenerationRef.current) {
        return;
      }

      await saveIssueReportUrl(uploaded);

      setForm((prev) => ({
        ...prev,
        photoUri: uploaded.secureUrl,
        photoFileName: fileName,
        photoSecureUrl: uploaded.secureUrl,
        photoPublicId: uploaded.publicId,
      }));
      setPhotoStatus('uploaded');

      logger.info('Issue report Cloudinary URL ready for backend', {
        secureUrl: uploaded.secureUrl,
        publicId: uploaded.publicId,
        folder: uploaded.folder,
      });

      triggerSuccessHaptic();
      showAppAlert('Uploaded', 'Photo uploaded successfully.');
    } catch (error) {
      if (generation !== uploadGenerationRef.current) {
        return;
      }
      logger.error('Issue report Cloudinary upload failed', error);
      setForm((prev) => ({
        ...prev,
        photoUri: null,
        photoFileName: null,
        photoSecureUrl: null,
        photoPublicId: null,
      }));
      setPhotoStatus('idle');
      showUploadFeedback(error);
    }
  }, []);

  const submit = useCallback(async () => {
    if (submitting || photoStatus === 'uploading') {
      return;
    }

    if (!form.categoryId) {
      showAppAlert('Missing category', REPORT_ISSUE_SCREEN.validationCategory);
      return;
    }
    if (!form.description.trim()) {
      showAppAlert('Missing details', REPORT_ISSUE_SCREEN.validationDescription);
      return;
    }

    triggerLightHaptic();
    setSubmitting(true);
    try {
      logger.info('Ride issue report submitted', {
        rideId: ride.rideId,
        categoryId: form.categoryId,
        description: form.description.trim(),
        photoSecureUrl: form.photoSecureUrl,
        photoPublicId: form.photoPublicId,
      });
      await new Promise((resolve) => setTimeout(resolve, 700));
      const referenceNumber = createIssueReportReference();
      triggerSuccessHaptic();
      router.replace(
        getIssueReportedPath({
          rideId: ride.rideId,
          referenceNumber,
          pickupLabel: ride.originLabel,
          dropoffLabel: ride.destinationLabel,
          dateLabel: ride.dateLabel,
        }),
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    form.categoryId,
    form.description,
    form.photoPublicId,
    form.photoSecureUrl,
    photoStatus,
    ride.dateLabel,
    ride.destinationLabel,
    ride.originLabel,
    ride.rideId,
    router,
    submitting,
  ]);

  const openInfo = useCallback(() => {
    triggerLightHaptic();
    showAppAlert(REPORT_ISSUE_SCREEN.infoTitle, REPORT_ISSUE_SCREEN.infoMessage);
  }, []);

  const goBack = useCallback(() => {
    triggerLightHaptic();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  return {
    ride,
    form,
    categories: REPORT_ISSUE_CATEGORIES,
    photoStatus,
    submitting,
    uploadSheetVisible,
    selectCategory,
    setDescription,
    openUpload,
    closeUpload,
    applyUploadedDocument,
    submit,
    openInfo,
    goBack,
  };
};
