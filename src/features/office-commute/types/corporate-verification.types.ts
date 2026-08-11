export type IdUploadSide = 'front' | 'back';

export type IdUploadStatus = 'idle' | 'uploading' | 'uploaded';

export type CorporateVerificationStep = 'details' | 'otp';

export interface CorporateVerificationForm {
  companyName: string;
  workEmail: string;
  frontIdUri: string | null;
  backIdUri: string | null;
  frontFileName: string | null;
  frontSecureUrl: string | null;
  frontPublicId: string | null;
  backSecureUrl: string | null;
  backPublicId: string | null;
}

export interface CorporateVerificationErrors {
  companyName?: string;
  workEmail?: string;
  frontId?: string;
}
