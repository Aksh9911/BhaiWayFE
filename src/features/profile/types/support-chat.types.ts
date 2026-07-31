export type SupportChatSender = 'support' | 'user';

export type SupportChatMessageStatus = 'sent' | 'read';

export interface SupportChatMessage {
  id: string;
  sender: SupportChatSender;
  text: string;
  timeLabel: string;
  status?: SupportChatMessageStatus;
}
