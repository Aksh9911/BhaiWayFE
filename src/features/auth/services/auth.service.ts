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

const impl = env.useMocks ? authMock : authApi;

export const authService = {
  requestOtp: (payload: RequestOtpPayload): Promise<RequestOtpResult> => impl.requestOtp(payload),
  verifyOtp: (payload: VerifyOtpPayload): Promise<AuthSession> => impl.verifyOtp(payload),
  completeProfile: (payload: CompleteProfilePayload): Promise<UserProfile> =>
    impl.completeProfile(payload),
};
