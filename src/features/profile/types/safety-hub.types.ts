export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phoneLabel: string;
  avatarUri?: string;
  initials?: string;
}

export interface SafetyReportOption {
  id: string;
  title: string;
  subtitle: string;
  icon: 'warning-outline';
}
