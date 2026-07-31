import type { LegalPolicyItem } from '../types';

export const LEGAL_SCREEN = {
  title: 'Legal & Policies',
  heroTitle: 'Transparency & Safety',
  heroSubtitle:
    'BhaiWay is built on trust. Review our policies to understand how we protect your rights and maintain a professional community.',
  versionLabel: 'BhaiWay Version 2.4.0 (2024)',
  copyrightLabel: '© 2024 BhaiWay Technologies Inc. All rights reserved.',
  comingSoonTitle: 'Coming Soon',
  comingSoonMessage: 'This policy document will be available soon.',
} as const;

export const LEGAL_POLICY_ITEMS: readonly LegalPolicyItem[] = [
  {
    id: 'terms',
    title: 'Terms of Service',
    subtitle: 'Revised June 2024',
    icon: 'document-text-outline',
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'How we handle data',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'safety',
    title: 'Safety Guidelines',
    subtitle: 'In-ride safety protocols',
    icon: 'medkit-outline',
  },
  {
    id: 'community',
    title: 'Community Standards',
    subtitle: 'Expected behavior',
    icon: 'people-outline',
  },
  {
    id: 'licenses',
    title: 'Software Licenses',
    subtitle: 'Open source acknowledgments',
    icon: 'code-slash-outline',
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    subtitle: 'Analytics & Preferences',
    icon: 'analytics-outline',
  },
  {
    id: 'deletion',
    title: 'Account Deletion',
    subtitle: 'Manage your data & account',
    icon: 'trash-outline',
  },
] as const;
