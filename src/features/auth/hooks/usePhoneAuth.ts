import { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';

import { useRouter } from 'expo-router';

import { APP_CONFIG, ROUTES } from '@/config';
import {
  applySheetProfileToSession,
  assertSheetUserForLogin,
  findSheetUserByMobile,
  hydrateSessionFromSheet,
} from '@/DemoData';
import { getErrorMessage, showAppAlert, triggerSuccessHaptic } from '@/shared/utils';
import { authSession } from '@/store';
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

const applySessionAndNavigate = async (
  router: ReturnType<typeof useRouter>,
  flow: AuthFlow,
  phoneNumber: string,
  verificationId: string,
  code = '',
): Promise<void> => {
  if (flow === 'login') {
    await assertSheetUserForLogin(phoneNumber);
  }

  const session = await authService.verifyOtp({ verificationId, code, phoneNumber });
  triggerSuccessHaptic();
  authSession.setSession(session.token, {
    id: session.userId,
    fullName: '',
    email: null,
    avatarUri: null,
    phone: phoneNumber,
  });

  const sheetRow = await hydrateSessionFromSheet();
  applySheetProfileToSession();

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

  // Signup: existing sheet user can go home; new numbers complete profile.
  if (sheetRow?.userName?.trim()) {
    router.replace(ROUTES.home);
    return;
  }
  router.push(ROUTES.completeProfile);
};

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
      if (flow === 'login') {
        await assertSheetUserForLogin(phoneNumber);
      } else {
        const existing = await findSheetUserByMobile(phoneNumber);
        if (existing?.userName?.trim()) {
          showAppAlert(
            'Account already exists',
            'This number is already registered. Please log in instead.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Log in',
                onPress: () => {
                  router.replace(ROUTES.account);
                },
              },
            ],
          );
          return;
        }
      }

      const result = await authService.requestOtp({
        phoneNumber,
        dialCode: APP_CONFIG.defaultDialCode,
      });

      // Invisible / already-verified path — skip OTP entry screen.
      if (result.verificationId.startsWith('verified:')) {
        await applySessionAndNavigate(router, flow, phoneNumber, result.verificationId);
        return;
      }

      router.push({
        pathname: ROUTES.otp,
        params: { phone: phoneNumber, flow, verificationId: result.verificationId },
      });
    } catch (error) {
      const message = getErrorMessage(error);
      if ((error as { code?: string })?.code === 'SHEET_USER_NOT_FOUND') {
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
      showAppAlert('Unable to continue', message);
    } finally {
      setLoading(false);
    }
  }, [flow, isValid, loading, phoneNumber, router]);

  return { phoneNumber, setPhoneNumber, isValid, loading, submit };
};
