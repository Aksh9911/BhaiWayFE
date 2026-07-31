import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import type { UploadedDocument } from '@/shared/components';
import { delay, triggerLightHaptic } from '@/shared/utils';
import { WORK_EMAIL_PATTERN } from '../constants/corporate-verification.constants';
import type {
  CorporateVerificationErrors,
  CorporateVerificationForm,
  IdUploadSide,
} from '../types/corporate-verification.types';

const INITIAL_FORM: CorporateVerificationForm = {
  companyName: '',
  workEmail: '',
  frontIdUri: null,
  backIdUri: null,
  frontFileName: null,
};

export interface UseCorporateVerificationResult {
  form: CorporateVerificationForm;
  errors: CorporateVerificationErrors;
  frontStatus: 'idle' | 'uploading' | 'uploaded';
  submitting: boolean;
  uploadSheetVisible: boolean;
  openUpload: (side: IdUploadSide) => void;
  closeUpload: () => void;
  applyUploadedDocument: (document: UploadedDocument) => Promise<void>;
  setCompanyName: (value: string) => void;
  setWorkEmail: (value: string) => void;
  submit: () => Promise<void>;
  goBack: () => void;
}

export const useCorporateVerification = (): UseCorporateVerificationResult => {
  const router = useRouter();
  const pendingSideRef = useRef<IdUploadSide>('front');
  const [form, setForm] = useState<CorporateVerificationForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<CorporateVerificationErrors>({});
  const [frontStatus, setFrontStatus] = useState<'idle' | 'uploading' | 'uploaded'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);

  const setCompanyName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, companyName: value }));
    setErrors((prev) => ({ ...prev, companyName: undefined }));
  }, []);

  const setWorkEmail = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, workEmail: value }));
    setErrors((prev) => ({ ...prev, workEmail: undefined }));
  }, []);

  const openUpload = useCallback((side: IdUploadSide) => {
    triggerLightHaptic();
    pendingSideRef.current = side;
    setUploadSheetVisible(true);
  }, []);

  const closeUpload = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyUploadedDocument = useCallback(async (document: UploadedDocument) => {
    const side = pendingSideRef.current;
    setUploadSheetVisible(false);

    if (side === 'front') {
      setFrontStatus('uploading');
      setErrors((prev) => ({ ...prev, frontId: undefined }));
      await delay(900);
      setForm((prev) => ({
        ...prev,
        frontIdUri: document.uri,
        frontFileName: document.fileName ?? 'front_view_id.jpg',
      }));
      setFrontStatus('uploaded');
      return;
    }

    setForm((prev) => ({ ...prev, backIdUri: document.uri }));
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
    if (!form.frontIdUri) {
      next.frontId = 'Upload a photo of your corporate ID card.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [form.companyName, form.frontIdUri, form.workEmail]);

  const submit = useCallback(async () => {
    if (submitting) {
      return;
    }
    if (!validate()) {
      return;
    }

    triggerLightHaptic();
    setSubmitting(true);
    try {
      await delay(1200);
      router.replace(ROUTES.officeCommuteVerifySuccess);
    } finally {
      setSubmitting(false);
    }
  }, [router, submitting, validate]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.officeCommute);
  }, [router]);

  return {
    form,
    errors,
    frontStatus,
    submitting,
    uploadSheetVisible,
    openUpload,
    closeUpload,
    applyUploadedDocument,
    setCompanyName,
    setWorkEmail,
    submit,
    goBack,
  };
};
