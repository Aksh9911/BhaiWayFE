import type { SupportCategory, SupportTicket } from '../types';

export const HELP_SUPPORT_SCREEN = {
  title: 'Help & Support',
  searchPlaceholder: 'How can we help you today?',
  categoriesHeading: 'Support Categories',
  recentHeading: 'Recent Issues',
  viewAllLabel: 'View All',
  chatLabel: 'Chat with Support',
  emailLabel: 'Email Us',
  comingSoonTitle: 'Coming Soon',
  comingSoonMessage: 'This support option will be available soon.',
  emailErrorTitle: 'Unable to open email',
  emailErrorMessage: 'Please email us at support@bhaiway.app',
} as const;

export const SUPPORT_CATEGORIES: readonly SupportCategory[] = [
  {
    id: 'booking',
    title: 'Booking & Rides',
    subtitle: 'Manage your trips and ride requests',
    icon: 'calendar-outline',
  },
  {
    id: 'payments',
    title: 'Payments & Wallet',
    subtitle: 'Refunds, credits, and payment methods',
    icon: 'wallet-outline',
  },
  {
    id: 'safety',
    title: 'Safety & Trust',
    subtitle: 'Emergency help and safety guidelines',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'account',
    title: 'Account Settings',
    subtitle: 'Privacy, profile, and security settings',
    icon: 'settings-outline',
  },
] as const;

export const SUPPORT_TICKETS: readonly SupportTicket[] = [
  {
    id: 'bw-88291',
    title: 'Ride #BW-88291 - Payment Issue',
    submittedLabel: 'Submitted on Oct 12, 2023',
    status: 'resolved',
    icon: 'receipt-outline',
  },
  {
    id: 'behavior-1',
    title: 'Rider Behavior Report',
    submittedLabel: 'Submitted on Oct 14, 2023',
    status: 'in_progress',
    icon: 'person-outline',
  },
] as const;

export const SUPPORT_TICKET_STATUS_LABEL = {
  resolved: 'Resolved',
  in_progress: 'In Progress',
} as const;
