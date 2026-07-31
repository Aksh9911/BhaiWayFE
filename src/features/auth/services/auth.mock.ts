import type { ApiError } from '@/network';
import { delay, generateId } from '@/shared/utils';
import { AUTH_MOCK_DELAYS, INVALID_MOCK_OTP } from '../constants';
import type {
  AuthSession,
  CompleteProfilePayload,
  RequestOtpPayload,
  RequestOtpResult,
  UserProfile,
  VerifyOtpPayload,
} from '../types';

export const requestOtp = async (_payload: RequestOtpPayload): Promise<RequestOtpResult> => {
  await delay(AUTH_MOCK_DELAYS.requestOtpMs);
  return {
    verificationId: generateId('otp'),
    expiresInSeconds: 300,
  };
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<AuthSession> => {
  await delay(AUTH_MOCK_DELAYS.verifyOtpMs);

  if (payload.code === INVALID_MOCK_OTP) {
    const error: ApiError = {
      status: 400,
      code: 'INVALID_OTP',
      message: 'Invalid code. Please try again.',
    };
    throw error;
  }

  return {
    userId: generateId('user'),
    token: generateId('token'),
    isNewUser: true,
  };
};

export const completeProfile = async (
  payload: CompleteProfilePayload,
): Promise<UserProfile> => {
  await delay(AUTH_MOCK_DELAYS.completeProfileMs);
  return {
    id: generateId('user'),
    fullName: payload.fullName,
    email: payload.email,
    gender: payload.gender,
    avatarUri: payload.avatarUri ?? null,
  };
};
