import type { ReferralHistoryItem, ReferralPerk } from '../types';

export const REFER_EARN_SCREEN = {
  title: 'Refer & Earn',
  heroTitle: 'Invite Friends,',
  heroHighlight: 'Earn Rewards',
  heroSubtitle:
    'Refer your coworkers to BhaiWay and get 50 fuel credits for every successful signup.',
  exclusiveLabel: 'Your Exclusive Link',
  shareCodeTitle: 'Share your code',
  copyLabel: 'COPY',
  copiedLabel: 'COPIED',
  shareLabel: 'SHARE NOW',
  statusTitle: 'Referral Status',
  totalEarnedLabel: 'Total Earned: 150',
  viewAllLabel: 'VIEW ALL HISTORY',
  helpTitle: 'Refer & Earn Help',
  helpMessage:
    'Share your referral code with coworkers. You earn 50 fuel credits when they successfully sign up on BhaiWay.',
  shareMessage: (code: string) =>
    `Join me on BhaiWay! Use my referral code ${code} and we both get 50 fuel credits.`,
  viewAllTitle: 'Coming Soon',
  viewAllMessage: 'Full referral history will be available soon.',
} as const;

export const REFERRAL_CODE = 'ARJUN2023';

export const REFERRAL_PERKS: readonly ReferralPerk[] = [
  { id: 'fuel', label: '50 Fuel Credits', icon: 'flame-outline', tone: 'primary' },
  { id: 'unlimited', label: 'Unlimited Referrals', icon: 'people-outline', tone: 'neutral' },
] as const;

export const REFERRAL_HISTORY: readonly ReferralHistoryItem[] = [
  {
    id: 'r1',
    name: 'Rohan M.',
    detail: 'Joined via link • 12 Oct 2023',
    amountLabel: '50 Earned',
    status: 'successful',
  },
  {
    id: 'r2',
    name: 'Priya S.',
    detail: 'Invited via Slack • 14 Oct 2023',
    amountLabel: 'Pending',
    status: 'waiting',
  },
  {
    id: 'r3',
    name: 'Amit K.',
    detail: 'Joined via link • 08 Oct 2023',
    amountLabel: '50 Earned',
    status: 'successful',
  },
] as const;

export const REFERRAL_STATUS_LABEL = {
  successful: 'SUCCESSFUL',
  waiting: 'WAITING',
} as const;
