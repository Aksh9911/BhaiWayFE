import { useCallback, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { userDetailsSheetSync } from '@/DemoData';
import type { DashedUploadCardStatus, UploadedDocument } from '@/shared/components';
import { useSessionUser } from '@/shared/hooks';
import { delay, triggerLightHaptic, triggerSuccessHaptic, showAppAlert } from '@/shared/utils';
import { DEFAULT_PROFILE_AVATAR } from '../constants/profile.constants';
import { VERIFY_AADHAAR_SCREEN } from '../constants/verify-aadhaar.constants';
import { aadhaarVerificationStore } from '../store/aadhaarVerificationStore';
import type {
  AadhaarCardSide,
  AadhaarVerifyForm,
  AadhaarVerifyStep,
  AadhaarVerifySubmitState,
} from '../types';
import {
  formatAadhaarNumber,
  formatDobInput,
  isValidAadhaarNumber,
  maskAadhaarNumber,
  sanitizeAadhaarDigits,
} from '../utils/aadhaar';

const INITIAL_FORM: AadhaarVerifyForm = {
  fullName: '',
  aadhaarNumber: '',
  dateOfBirth: '',
  consentAccepted: false,
  frontIdUri: null,
  frontFileName: null,
  backIdUri: null,
  backFileName: null,
};

export interface UseVerifyAadhaarResult {
  step: AadhaarVerifyStep;
  form: AadhaarVerifyForm;
  otpValue: string;
  otpError: string | null;
  submitState: AadhaarVerifySubmitState;
  frontStatus: DashedUploadCardStatus;
  backStatus: DashedUploadCardStatus;
  uploadSheetVisible: boolean;
  uploadSide: AadhaarCardSide;
  avatarUri: string;
  maskedMobile: string;
  formattedAadhaar: string;
  setFullName: (value: string) => void;
  setAadhaarNumber: (value: string) => void;
  setDateOfBirth: (value: string) => void;
  toggleConsent: () => void;
  openUpload: (side: AadhaarCardSide) => void;
  closeUpload: () => void;
  applyUploadedDocument: (document: UploadedDocument) => void;
  setOtpValue: (value: string) => void;
  continueToOtp: () => Promise<void>;
  verifyOtp: () => Promise<void>;
  resendOtp: () => void;
  resendModalVisible: boolean;
  closeResendModal: () => void;
  backToDetails: () => void;
  goBack: () => void;
  openProfile: () => void;
}

export const useVerifyAadhaar = (): UseVerifyAadhaarResult => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthFlow = pathname.includes('/login');
  const user = useSessionUser();
  const [step, setStep] = useState<AadhaarVerifyStep>('details');
  const [form, setForm] = useState<AadhaarVerifyForm>(() => ({
    ...INITIAL_FORM,
    fullName: user?.fullName?.trim() ?? '',
  }));
  const [otpValue, setOtpValueState] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [submitState, setSubmitState] = useState<AadhaarVerifySubmitState>('idle');
  const [frontStatus, setFrontStatus] = useState<DashedUploadCardStatus>('idle');
  const [backStatus, setBackStatus] = useState<DashedUploadCardStatus>('idle');
  const [uploadSheetVisible, setUploadSheetVisible] = useState(false);
  const [uploadSide, setUploadSide] = useState<AadhaarCardSide>('front');
  const [resendModalVisible, setResendModalVisible] = useState(false);

  const avatarUri = useMemo(
    () => user?.avatarUri ?? DEFAULT_PROFILE_AVATAR,
    [user?.avatarUri],
  );

  const maskedMobile = '******XXXX';

  const formattedAadhaar = useMemo(
    () => formatAadhaarNumber(form.aadhaarNumber),
    [form.aadhaarNumber],
  );

  const goBack = useCallback(() => {
    if (step === 'otp') {
      setStep('details');
      setOtpValueState('');
      setOtpError(null);
      setSubmitState('idle');
      return;
    }
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(isAuthFlow ? ROUTES.completeProfile : ROUTES.profile);
  }, [isAuthFlow, router, step]);

  const openProfile = useCallback(() => {
    triggerLightHaptic();
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(isAuthFlow ? ROUTES.completeProfile : ROUTES.profile);
  }, [isAuthFlow, router]);

  const setFullName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, fullName: value }));
  }, []);

  const setAadhaarNumber = useCallback((value: string) => {
    setForm((prev) => ({
      ...prev,
      aadhaarNumber: sanitizeAadhaarDigits(value),
    }));
  }, []);

  const setDateOfBirth = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, dateOfBirth: formatDobInput(value) }));
  }, []);

  const toggleConsent = useCallback(() => {
    triggerLightHaptic();
    setForm((prev) => ({ ...prev, consentAccepted: !prev.consentAccepted }));
  }, []);

  const openUpload = useCallback((side: AadhaarCardSide) => {
    triggerLightHaptic();
    setUploadSide(side);
    setUploadSheetVisible(true);
  }, []);

  const closeUpload = useCallback(() => {
    setUploadSheetVisible(false);
  }, []);

  const applyUploadedDocument = useCallback(
    (document: UploadedDocument) => {
      const setStatus = uploadSide === 'front' ? setFrontStatus : setBackStatus;
      setStatus('uploading');
      setUploadSheetVisible(false);

      setTimeout(() => {
        setForm((prev) =>
          uploadSide === 'front'
            ? {
                ...prev,
                frontIdUri: document.uri,
                frontFileName: document.fileName ?? 'aadhaar_front.jpg',
              }
            : {
                ...prev,
                backIdUri: document.uri,
                backFileName: document.fileName ?? 'aadhaar_back.jpg',
              },
        );
        setStatus('uploaded');
        triggerSuccessHaptic();
      }, 350);
    },
    [uploadSide],
  );

  const setOtpValue = useCallback((value: string) => {
    setOtpValueState(value.replace(/\D/g, '').slice(0, VERIFY_AADHAAR_SCREEN.otpLength));
    setOtpError(null);
  }, []);

  const continueToOtp = useCallback(async () => {
    if (submitState !== 'idle') {
      return;
    }

    triggerLightHaptic();

    if (!isValidAadhaarNumber(form.aadhaarNumber)) {
      showAppAlert(
        VERIFY_AADHAAR_SCREEN.validationTitle,
        form.aadhaarNumber.length === 12
          ? VERIFY_AADHAAR_SCREEN.aadhaarInvalid
          : VERIFY_AADHAAR_SCREEN.aadhaarRequired,
      );
      return;
    }

    setSubmitState('submitting');
    await delay(600);
    setSubmitState('idle');
    setOtpValueState('');
    setOtpError(null);
    setStep('otp');
  }, [form.aadhaarNumber, submitState]);

  const resendOtp = useCallback(() => {
    triggerLightHaptic();
    setOtpValueState('');
    setOtpError(null);
    setResendModalVisible(true);
  }, []);

  const closeResendModal = useCallback(() => {
    setResendModalVisible(false);
  }, []);

  const backToDetails = useCallback(() => {
    triggerLightHaptic();
    setStep('details');
    setOtpValueState('');
    setOtpError(null);
    setSubmitState('idle');
    setResendModalVisible(false);
  }, []);

  const verifyOtp = useCallback(async () => {
    if (submitState !== 'idle') {
      return;
    }

    triggerLightHaptic();

    if (otpValue.length !== VERIFY_AADHAAR_SCREEN.otpLength) {
      setOtpError(VERIFY_AADHAAR_SCREEN.otpInvalidMessage);
      return;
    }

    setSubmitState('submitting');
    await delay(700);

    if (otpValue !== VERIFY_AADHAAR_SCREEN.demoOtp) {
      setSubmitState('idle');
      setOtpError(VERIFY_AADHAAR_SCREEN.otpInvalidMessage);
      return;
    }

    const fullName = form.fullName.trim() || user?.fullName?.trim() || 'Verified User';
    const masked = maskAadhaarNumber(form.aadhaarNumber);

    aadhaarVerificationStore.set({
      fullName,
      maskedAadhaar: masked,
      verifiedAt: new Date().toISOString(),
      frontIdUri: form.frontIdUri,
      backIdUri: form.backIdUri,
    });

    try {
      await userDetailsSheetSync.validateAndSync({
        userName: fullName,
        aadharNumber: masked,
        mobile: user?.phone ?? '',
      });
    } catch (error) {
      console.log('[VerifyAadhaar] sheet sync failed', error);
    }

    setSubmitState('success');
    triggerSuccessHaptic();
    router.replace(
      isAuthFlow ? ROUTES.authVerifyAadhaarSuccess : ROUTES.verifyAadhaarSuccess,
    );
  }, [
    form.aadhaarNumber,
    form.backIdUri,
    form.frontIdUri,
    form.fullName,
    isAuthFlow,
    otpValue,
    router,
    submitState,
    user?.fullName,
  ]);

  return {
    step,
    form,
    otpValue,
    otpError,
    submitState,
    frontStatus,
    backStatus,
    uploadSheetVisible,
    uploadSide,
    avatarUri,
    maskedMobile,
    formattedAadhaar,
    setFullName,
    setAadhaarNumber,
    setDateOfBirth,
    toggleConsent,
    openUpload,
    closeUpload,
    applyUploadedDocument,
    setOtpValue,
    continueToOtp,
    verifyOtp,
    resendOtp,
    resendModalVisible,
    closeResendModal,
    backToDetails,
    goBack,
    openProfile,
  };
};
