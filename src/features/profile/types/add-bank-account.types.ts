export interface AddBankAccountForm {
  holderName: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
}

export type AddBankAccountSubmitState = 'idle' | 'submitting' | 'success';
