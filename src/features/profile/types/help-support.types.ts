export type SupportCategoryId = 'booking' | 'payments' | 'safety' | 'account';

export type SupportTicketStatus = 'resolved' | 'in_progress';

export interface SupportCategory {
  id: SupportCategoryId;
  title: string;
  subtitle: string;
  icon: 'calendar-outline' | 'wallet-outline' | 'shield-checkmark-outline' | 'settings-outline';
}

export interface SupportTicket {
  id: string;
  title: string;
  submittedLabel: string;
  status: SupportTicketStatus;
  icon: 'receipt-outline' | 'person-outline';
}
