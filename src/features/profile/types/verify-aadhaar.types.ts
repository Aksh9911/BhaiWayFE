export type AadhaarVerifyStep = 'details' | 'otp';

export type AadhaarVerifySubmitState = 'idle' | 'submitting' | 'success';

export type AadhaarCardSide = 'front' | 'back';

export interface AadhaarVerifyForm {
  fullName: string;
  aadhaarNumber: string;
  dateOfBirth: string;
  consentAccepted: boolean;
  frontIdUri: string | null;
  frontFileName: string | null;
  backIdUri: string | null;
  backFileName: string | null;
}

export interface AadhaarVerificationRecord {
  fullName: string;
  maskedAadhaar: string;
  verifiedAt: string;
  frontIdUri?: string | null;
  backIdUri?: string | null;
}
