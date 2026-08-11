export type ReportIssueCategoryId =
  | 'vehicle'
  | 'driver'
  | 'payment'
  | 'safety'
  | 'technical'
  | 'other';

export interface ReportIssueCategoryOption {
  id: ReportIssueCategoryId;
  label: string;
  icon: 'car-sport-outline' | 'person-outline' | 'card-outline' | 'shield-checkmark-outline' | 'phone-portrait-outline' | 'ellipsis-horizontal';
}

export interface ReportIssueRideSummary {
  rideId: string;
  originLabel: string;
  destinationLabel: string;
  dateLabel: string;
  statusLabel: string;
}

export interface ReportIssueFormState {
  categoryId: ReportIssueCategoryId | null;
  description: string;
  photoUri: string | null;
  photoFileName: string | null;
  photoSecureUrl: string | null;
  photoPublicId: string | null;
}
