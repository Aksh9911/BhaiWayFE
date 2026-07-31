import type { DeleteAccountReason } from '../types';

export const DELETE_ACCOUNT_SCREEN = {
  title: 'Delete Account',
  warningTitle: 'Permanent Action',
  warningBody:
    'Deactivating your account is permanent. All your ride history, saved addresses, and earned rewards will be immediately removed and cannot be recovered.',
  reasonsHeading: 'Why are you leaving?',
  feedbackLabel: 'Tell us more',
  feedbackPlaceholder: "We're sorry to see you go. How can we improve BhaiWay?",
  keepAccountLabel: 'Keep My Account',
  deleteAccountLabel: 'Delete Account',
  confirmTitle: 'Delete Account?',
  confirmMessage: 'Are you absolutely sure? This action cannot be undone.',
  confirmAction: 'Delete Account',
  confirmCancel: 'Cancel',
} as const;

export const DELETE_ACCOUNT_REASONS: readonly DeleteAccountReason[] = [
  { id: 'competitor', label: 'Moving to another app' },
  { id: 'privacy', label: 'Privacy concerns' },
  { id: 'not_needed', label: 'No longer need the service' },
  { id: 'complex', label: 'App is too complex' },
] as const;
