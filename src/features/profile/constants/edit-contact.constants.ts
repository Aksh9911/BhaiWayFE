import type { ContactRelation } from '../types';

export const EDIT_CONTACT_SCREEN = {
  editTitle: 'Edit Contact',
  addTitle: 'Add Contact',
  subtitle: 'Update details for your trusted contact',
  addSubtitle: 'Add someone you trust for emergency notifications',
  nameLabel: 'NAME',
  namePlaceholder: 'Enter name',
  relationLabel: 'RELATIONSHIP',
  phoneLabel: 'PHONE NUMBER',
  phonePlaceholder: 'Enter phone number',
  saveLabel: 'Save Changes',
  addSaveLabel: 'Add Contact',
  deleteLabel: 'Delete Contact',
  submittingLabel: 'Saving…',
  successLabel: 'Saved',
  validationTitle: 'Missing Details',
  validationMessage: 'Please enter a name and phone number.',
  deleteTitle: 'Remove Contact',
  deleteMessage: (name: string) => `Remove ${name} from your trusted contacts?`,
  deleteConfirm: 'Remove',
  deleteCancel: 'Cancel',
  changePhotoTitle: 'Contact Photo',
  changePhotoSubtitle: 'Take a new photo or choose one from your gallery.',
  defaultAvatarUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD4R4sLows49G_neNLqgSbBFCT4QRh2NfbwwLTaoIsNHS_BqnpvS6d-GUzbgZKHyTqSruK4BkQuVGZ5W7mPbxpgfml4MP21HLyd2IahnVYQQq6FozrPRyPWlm3QockqSGWTQUDjwrK1fw8jpFYgkpwt-vBm1WNpY4afDHdtsh5Y31Miqrkd8zhN6sDwi1gmEuszeIxeFtUfMEjdi3gVsR0fwRaVhiyys6G5xz8lIGkuAzH7UgAH6Z3n5p7BfsfzS-FJTUXOKMBnQDU',
} as const;

export const CONTACT_RELATIONS: readonly ContactRelation[] = [
  'Sister',
  'Mother',
  'Father',
  'Brother',
  'Spouse',
  'Friend',
  'Other',
];
