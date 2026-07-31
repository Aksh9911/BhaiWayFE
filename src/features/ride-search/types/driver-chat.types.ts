export type ChatMessageSender = 'driver' | 'user';

export interface ChatMessage {
  id: string;
  sender: ChatMessageSender;
  text: string;
  timeLabel: string;
  status?: 'sent' | 'read';
}

export interface DriverChatProfile {
  name: string;
  vehicleLabel: string;
  isOnline: boolean;
  avatarUri?: string;
}
