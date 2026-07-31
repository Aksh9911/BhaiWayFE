export type DeleteAccountReasonId =
  | 'competitor'
  | 'privacy'
  | 'not_needed'
  | 'complex';

export interface DeleteAccountReason {
  id: DeleteAccountReasonId;
  label: string;
}
