export type LegalPolicyId =
  | 'terms'
  | 'privacy'
  | 'safety'
  | 'community'
  | 'licenses'
  | 'cookies'
  | 'deletion';

export interface LegalPolicyItem {
  id: LegalPolicyId;
  title: string;
  subtitle: string;
  icon:
    | 'document-text-outline'
    | 'shield-checkmark-outline'
    | 'medkit-outline'
    | 'people-outline'
    | 'code-slash-outline'
    | 'analytics-outline'
    | 'trash-outline';
}
