import { useCallback, useRef, useState } from 'react';
import { Keyboard } from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

import { APP_CONFIG, ROUTES } from '@/config';
import {
  applySheetProfileToSession,
  assertSheetUserForLogin,
  hydrateSessionFromSheet,
} from '@/DemoData';
import { useCountdown } from '@/shared/hooks';
import {
  getErrorMessage,
  getSearchParam,
  maskPhoneNumber,
  triggerErrorHaptic,
  triggerLightHaptic,
} from '@/shared/utils';
import { authSession, showAppAlert } from '@/store';
import { MORPHING_OTP_TIMING, type MorphingOtpStatus } from '../components/MorphingOTPInput';
import { AUTH_CONSTANTS } from '../constants';
import { authService } from '../services';
import type { AuthFlow } from '../types';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface UseOtpVerificationResult {
  phoneNumber: string;
  maskedPhone: string;
  code: string;
  setCode: (value: string) => void;
  error?: string;
  loading: boolean;
  status: MorphingOtpStatus;
  isValid: boolean;
  secondsLeft: number;
  canResend: boolean;
  verify: () => Promise<void>;
  resend: () => Promise<void>;
}

export const useOtpVerification = (): UseOtpVerificationResult => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const phoneNumber = getSearchParam(params.phone);
  const flow: AuthFlow = getSearchParam(params.flow) === 'login' ? 'login' : 'signup';
  const [verificationId, setVerificationId] = useState(() => getSearchParam(params.verificationId));

  const [code, setCodeValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<MorphingOtpStatus>('idle');
  const [error, setError] = useState<string | undefined>();
  const verifyingRef = useRef(false);
  const { secondsLeft, canResend, restart } = useCountdown(AUTH_CONSTANTS.otpResendSeconds);

  const isValid = code.length === AUTH_CONSTANTS.otpLength;

  const setCode = useCallback(
    (value: string) => {
      setCodeValue(value);
      if (error) {
        setError(undefined);
      }
      if (status === 'error') {
        setStatus('idle');
      }
    },
    [error, status],
  );

  const verify = useCallback(async () => {
    if (!isValid || verifyingRef.current) {
      return;
    }

    verifyingRef.current = true;
    Keyboard.dismiss();
    setLoading(true);
    setStatus('verifying');
    setError(undefined);

    const verifyStartedAt = Date.now();

    try {
      if (flow === 'login') {
        await assertSheetUserForLogin(phoneNumber);
      }

      const session = await authService.verifyOtp({ verificationId, code, phoneNumber });

      const elapsed = Date.now() - verifyStartedAt;
      const remainingSpin = Math.max(0, MORPHING_OTP_TIMING.spinnerMinMs - elapsed);
      if (remainingSpin > 0) {
        await wait(remainingSpin);
      }

      setStatus('success');

      authSession.setSession(session.token, {
        id: session.userId,
        fullName: '',
        email: null,
        avatarUri: null,
        phone: phoneNumber,
      });

      const sheetRow = await hydrateSessionFromSheet();
      applySheetProfileToSession();

      await wait(MORPHING_OTP_TIMING.successHoldMs - MORPHING_OTP_TIMING.spinnerMinMs);

      if (flow === 'login') {
        if (!sheetRow?.userName?.trim() && !(sheetRow && sheetRow.userId > 0)) {
          authSession.clear();
          throw Object.assign(
            new Error('No account found for this number. Please sign up first.'),
            { code: 'SHEET_USER_NOT_FOUND' },
          );
        }
        router.replace(ROUTES.home);
        return;
      }

      if (sheetRow?.userName?.trim()) {
        router.replace(ROUTES.home);
        return;
      }

      router.push(ROUTES.completeProfile);
    } catch (verifyError) {
      const message = getErrorMessage(verifyError);
      if ((verifyError as { code?: string })?.code === 'SHEET_USER_NOT_FOUND') {
        authSession.clear();
        setStatus('error');
        setLoading(false);
        verifyingRef.current = false;
        showAppAlert('Account not found', message, [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign up',
            onPress: () => {
              router.replace(ROUTES.phone);
            },
          },
        ]);
        return;
      }
      setStatus('error');
      setError(message);
      triggerErrorHaptic();
    } finally {
      setLoading(false);
      verifyingRef.current = false;
    }
  }, [code, flow, isValid, phoneNumber, router, verificationId]);

  const resend = useCallback(async () => {
    if (!canResend || verifyingRef.current) {
      return;
    }

    triggerLightHaptic();

    try {
      const result = await authService.resendOtp({
        phoneNumber,
        dialCode: APP_CONFIG.defaultDialCode,
        verificationId,
      });
      setVerificationId(result.verificationId);
      restart(AUTH_CONSTANTS.otpResendSeconds);
      setCodeValue('');
      setError(undefined);
      setStatus('idle');
      showAppAlert(
        'Code sent',
        `A new verification code was sent to ${maskPhoneNumber(phoneNumber, APP_CONFIG.defaultDialCode)}.`,
      );
    } catch (resendError) {
      showAppAlert('Unable to resend', getErrorMessage(resendError));
    }
  }, [canResend, phoneNumber, restart, verificationId]);

  return {
    phoneNumber,
    maskedPhone: maskPhoneNumber(phoneNumber, APP_CONFIG.defaultDialCode),
    code,
    setCode,
    error,
    loading,
    status,
    isValid,
    secondsLeft,
    canResend,
    verify,
    resend,
  };
};
