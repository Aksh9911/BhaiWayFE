export type IdUploadSide = 'front' | 'back';

export type IdUploadStatus = 'idle' | 'uploading' | 'uploaded';

export interface CorporateVerificationForm {
  companyName: string;
  workEmail: string;
  frontIdUri: string | null;
  backIdUri: string | null;
  frontFileName: string | null;
}

export interface CorporateVerificationErrors {
  companyName?: string;
  workEmail?: string;
  frontId?: string;
}
