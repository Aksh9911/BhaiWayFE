import { ROUTES } from '@/config';

export const ISSUE_REPORTED_SCREEN = {
  headerTitle: 'Status',
  title: 'Issue Reported Successfully',
  subtitle:
    'Thank you for your feedback. We have received your report and our support team is investigating the matter. We will get back to you within 24-48 hours.',
  referenceLabel: 'Reference Number',
  copyLabel: 'Copy reference number',
  copiedTitle: 'Copied',
  copiedMessage: 'Reference number copied to clipboard.',
  homeLabel: 'Go to Home',
  backToRideLabel: 'Back to Ride Details',
  defaultReference: '#BW-88291',
} as const;

export const createIssueReportReference = (): string => {
  const suffix = String(Math.floor(10000 + Math.random() * 90000));
  return `#BW-${suffix}`;
};

export const getIssueReportedPath = (params?: {
  rideId?: string;
  referenceNumber?: string;
  pickupLabel?: string;
  dropoffLabel?: string;
  dateLabel?: string;
}) => ({
  pathname: ROUTES.myRidesIssueReported,
  params: {
    ...(params?.rideId ? { rideId: params.rideId } : {}),
    ...(params?.referenceNumber ? { referenceNumber: params.referenceNumber } : {}),
    ...(params?.pickupLabel ? { pickupLabel: params.pickupLabel } : {}),
    ...(params?.dropoffLabel ? { dropoffLabel: params.dropoffLabel } : {}),
    ...(params?.dateLabel ? { dateLabel: params.dateLabel } : {}),
  },
});
