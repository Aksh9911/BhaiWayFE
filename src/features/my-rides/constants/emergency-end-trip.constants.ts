import { ROUTES } from '@/config';

import type { EmergencyEndIssueOption } from '../types';

export const EMERGENCY_END_TRIP_SCREEN = {
  title: 'Emergency End Trip',
  issueHeading: 'What happened?',
  evidenceHeading: 'Upload Evidence',
  optionalLabel: 'Optional',
  captureLabel: 'Capture',
  commentsHeading: 'Tell us more',
  commentsLabel: 'Additional Comments',
  commentsPlaceholder: 'Provide more details about the situation...',
  submitLabel: 'Raise Completion Request',
  submitHint: 'Our support team will review this and get in touch shortly.',
  submittedTitle: 'Request raised',
  submittedMessage:
    'Your emergency completion request has been sent. Our support team will contact you shortly.',
  supportLabel: 'Contact support',
  selectIssueMessage: 'Please select what happened before submitting.',
} as const;

export const EMERGENCY_END_ISSUES: readonly EmergencyEndIssueOption[] = [
  {
    id: 'breakdown',
    label: 'Car Breakdown/Puncture',
    icon: 'construct-outline',
    iconTone: 'primary',
  },
  {
    id: 'medical',
    label: 'Medical Emergency',
    icon: 'medkit-outline',
    iconTone: 'error',
  },
  {
    id: 'accident',
    label: 'Accident/Mishap',
    icon: 'warning-outline',
    iconTone: 'neutral',
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'help-circle-outline',
    iconTone: 'secondary',
  },
] as const;

export const getEmergencyEndTripPath = () => ROUTES.myRidesEmergencyEnd;
