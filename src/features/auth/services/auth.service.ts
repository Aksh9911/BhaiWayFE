import { env } from '@/config';
import * as authApi from '../api';
import type {
  AuthSession,
  CompleteProfilePayload,
  RequestOtpPayload,
  RequestOtpResult,
  UserProfile,
  VerifyOtpPayload,
} from '../types';
import * as authMock from './auth.mock';
import * as authMsg91 from './auth.msg91';

type OtpPayloadWithReq = RequestOtpPayload & { verificationId?: string };

const otpImpl = env.useMsg91Otp ? authMsg91 : env.useMocks ? authMock : authApi;
const profileImpl = env.useMocks || env.useMsg91Otp ? authMock : authApi;

export const authService = {
  requestOtp: (payload: RequestOtpPayload): Promise<RequestOtpResult> => otpImpl.requestOtp(payload),
  verifyOtp: (payload: VerifyOtpPayload): Promise<AuthSession> => otpImpl.verifyOtp(payload),
  resendOtp: (payload: OtpPayloadWithReq): Promise<RequestOtpResult> => {
    if (env.useMsg91Otp) {
      return authMsg91.resendOtp(payload);
    }
    return otpImpl.requestOtp(payload);
  },
  completeProfile: (payload: CompleteProfilePayload): Promise<UserProfile> =>
    profileImpl.completeProfile(payload),
};
