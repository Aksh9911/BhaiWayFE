export type ContactFormMode = 'add' | 'edit';

export type ContactRelation =
  | 'Sister'
  | 'Mother'
  | 'Father'
  | 'Brother'
  | 'Spouse'
  | 'Friend'
  | 'Other';

export interface EditContactForm {
  id: string | null;
  name: string;
  relation: ContactRelation;
  phoneLabel: string;
  avatarUri: string | null;
}

export type EditContactSubmitState = 'idle' | 'submitting' | 'success';
