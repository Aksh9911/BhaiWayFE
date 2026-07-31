export type ReferralStatus = 'successful' | 'waiting';

export interface ReferralPerk {
  id: string;
  label: string;
  icon: 'flame-outline' | 'people-outline';
  tone: 'primary' | 'neutral';
}

export interface ReferralHistoryItem {
  id: string;
  name: string;
  detail: string;
  amountLabel: string;
  status: ReferralStatus;
}
