/**
 * ChatThreads + ChatMessages sheet row types.
 * Headers / IDs live in `src/DemoData/files/demoData.common.ts`.
 */

export type {
  ChatThreadsSheetHeader,
  ChatMessagesSheetHeader,
} from './files/demoData.common';

export {
  CHAT_THREADS_SHEET_HEADERS,
  CHAT_THREADS_SHEET_FIELD_KEYS,
  CHAT_THREADS_SHEET_ID_START,
  CHAT_MESSAGES_SHEET_HEADERS,
  CHAT_MESSAGES_SHEET_FIELD_KEYS,
  CHAT_MESSAGES_SHEET_ID_START,
  chatThreadsSheetHeaderCsv,
  chatMessagesSheetHeaderCsv,
} from './files/demoData.common';

export type ChatThreadSheetRole = 'rider' | 'driver';
export type ChatThreadSheetRideType = 'outstation' | 'office' | 'published' | 'support';
export type ChatMessageSheetSender = 'user' | 'driver' | 'support';
export type ChatMessageSheetStatus = 'sent' | 'read' | '';

export interface ChatThreadsSheetRow {
  row_id: number;
  threadId: number;
  threadKey: string;
  userId: number;
  mobile: string;
  role: ChatThreadSheetRole;
  rideType: ChatThreadSheetRideType;
  peerName: string;
  peerSubtitle: string;
  routeLabel: string;
  lastMessage: string;
  timeLabel: string;
  unreadCount: number;
  isOnline: boolean;
  avatarUri: string;
  updated_at: string;
}

export type ChatThreadsSheetPatch = Partial<
  Omit<ChatThreadsSheetRow, 'row_id' | 'updated_at'>
> & {
  mobile?: string;
  threadKey?: string;
};

export interface ChatMessagesSheetRow {
  row_id: number;
  messageId: number;
  threadKey: string;
  userId: number;
  mobile: string;
  sender: ChatMessageSheetSender;
  text: string;
  timeLabel: string;
  status: ChatMessageSheetStatus;
  createdAt: string;
  updated_at: string;
}

export type ChatMessagesSheetPatch = Partial<
  Omit<ChatMessagesSheetRow, 'row_id' | 'updated_at'>
> & {
  mobile?: string;
  threadKey?: string;
};

/** Fixed thread key for Help & Support chat. */
export const SUPPORT_CHAT_THREAD_KEY = 'support';
