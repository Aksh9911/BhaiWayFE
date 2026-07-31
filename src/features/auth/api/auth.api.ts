import { ENDPOINTS, httpClient } from '@/network';
import type {
  AuthSession,
  CompleteProfilePayload,
  RequestOtpPayload,
  RequestOtpResult,
  UserProfile,
  VerifyOtpPayload,
} from '../types';

export const requestOtp = (payload: RequestOtpPayload): Promise<RequestOtpResult> =>
  httpClient.post<RequestOtpResult>(ENDPOINTS.auth.requestOtp, payload);

export const verifyOtp = (payload: VerifyOtpPayload): Promise<AuthSession> =>
  httpClient.post<AuthSession>(ENDPOINTS.auth.verifyOtp, payload);

export const completeProfile = (payload: CompleteProfilePayload): Promise<UserProfile> =>
  httpClient.post<UserProfile>(ENDPOINTS.auth.completeProfile, payload);
