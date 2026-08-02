import { ROUTES } from '@/config';

export const EMERGENCY_REQUEST_RAISED_SCREEN = {
  title: 'Request Raised',
  heading: 'Under Review',
  bodyPrefix:
    'Your request to end the trip mid-journey is under review. Our safety team is analyzing your report. You will be notified in ',
  bodyHighlight: '5-10 minutes.',
  referenceLabel: 'Reference Number',
  referenceNumber: '#REF-8842-XJ',
  copyLabel: 'Copy reference number',
  copiedTitle: 'Copied',
  copiedMessage: 'Reference number copied to clipboard.',
  statusMessages: [
    'Awaiting operator response...',
    'Analyzing ride metadata...',
    'Connecting to safety lead...',
    'Verifying location data...',
  ] as const,
  backLabel: 'Back to My Rides',
  supportLabel: 'Contact support',
} as const;

export const getEmergencyRequestRaisedPath = () => ROUTES.myRidesRequestRaised;
