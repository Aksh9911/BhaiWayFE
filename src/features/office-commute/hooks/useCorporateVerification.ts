import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { userDetailsSheetSync } from '@/DemoData';
import { saveCorporateIdUrl } from '@/features/media';
import { uploadFile } from '@/services/cloudinary';
import type { UploadedDocument } from '@/shared/components';
import {
  delay,
  logger,
  showAppAlert,
  triggerLightHaptic,
  triggerSuccessHaptic,
} from '@/shared/utils';
import { showUploadFeedback } from '@/shared/utils/feedback';
import { CloudinaryUploadError } from '@/types/cloudinary';
import { compressImage } from '@/utils/imageCompression';
import {
  CORPORATE_VERIFICATION_SCREEN,
  WORK_EMAIL_PATTERN,
} from '../constants/corporate-verification.constants';
import { corporateVerificationStore } from '../store/corporateVerificationStore';
import { authSession } from '@/store';
import type {
  CorporateVerificationErrors,
  CorporateVerificationForm,
  CorporateVerificationStep,
  IdUploadSide,
} from '../types/corporate-verification.types';

const INITIAL_FORM: CorporateVerificationForm = {
  companyName: '',
  workEmail: '',
  frontIdUri: null,
  backIdUri: null,
  frontFileName: null,
  frontSecureUrl: null,
  frontPublicId: null,
  backSecureUrl: null,
  backPublicId: null,
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

const maskWorkEmail = (email: string): string => {
  const trimmed = email.trim();
  const at = trimmed.indexOf('@');
  if (at <= 1) {
    return trimmed;
  }
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at);
  const visible = local.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 2))}${domain}`;
};

export interface UseCorporateVerificationResult {
  step: CorporateVerificationStep;
  form: CorporateVerificationForm;
  errors: CorporateVerificationErrors;
  frontStatus: 'idle' | 'uploading' | 'uploaded';
  backStatus: 'idle' | 'uploading' | 'uploaded';
  submitting: boolean;
  otpValue: string;
  otpError: string | null;
  maskedWorkEmail: string;
  uploadSheetVisible: boolean;
  openUpload: (side: IdUploadSide) => void;
  closeUpload: () => void;
  applyUploadedDocument: (document: UploadedDocument) => Promise<void>;
  setCompanyName: (value: string) => void;
  setWorkEmail: (value: string) => void;
  setOtpValue: (value: string) => void;
  submitDetails: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  resendOtp: () => Promise<void>;
  backToDetails: () => void;
  goBack: () => void;
}

export const useCorporateVerification = (): UseCorporateVerificationResult => {
  const router = useRouter();
  const pendingSideRef = useRef<IdUploadSide>('front');
  const uploadGenerationRef = useRef(0);
  const [step, setStep] = useState<CorporateVerificationStep>('details');
  const [form, setForm] = useState<CorporateVerificationForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<CorporateVerificationErrors>({});
  const [frontStatus, setFrontStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle');
  const [backStatus, setBackStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [otpValue, setOtpValueState] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);

  useEffect(
    () => () => {
      uploadGenerationRef.current += 1;
    },
    [],
  );

  const setCompanyName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, companyName: value }));
    setErrors((prev) => ({ ...prev, companyName: undefined }));
  }, []);

  const setWorkEmail = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, workEmail: value }));
    setErrors((prev) => ({ ...prev, workEmail: undefined }));
  }, []);

  const setOtpValue = useCallback((value: string) => {
    setOtpValueState(value.replace(/\D/g, '').slice(0, CORPORATE_VERIFICATION_SCREEN.otpLength));
    setOtpError(null);
  }, []);

  const openUpload = useCallback((side: IdUploadSide) => {
    if (frontStatus === 'uploading' || backStatus === 'uploading') {
      return;
    }
    triggerLightHaptic();
    pendingSideRef.current = side;
    setUploadSheetVisible(true);
  }, [backStatus, frontStatus]);

  const closeUpload = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyUploadedDocument = useCallback(async (document: UploadedDocument) => {
    const side = pendingSideRef.current;
    const generation = ++uploadGenerationRef.current;
    const stamp = Date.now();
    const fileName =
      document.fileName?.trim() ||
      (side === 'front' ? `corporate_id_front_${stamp}.jpg` : `corporate_id_back_${stamp}.jpg`);
    const mimeType = document.mimeType?.trim() || 'image/jpeg';

    setUploadSheetVisible(false);

    if (side === 'front') {
      setFrontStatus('uploading');
      setErrors((prev) => ({ ...prev, frontId: undefined }));
      setForm((prev) => ({
        ...prev,
        frontIdUri: document.uri,
        frontFileName: fileName,
        frontSecureUrl: null,
        frontPublicId: null,
      }));
    } else {
      setBackStatus('uploading');
      setForm((prev) => ({
        ...prev,
        backIdUri: document.uri,
        backSecureUrl: null,
        backPublicId: null,
      }));
    }

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
          kind: 'corporateId',
          fileName,
          mimeType: compressed.mimeType ?? mimeType,
          resourceType: 'image',
        });
      } catch (firstError) {
        if (!isFolderRestrictionError(firstError)) {
          throw firstError;
        }
        logger.warn('Corporate ID folder rejected by preset — retrying without folder', firstError);
        uploaded = await uploadFile({
          uri: compressed.uri,
          fileName,
          mimeType: compressed.mimeType ?? mimeType,
          resourceType: 'image',
          publicId: `corporate_id_${side}_${stamp}`,
          skipFolder: true,
        });
      }

      if (generation !== uploadGenerationRef.current) {
        return;
      }

      await saveCorporateIdUrl(uploaded);

      if (side === 'front') {
        setForm((prev) => ({
          ...prev,
          frontIdUri: uploaded.secureUrl,
          frontFileName: fileName,
          frontSecureUrl: uploaded.secureUrl,
          frontPublicId: uploaded.publicId,
        }));
        setFrontStatus('uploaded');
      } else {
        setForm((prev) => ({
          ...prev,
          backIdUri: uploaded.secureUrl,
          backSecureUrl: uploaded.secureUrl,
          backPublicId: uploaded.publicId,
        }));
        setBackStatus('uploaded');
      }

      logger.info('Corporate ID Cloudinary URL ready for backend', {
        side,
        secureUrl: uploaded.secureUrl,
        publicId: uploaded.publicId,
        folder: uploaded.folder,
      });

      triggerSuccessHaptic();
    } catch (error) {
      if (generation !== uploadGenerationRef.current) {
        return;
      }

      logger.error('Corporate ID Cloudinary upload failed', error);

      if (side === 'front') {
        setForm((prev) => ({
          ...prev,
          frontIdUri: null,
          frontFileName: null,
          frontSecureUrl: null,
          frontPublicId: null,
        }));
        setFrontStatus('idle');
        setErrors((prev) => ({
          ...prev,
          frontId: 'Upload failed. Please try again.',
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          backIdUri: null,
          backSecureUrl: null,
          backPublicId: null,
        }));
        setBackStatus('idle');
      }

      showUploadFeedback(error);
    }
  }, []);

  const validate = useCallback((): boolean => {
    const next: CorporateVerificationErrors = {};
    if (!form.companyName.trim()) {
      next.companyName = 'Enter your company name.';
    }
    if (!form.workEmail.trim()) {
      next.workEmail = 'Enter your work email.';
    } else if (!WORK_EMAIL_PATTERN.test(form.workEmail.trim())) {
      next.workEmail = 'Enter a valid work email address.';
    }
    if (!form.frontSecureUrl) {
      next.frontId =
        frontStatus === 'uploading'
          ? 'Please wait for the Corporate ID upload to finish.'
          : 'Upload a photo of your corporate ID card.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form.companyName, form.frontSecureUrl, form.workEmail, frontStatus]);

  const submitDetails = useCallback(async () => {
    if (submitting || frontStatus === 'uploading' || backStatus === 'uploading') {
      return;
    }
    if (!validate()) {
      return;
    }

    triggerLightHaptic();
    setSubmitting(true);
    try {
      await delay(900);
      setOtpValueState('');
      setOtpError(null);
      setStep('otp');
    } finally {
      setSubmitting(false);
    }
  }, [backStatus, frontStatus, submitting, validate]);

  const verifyOtp = useCallback(async () => {
    if (submitting) {
      return;
    }

    triggerLightHaptic();

    if (otpValue.length !== CORPORATE_VERIFICATION_SCREEN.otpLength) {
      setOtpError(CORPORATE_VERIFICATION_SCREEN.otpInvalidMessage);
      return;
    }

    setSubmitting(true);
    try {
      await delay(700);

      if (otpValue !== CORPORATE_VERIFICATION_SCREEN.demoOtp) {
        setOtpError(CORPORATE_VERIFICATION_SCREEN.otpInvalidMessage);
        return;
      }

      corporateVerificationStore.set({
        workEmail: form.workEmail.trim(),
        companyName: form.companyName.trim(),
        verifiedAt: new Date().toISOString(),
      });

      const sessionUser = authSession.getUser();
      try {
        await userDetailsSheetSync.validateAndSync({
          userName: sessionUser?.fullName?.trim() || form.companyName.trim(),
          corporateId: form.companyName.trim() || form.workEmail.trim(),
          mobile: sessionUser?.phone ?? '',
          corporateIdUrl: form.frontSecureUrl ?? undefined,
        });
      } catch (error) {
        console.log('[CorporateVerification] sheet sync failed', error);
      }

      triggerSuccessHaptic();
      router.replace(ROUTES.officeCommuteVerifySuccess);
    } finally {
      setSubmitting(false);
    }
  }, [form.companyName, form.workEmail, otpValue, router, submitting]);

  const resendOtp = useCallback(async () => {
    if (submitting) {
      return;
    }
    triggerLightHaptic();
    setSubmitting(true);
    try {
      await delay(600);
      setOtpValueState('');
      setOtpError(null);
    } finally {
      setSubmitting(false);
    }
  }, [submitting]);

  const backToDetails = useCallback(() => {
    triggerLightHaptic();
    setStep('details');
    setOtpValueState('');
    setOtpError(null);
    setSubmitting(false);
  }, []);

  const goBack = useCallback(() => {
    if (step === 'otp') {
      backToDetails();
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.officeCommute);
  }, [backToDetails, router, step]);

  return {
    step,
    form,
    errors,
    frontStatus,
    backStatus,
    submitting,
    otpValue,
    otpError,
    maskedWorkEmail: maskWorkEmail(form.workEmail),
    uploadSheetVisible,
    openUpload,
    closeUpload,
    applyUploadedDocument,
    setCompanyName,
    setWorkEmail,
    setOtpValue,
    submitDetails,
    verifyOtp,
    resendOtp,
    backToDetails,
    goBack,
  };
};
