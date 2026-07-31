export type ProfileSuccessKind = 'bank-account-added' | 'withdrawal-initiated';

export interface ProfileSuccessParams {
  kind?: ProfileSuccessKind;
  amountLabel?: string;
  bankName?: string;
  maskedNumber?: string;
  referenceNumber?: string;
}
