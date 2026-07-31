import { useCallback, useState } from 'react';
import { Alert, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';

import { APP_CONFIG, ROUTES } from '@/config';
import { getErrorMessage } from '@/shared/utils';
import { AUTH_CONSTANTS } from '../constants';
import { authService } from '../services';
import type { AuthFlow } from '../types';

export interface UsePhoneAuthResult {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  isValid: boolean;
  loading: boolean;
  submit: () => Promise<void>;
}

export const usePhoneAuth = (flow: AuthFlow): UsePhoneAuthResult => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = phoneNumber.length === AUTH_CONSTANTS.phoneLength;

  const submit = useCallback(async () => {
    if (!isValid || loading) {
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const result = await authService.requestOtp({
        phoneNumber,
        dialCode: APP_CONFIG.defaultDialCode,
      });

      router.push({
        pathname: ROUTES.otp,
        params: { phone: phoneNumber, flow, verificationId: result.verificationId },
      });
    } catch (error) {
      Alert.alert('Unable to send code', getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [flow, isValid, loading, phoneNumber, router]);

  return { phoneNumber, setPhoneNumber, isValid, loading, submit };
};
