import type { MasterProfileData, ProfileMenuItem } from '../types';
import { WALLET_BALANCE_LABEL } from './wallet-shared.constants';

export const PROFILE_SCREEN = {
  title: 'Profile',
  walletTitle: 'BhaiWay Wallet',
  addRedeemLabel: 'Open Wallet',
  paymentMethodsTitle: 'Payment Methods',
  driverEarningsTitle: 'Driver Earnings',
  earningInsightPrefix: 'Earning Insight:',
  logOutLabel: 'Log Out',
  logOutTitle: 'Log Out',
  logOutMessage: 'Are you sure you want to log out of your BhaiWay account?',
  logOutConfirm: 'Log Out',
  logOutCancel: 'Cancel',
  comingSoonTitle: 'Coming Soon',
  comingSoonMessage: 'This feature will be available soon.',
  versionLabel: 'Version 2.4.1 (Build 890)',
  changePhotoTitle: 'Profile Photo',
  changePhotoSubtitle: 'Take a new photo or choose one from your gallery.',
} as const;

export const DEFAULT_PROFILE_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCDR6-T8s0DEbDQmGsnLqJqNJCt7gnb0ZKFbpdniwNboXHbWIEOJWsx1IpLMwcb8OR_lM34pp1x-V2s4CuhG0W8TfIPI1xkOzIAvU0kNstEh7J3zkIDgmtgs5PytynNjBB3x5Ejo7n1CjFa14AR4WTCtRhMU2tRF9shZSOAHDqDqwYhHTyu1R6nPflF_aQFNhgu719gl_d6dop3wXw1dwHRQJfccdLvyTQTdjoU_JxojLYghUaW5hg85tXZrAQzUcX9NKJYFeeHX6g';

export const DEFAULT_MASTER_PROFILE: MasterProfileData = {
  fullName: 'Arjun Sharma',
  phoneLabel: '+91 98765 43210',
  avatarUri: DEFAULT_PROFILE_AVATAR,
  walletBalanceLabel: WALLET_BALANCE_LABEL,
  paymentMethodsSubtitle: 'UPI, Cards linked',
  driverEarningsLabel: '₹ 2,450',
  earningBreakdown: [
    { label: 'Regular Rides', amountLabel: '₹1,850' },
    { label: 'Assured Rides', amountLabel: '₹600' },
  ],
  earningInsight:
    "You earned ₹600 from Assured Rides. If your Regular Rides had been 'Assured', you could have earned an additional ₹450!",
  badges: [
    { id: 'corporate', label: 'Corporate ID', icon: 'verified', tone: 'success' },
    { id: 'rating', label: '4.8', icon: 'star', tone: 'neutral' },
    { id: 'trust', label: '98% Trust', icon: 'shield-checkmark', tone: 'primary' },
  ],
  ratingLabel: '4.8',
  trustLabel: '98% Trust',
};

export const PROFILE_MENU_ITEMS: readonly ProfileMenuItem[] = [
  {
    id: 'verify',
    title: 'Verify Identity & Documents',
    subtitle: 'Corporate ID, Driving License, RC',
    icon: 'id-card-outline',
  },
  {
    id: 'garage',
    title: 'My Garage',
    subtitle: 'Manage your vehicles',
    icon: 'car-outline',
  },
  {
    id: 'refer',
    title: 'Refer & Earn',
    subtitle: 'Invite coworkers, earn fuel credits',
    icon: 'gift-outline',
  },
  {
    id: 'safety',
    title: 'Safety Hub',
    subtitle: 'Trusted contacts, SOS, emergency help',
    icon: 'shield-outline',
  },
  {
    id: 'support',
    title: 'Help & Support',
    subtitle: '24/7 assistance available',
    icon: 'headset-outline',
  },
  {
    id: 'legal',
    title: 'Legal Details',
    subtitle: 'Terms, Privacy, Policies',
    icon: 'document-text-outline',
  },
] as const;
