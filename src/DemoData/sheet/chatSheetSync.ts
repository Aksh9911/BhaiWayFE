import { env } from '@/config';
import {
  CHAT_MESSAGES_SHEET_FIELD_KEYS,
  CHAT_MESSAGES_SHEET_HEADERS,
  CHAT_MESSAGES_SHEET_ID_START,
  CHAT_THREADS_SHEET_FIELD_KEYS,
  CHAT_THREADS_SHEET_HEADERS,
  CHAT_THREADS_SHEET_ID_START,
  DEMO_CHAT_MESSAGES_SHEET_GID,
  DEMO_CHAT_THREADS_SHEET_GID,
  DEMO_GOOGLE_SHEET_ID,
  DEMO_SHEET_LINKS,
} from '@/DemoData/files';
import { authSession } from '@/store';

import {
  SUPPORT_CHAT_THREAD_KEY,
  type ChatMessagesSheetRow,
  type ChatThreadsSheetRow,
} from '../chatSheet.types';
import { chatMessagesSheetStore } from '../chatMessagesSheetStore';
import { chatThreadsSheetStore } from '../chatThreadsSheetStore';
import { userDetailsSheetStore } from '../userDetailsSheetStore';
import { normalizeHeader, parseCsv } from './csv';

export interface RemoteChatThreadRow {
  threadId: number;
  threadKey: string;
  userId: number;
  mobile: string;
  role: string;
  rideType: string;
  peerName: string;
  peerSubtitle: string;
  routeLabel: string;
  lastMessage: string;
  timeLabel: string;
  unreadCount: number;
  isOnline: boolean;
  avatarUri: string;
}

export interface RemoteChatMessageRow {
  messageId: number;
  threadKey: string;
  userId: number;
  mobile: string;
  sender: string;
  text: string;
  timeLabel: string;
  status: string;
  createdAt: string;
}

export interface ChatSyncResult {
  localRowSaved: boolean;
  remoteSynced: boolean;
  mode: 'insert' | 'update';
  id: number;
  message: string;
}

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const parseBool = (raw: string): boolean => {
  const key = raw.trim().toLowerCase();
  return key === 'true' || key === '1' || key === 'yes' || key === 'y';
};

const resolveOwner = () => {
  const phone = normalizeMobile(authSession.getUser()?.phone);
  return (
    (phone ? userDetailsSheetStore.findByMobile(phone) : undefined) ||
    userDetailsSheetStore.getAll()[0]
  );
};

const threadHeaderMap: Record<string, keyof RemoteChatThreadRow> = {
  threadid: 'threadId',
  threadkey: 'threadKey',
  userid: 'userId',
  mobile: 'mobile',
  role: 'role',
  ridetype: 'rideType',
  peername: 'peerName',
  peersubtitle: 'peerSubtitle',
  routelabel: 'routeLabel',
  lastmessage: 'lastMessage',
  timelabel: 'timeLabel',
  unreadcount: 'unreadCount',
  isonline: 'isOnline',
  avataruri: 'avatarUri',
  'thread id': 'threadId',
  'thread key': 'threadKey',
  'user id': 'userId',
  'ride type': 'rideType',
  'peer name': 'peerName',
  'peer subtitle': 'peerSubtitle',
  'route label': 'routeLabel',
  'last message': 'lastMessage',
  'time label': 'timeLabel',
  'unread count': 'unreadCount',
  'is online': 'isOnline',
  'avatar uri': 'avatarUri',
  phone: 'mobile',
};

const messageHeaderMap: Record<string, keyof RemoteChatMessageRow> = {
  messageid: 'messageId',
  threadkey: 'threadKey',
  userid: 'userId',
  mobile: 'mobile',
  sender: 'sender',
  text: 'text',
  timelabel: 'timeLabel',
  status: 'status',
  createdat: 'createdAt',
  'message id': 'messageId',
  'thread key': 'threadKey',
  'user id': 'userId',
  'time label': 'timeLabel',
  'created at': 'createdAt',
  phone: 'mobile',
};

const emptyThread = (): RemoteChatThreadRow => ({
  threadId: 0,
  threadKey: '',
  userId: 0,
  mobile: '',
  role: 'rider',
  rideType: 'outstation',
  peerName: '',
  peerSubtitle: '',
  routeLabel: '',
  lastMessage: '',
  timeLabel: '',
  unreadCount: 0,
  isOnline: false,
  avatarUri: '',
});

const emptyMessage = (): RemoteChatMessageRow => ({
  messageId: 0,
  threadKey: '',
  userId: 0,
  mobile: '',
  sender: 'user',
  text: '',
  timeLabel: '',
  status: '',
  createdAt: '',
});

const threadsCsvUrl = (): string =>
  DEMO_SHEET_LINKS.chatThreadsCsv(
    env.googleSheetId || DEMO_GOOGLE_SHEET_ID,
    env.googleSheetChatThreadsGid || DEMO_CHAT_THREADS_SHEET_GID,
  );

const messagesCsvUrl = (): string =>
  DEMO_SHEET_LINKS.chatMessagesCsv(
    env.googleSheetId || DEMO_GOOGLE_SHEET_ID,
    env.googleSheetChatMessagesGid || DEMO_CHAT_MESSAGES_SHEET_GID,
  );

const assignThreadCell = (
  row: RemoteChatThreadRow,
  key: keyof RemoteChatThreadRow,
  raw: string,
): void => {
  if (key === 'threadId' || key === 'userId' || key === 'unreadCount') {
    const amount = Number(String(raw).replace(/[^\d.]/g, ''));
    row[key] = Number.isFinite(amount) ? Math.floor(amount) : 0;
    return;
  }
  if (key === 'isOnline') {
    row.isOnline = parseBool(raw);
    return;
  }
  row[key] = raw;
};

const assignMessageCell = (
  row: RemoteChatMessageRow,
  key: keyof RemoteChatMessageRow,
  raw: string,
): void => {
  if (key === 'messageId' || key === 'userId') {
    const amount = Number(String(raw).replace(/[^\d.]/g, ''));
    row[key] = Number.isFinite(amount) ? Math.floor(amount) : 0;
    return;
  }
  row[key] = raw;
};

const mapThreadCsv = (csv: string): RemoteChatThreadRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }
  const headers = table[0].map(normalizeHeader);
  const expected = CHAT_THREADS_SHEET_HEADERS.map(normalizeHeader);
  const ordered =
    expected.every((name, index) => headers[index] === name)
      ? CHAT_THREADS_SHEET_FIELD_KEYS.map((key) => key)
      : null;

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyThread();
      if (ordered) {
        ordered.forEach((key, index) => {
          assignThreadCell(row, key as keyof RemoteChatThreadRow, cells[index] ?? '');
        });
        return row;
      }
      headers.forEach((header, index) => {
        const key = threadHeaderMap[header];
        if (key) {
          assignThreadCell(row, key, cells[index] ?? '');
        }
      });
      return row;
    })
    .filter((row) => row.threadId > 0 || row.threadKey || row.peerName);
};

const mapMessageCsv = (csv: string): RemoteChatMessageRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }
  const headers = table[0].map(normalizeHeader);
  const expected = CHAT_MESSAGES_SHEET_HEADERS.map(normalizeHeader);
  const ordered =
    expected.every((name, index) => headers[index] === name)
      ? CHAT_MESSAGES_SHEET_FIELD_KEYS.map((key) => key)
      : null;

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyMessage();
      if (ordered) {
        ordered.forEach((key, index) => {
          assignMessageCell(row, key as keyof RemoteChatMessageRow, cells[index] ?? '');
        });
        return row;
      }
      headers.forEach((header, index) => {
        const key = messageHeaderMap[header];
        if (key) {
          assignMessageCell(row, key, cells[index] ?? '');
        }
      });
      return row;
    })
    .filter((row) => row.messageId > 0 || row.text);
};

const threadLocalToRemote = (row: ChatThreadsSheetRow): RemoteChatThreadRow => ({
  threadId: row.threadId,
  threadKey: row.threadKey,
  userId: row.userId,
  mobile: row.mobile,
  role: row.role,
  rideType: row.rideType,
  peerName: row.peerName,
  peerSubtitle: row.peerSubtitle,
  routeLabel: row.routeLabel,
  lastMessage: row.lastMessage,
  timeLabel: row.timeLabel,
  unreadCount: row.unreadCount,
  isOnline: row.isOnline,
  avatarUri: row.avatarUri,
});

const messageLocalToRemote = (row: ChatMessagesSheetRow): RemoteChatMessageRow => ({
  messageId: row.messageId,
  threadKey: row.threadKey,
  userId: row.userId,
  mobile: row.mobile,
  sender: row.sender,
  text: row.text,
  timeLabel: row.timeLabel,
  status: row.status,
  createdAt: row.createdAt,
});

const pushEntity = async (
  entity: 'chatThread' | 'chatMessage',
  row: RemoteChatThreadRow | RemoteChatMessageRow,
  mode: 'insert' | 'update',
): Promise<boolean> => {
  const webhook = env.googleSheetWebhookUrl;
  if (!webhook) {
    console.log('[Chat Sheet] push skipped (no webhook)', { entity, mode, row });
    return false;
  }
  const body = { entity, action: mode, row };
  console.log('[Chat Sheet] push request', { webhook, body });
  const response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  console.log('[Chat Sheet] push response', { httpStatus: response.status, body: text });
  return response.ok;
};

export const chatSheetSync = {
  fetchRemoteThreads: async (): Promise<RemoteChatThreadRow[] | null> => {
    const url = threadsCsvUrl();
    console.log('[ChatThreads Sheet] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) {
      throw new Error('Unable to read ChatThreads sheet.');
    }
    if (
      text.trim().startsWith('<') ||
      !normalizeHeader(text.split('\n')[0] ?? '').includes('thread')
    ) {
      console.log('[ChatThreads Sheet] tab missing or wrong gid');
      return null;
    }
    return mapThreadCsv(text);
  },

  fetchRemoteMessages: async (): Promise<RemoteChatMessageRow[] | null> => {
    const url = messagesCsvUrl();
    console.log('[ChatMessages Sheet] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    if (!response.ok) {
      throw new Error('Unable to read ChatMessages sheet.');
    }
    if (
      text.trim().startsWith('<') ||
      !normalizeHeader(text.split('\n')[0] ?? '').includes('message')
    ) {
      console.log('[ChatMessages Sheet] tab missing or wrong gid');
      return null;
    }
    return mapMessageCsv(text);
  },

  pullIntoLocal: async (): Promise<void> => {
    await Promise.all([chatThreadsSheetStore.hydrate(), chatMessagesSheetStore.hydrate()]);
    const sessionPhone = normalizeMobile(authSession.getUser()?.phone);

    try {
      const threads = await chatSheetSync.fetchRemoteThreads();
      if (threads) {
        for (const remote of threads) {
          if (
            sessionPhone &&
            normalizeMobile(remote.mobile) &&
            normalizeMobile(remote.mobile) !== sessionPhone
          ) {
            continue;
          }
          await chatThreadsSheetStore.upsert({
            threadId: remote.threadId > 0 ? remote.threadId : undefined,
            threadKey: remote.threadKey,
            userId: remote.userId > 0 ? remote.userId : undefined,
            mobile: remote.mobile || sessionPhone || undefined,
            role: remote.role as ChatThreadsSheetRow['role'],
            rideType: remote.rideType as ChatThreadsSheetRow['rideType'],
            peerName: remote.peerName,
            peerSubtitle: remote.peerSubtitle,
            routeLabel: remote.routeLabel,
            lastMessage: remote.lastMessage,
            timeLabel: remote.timeLabel,
            unreadCount: remote.unreadCount,
            isOnline: remote.isOnline,
            avatarUri: remote.avatarUri,
          });
        }
      }
    } catch (error) {
      console.log('[ChatThreads Sheet] pull skipped', error);
    }

    try {
      const messages = await chatSheetSync.fetchRemoteMessages();
      if (messages) {
        for (const remote of messages) {
          if (
            sessionPhone &&
            normalizeMobile(remote.mobile) &&
            normalizeMobile(remote.mobile) !== sessionPhone
          ) {
            continue;
          }
          await chatMessagesSheetStore.upsert({
            messageId: remote.messageId > 0 ? remote.messageId : undefined,
            threadKey: remote.threadKey,
            userId: remote.userId > 0 ? remote.userId : undefined,
            mobile: remote.mobile || sessionPhone || undefined,
            sender: remote.sender as ChatMessagesSheetRow['sender'],
            text: remote.text,
            timeLabel: remote.timeLabel,
            status: remote.status as ChatMessagesSheetRow['status'],
            createdAt: remote.createdAt,
          });
        }
      }
    } catch (error) {
      console.log('[ChatMessages Sheet] pull skipped', error);
    }
  },

  upsertThreadAndSync: async (
    input: Partial<RemoteChatThreadRow> & { threadKey: string; peerName: string },
  ): Promise<ChatSyncResult> => {
    const owner = resolveOwner();
    const mobile =
      normalizeMobile(input.mobile) ||
      owner?.mobile ||
      normalizeMobile(authSession.getUser()?.phone) ||
      '';
    const existing = chatThreadsSheetStore.findByThreadKey(input.threadKey, mobile);
    const mode: 'insert' | 'update' = existing ? 'update' : 'insert';
    const threadId =
      existing?.threadId && existing.threadId > 0
        ? existing.threadId
        : input.threadId && input.threadId >= CHAT_THREADS_SHEET_ID_START
          ? input.threadId
          : chatThreadsSheetStore.nextThreadId();

    const saved = await chatThreadsSheetStore.upsert({
      threadId,
      threadKey: input.threadKey,
      userId: input.userId || owner?.userId || 0,
      mobile,
      role: input.role as ChatThreadsSheetRow['role'],
      rideType: input.rideType as ChatThreadsSheetRow['rideType'],
      peerName: input.peerName,
      peerSubtitle: input.peerSubtitle,
      routeLabel: input.routeLabel,
      lastMessage: input.lastMessage,
      timeLabel: input.timeLabel,
      unreadCount: input.unreadCount,
      isOnline: input.isOnline,
      avatarUri: input.avatarUri,
    });

    let remoteSynced = false;
    try {
      remoteSynced = await pushEntity('chatThread', threadLocalToRemote(saved), mode);
    } catch (error) {
      console.log('[ChatThreads Sheet] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode,
      id: saved.threadId,
      message: remoteSynced
        ? `ThreadID ${saved.threadId} synced to sheet.`
        : `ThreadID ${saved.threadId} saved locally.`,
    };
  },

  upsertMessageAndSync: async (
    input: Partial<RemoteChatMessageRow> & { threadKey: string; text: string; sender: string },
  ): Promise<ChatSyncResult> => {
    const owner = resolveOwner();
    const mobile =
      normalizeMobile(input.mobile) ||
      owner?.mobile ||
      normalizeMobile(authSession.getUser()?.phone) ||
      '';
    const existing =
      input.messageId && input.messageId > 0
        ? chatMessagesSheetStore.findByMessageId(input.messageId)
        : undefined;
    const mode: 'insert' | 'update' = existing ? 'update' : 'insert';
    const messageId =
      existing?.messageId && existing.messageId > 0
        ? existing.messageId
        : input.messageId && input.messageId >= CHAT_MESSAGES_SHEET_ID_START
          ? input.messageId
          : chatMessagesSheetStore.nextMessageId();

    const saved = await chatMessagesSheetStore.upsert({
      messageId,
      threadKey: input.threadKey,
      userId: input.userId || owner?.userId || 0,
      mobile,
      sender: input.sender as ChatMessagesSheetRow['sender'],
      text: input.text,
      timeLabel: input.timeLabel,
      status: input.status as ChatMessagesSheetRow['status'],
      createdAt: input.createdAt,
    });

    // Keep inbox preview in sync.
    await chatThreadsSheetStore.upsert({
      threadKey: input.threadKey,
      mobile,
      userId: owner?.userId,
      lastMessage: input.text,
      timeLabel: input.timeLabel || saved.timeLabel,
    });

    let remoteSynced = false;
    try {
      remoteSynced = await pushEntity('chatMessage', messageLocalToRemote(saved), mode);
      const thread = chatThreadsSheetStore.findByThreadKey(input.threadKey, mobile);
      if (thread) {
        await pushEntity('chatThread', threadLocalToRemote(thread), 'update');
      }
    } catch (error) {
      console.log('[ChatMessages Sheet] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode,
      id: saved.messageId,
      message: remoteSynced
        ? `MessageID ${saved.messageId} synced to sheet.`
        : `MessageID ${saved.messageId} saved locally.`,
    };
  },

  ensureSupportThread: async (): Promise<ChatThreadsSheetRow> => {
    const owner = resolveOwner();
    const mobile = owner?.mobile || normalizeMobile(authSession.getUser()?.phone) || '';
    const existing = chatThreadsSheetStore.findByThreadKey(SUPPORT_CHAT_THREAD_KEY, mobile);
    if (existing) {
      return existing;
    }
    const result = await chatSheetSync.upsertThreadAndSync({
      threadKey: SUPPORT_CHAT_THREAD_KEY,
      peerName: 'BhaiWay Support',
      peerSubtitle: 'Help desk',
      routeLabel: 'Support',
      role: 'rider',
      rideType: 'support',
      lastMessage: '',
      timeLabel: '',
      unreadCount: 0,
      isOnline: true,
      mobile,
      userId: owner?.userId,
    });
    return (
      chatThreadsSheetStore.findByThreadKey(SUPPORT_CHAT_THREAD_KEY, mobile) ||
      ({
        row_id: 0,
        threadId: result.id,
        threadKey: SUPPORT_CHAT_THREAD_KEY,
        userId: owner?.userId || 0,
        mobile,
        role: 'rider',
        rideType: 'support',
        peerName: 'BhaiWay Support',
        peerSubtitle: 'Help desk',
        routeLabel: 'Support',
        lastMessage: '',
        timeLabel: '',
        unreadCount: 0,
        isOnline: true,
        avatarUri: '',
        updated_at: new Date().toISOString(),
      } satisfies ChatThreadsSheetRow)
    );
  },
};
