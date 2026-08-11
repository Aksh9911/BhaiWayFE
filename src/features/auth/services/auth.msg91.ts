/**
 * Auth OTP adapter backed by MSG91 SendOTP (custom UI / OTPWidget).
 * Profile completion still uses mock/local until a real backend exists.
 */

import { demoUsersStore } from '@/DemoData';
import { generateId } from '@/shared/utils';
import {
  buildMsg91Identifier,
  otpService,
} from '@/shared/services/otp';
import type {
  AuthSession,
  CompleteProfilePayload,
  RequestOtpPayload,
  RequestOtpResult,
  UserProfile,
  VerifyOtpPayload,
} from '../types';
import * as authMock from './auth.mock';

const OTP_EXPIRES_SECONDS = 300;

const findExistingUserId = async (phoneNumber: string): Promise<string | null> => {
  await demoUsersStore.hydrate();
  const digits = phoneNumber.replace(/\D/g, '').slice(-10);
  const match = demoUsersStore.getAll().find((user) =>
    user.mobile.replace(/\D/g, '').endsWith(digits),
  );
  return match ? String(match.user_id) : null;
};

export const requestOtp = async (payload: RequestOtpPayload): Promise<RequestOtpResult> => {
  const identifier = buildMsg91Identifier(payload.phoneNumber, payload.dialCode);
  const result = await otpService.sendOtp(identifier);

  // Invisible / already-verified: still return a verificationId so the OTP screen can proceed.
  // verifyOtp will short-circuit when code is empty and alreadyVerified token is used via verificationId.
  if (result.alreadyVerified && result.accessToken) {
    return {
      verificationId: `verified:${result.accessToken}`,
      expiresInSeconds: OTP_EXPIRES_SECONDS,
    };
  }

  return {
    verificationId: result.reqId,
    expiresInSeconds: OTP_EXPIRES_SECONDS,
  };
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<AuthSession> => {
  let accessToken: string;

  if (payload.verificationId.startsWith('verified:')) {
    accessToken = payload.verificationId.slice('verified:'.length);
  } else {
    const verified = await otpService.verifyOtp(payload.verificationId, payload.code);
    accessToken = verified.accessToken;
  }

  const existingUserId = await findExistingUserId(payload.phoneNumber);
  const isNewUser = existingUserId == null;

  return {
    userId: existingUserId ?? generateId('user'),
    token: accessToken,
    isNewUser,
  };
};

/** No BhaiWay auth API yet — keep local profile completion. */
export const completeProfile = (payload: CompleteProfilePayload): Promise<UserProfile> =>
  authMock.completeProfile(payload);

export const resendOtp = async (payload: RequestOtpPayload & { verificationId?: string }): Promise<RequestOtpResult> => {
  if (payload.verificationId && !payload.verificationId.startsWith('verified:')) {
    try {
      await otpService.retryOtp(payload.verificationId, 'SMS');
      return {
        verificationId: payload.verificationId,
        expiresInSeconds: OTP_EXPIRES_SECONDS,
      };
    } catch {
      // Fall through to a fresh send if retry channel is unavailable on the widget.
    }
  }
  return requestOtp(payload);
};
