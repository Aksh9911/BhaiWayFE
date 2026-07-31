import { useCallback, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { APP_CONFIG, ROUTES } from '@/config';
import { useCountdown } from '@/shared/hooks';
import {
  getErrorMessage,
  getSearchParam,
  maskPhoneNumber,
  triggerErrorHaptic,
  triggerLightHaptic,
  triggerSuccessHaptic,
} from '@/shared/utils';
import { authSession } from '@/store';
import { AUTH_CONSTANTS } from '../constants';
import { authService } from '../services';
import type { AuthFlow } from '../types';

export interface UseOtpVerificationResult {
  phoneNumber: string;
  maskedPhone: string;
  code: string;
  setCode: (value: string) => void;
  error?: string;
  loading: boolean;
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
  const [error, setError] = useState<string | undefined>();
  const { secondsLeft, canResend, restart } = useCountdown(AUTH_CONSTANTS.otpResendSeconds);

  const isValid = code.length === AUTH_CONSTANTS.otpLength;

  const setCode = useCallback(
    (value: string) => {
      setCodeValue(value);
      if (error) {
        setError(undefined);
      }
    },
    [error],
  );

  const verify = useCallback(async () => {
    if (!isValid || loading) {
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setError(undefined);

    try {
      const session = await authService.verifyOtp({ verificationId, code, phoneNumber });
      triggerSuccessHaptic();

      authSession.setSession(session.token, {
        id: session.userId,
        fullName: '',
        email: null,
        avatarUri: null,
      });

      const isReturningUser = flow === 'login' || !session.isNewUser;

      if (isReturningUser) {
        router.replace(ROUTES.home);
        return;
      }

      router.push(ROUTES.completeProfile);
    } catch (verifyError) {
      setError(getErrorMessage(verifyError));
      triggerErrorHaptic();
    } finally {
      setLoading(false);
    }
  }, [code, flow, isValid, loading, phoneNumber, router, verificationId]);

  const resend = useCallback(async () => {
    if (!canResend) {
      return;
    }

    triggerLightHaptic();

    try {
      const result = await authService.requestOtp({
        phoneNumber,
        dialCode: APP_CONFIG.defaultDialCode,
      });
      setVerificationId(result.verificationId);
      restart(AUTH_CONSTANTS.otpResendSeconds);
      setCodeValue('');
      setError(undefined);
      Alert.alert('Code sent', `A new verification code was sent to ${maskPhoneNumber(phoneNumber, APP_CONFIG.defaultDialCode)}.`);
    } catch (resendError) {
      Alert.alert('Unable to resend', getErrorMessage(resendError));
    }
  }, [canResend, phoneNumber, restart]);

  return {
    phoneNumber,
    maskedPhone: maskPhoneNumber(phoneNumber, APP_CONFIG.defaultDialCode),
    code,
    setCode,
    error,
    loading,
    isValid,
    secondsLeft,
    canResend,
    verify,
    resend,
  };
};
