export type EmergencyEndIssueId =
  | 'breakdown'
  | 'medical'
  | 'accident'
  | 'other';

export interface EmergencyEndIssueOption {
  id: EmergencyEndIssueId;
  label: string;
  icon: 'construct-outline' | 'medkit-outline' | 'warning-outline' | 'help-circle-outline';
  iconTone: 'primary' | 'error' | 'neutral' | 'secondary';
}

export interface EmergencyEvidencePhoto {
  id: string;
  uri: string;
}
