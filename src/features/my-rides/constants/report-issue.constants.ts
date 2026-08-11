import { ROUTES } from '@/config';

import type {
  ReportIssueCategoryOption,
  ReportIssueRideSummary,
} from '../types';

export const REPORT_ISSUE_SCREEN = {
  title: 'Report Issue',
  rideSummaryTitle: 'Ride Summary',
  originLabel: 'Origin',
  destinationLabel: 'Destination',
  dateLabel: 'Date',
  categoryTitle: 'What went wrong?',
  descriptionLabel: 'Describe the issue',
  descriptionPlaceholder: 'Please provide more details to help us investigate...',
  photoLabel: 'Add Photo/Screenshot',
  photoHint: 'Click or drag images to upload',
  uploadTitle: 'Add Photo',
  uploadSubtitle: 'Take a photo or choose one from your gallery.',
  uploadingLabel: 'Uploading photo...',
  uploadedLabel: 'Photo uploaded',
  submitLabel: 'Submit Report',
  submittingLabel: 'Submitting...',
  successTitle: 'Report Submitted',
  successMessage: 'Thanks for reporting. Our team will review this issue shortly.',
  validationCategory: 'Select what went wrong.',
  validationDescription: 'Please describe the issue.',
  infoTitle: 'Reporting tips',
  infoMessage:
    'Share clear details and photos if possible. This helps us investigate faster and keep BhaiWay safe.',
} as const;

export const REPORT_ISSUE_CATEGORIES: readonly ReportIssueCategoryOption[] = [
  { id: 'vehicle', label: 'Vehicle Issues', icon: 'car-sport-outline' },
  { id: 'driver', label: 'Driver Behavior', icon: 'person-outline' },
  { id: 'payment', label: 'Payment/Fare', icon: 'card-outline' },
  { id: 'safety', label: 'Safety Concern', icon: 'shield-checkmark-outline' },
  { id: 'technical', label: 'App/Technical Issue', icon: 'phone-portrait-outline' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
] as const;

export const getReportIssueRideSummary = (params?: {
  rideId?: string;
  pickupLabel?: string;
  dropoffLabel?: string;
  dateLabel?: string;
}): ReportIssueRideSummary => ({
  rideId: params?.rideId?.trim() || 'invoice-1',
  originLabel: params?.pickupLabel?.trim() || 'Tech Park Central',
  destinationLabel: params?.dropoffLabel?.trim() || 'Home',
  dateLabel: params?.dateLabel?.trim() || 'Oct 24, 2023',
  statusLabel: 'Completed',
});

export const getReportIssuePath = (params?: {
  rideId?: string;
  pickupLabel?: string;
  dropoffLabel?: string;
  dateLabel?: string;
}) => ({
  pathname: ROUTES.myRidesReportIssue,
  params: {
    ...(params?.rideId ? { rideId: params.rideId } : {}),
    ...(params?.pickupLabel ? { pickupLabel: params.pickupLabel } : {}),
    ...(params?.dropoffLabel ? { dropoffLabel: params.dropoffLabel } : {}),
    ...(params?.dateLabel ? { dateLabel: params.dateLabel } : {}),
  },
});
