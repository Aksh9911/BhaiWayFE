export type Gender = 'male' | 'female' | 'other';

export type AuthFlow = 'signup' | 'login';

export interface RequestOtpPayload {
  phoneNumber: string;
  dialCode: string;
}

export interface RequestOtpResult {
  verificationId: string;
  expiresInSeconds: number;
}

export interface VerifyOtpPayload {
  verificationId: string;
  code: string;
  phoneNumber: string;
}

export interface AuthSession {
  userId: string;
  token: string;
  isNewUser: boolean;
}

export interface CompleteProfilePayload {
  fullName: string;
  email: string;
  gender: Gender;
  avatarUri?: string | null;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  gender: Gender;
  avatarUri: string | null;
}
