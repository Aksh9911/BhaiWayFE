import { env } from '@/config';
import {
  DEMO_GOOGLE_SHEET_ID,
  DEMO_NOTIFICATIONS_SHEET_GID,
  DEMO_SHEET_LINKS,
  NOTIFICATIONS_SHEET_FIELD_KEYS,
  NOTIFICATIONS_SHEET_HEADERS,
  NOTIFICATIONS_SHEET_ID_START,
} from '@/DemoData/files';
import { authSession } from '@/store';

import { userDetailsSheetStore } from '../userDetailsSheetStore';
import {
  type NotificationsSheetRow,
} from '../notificationsSheet.types';
import { notificationsSheetStore } from '../notificationsSheetStore';
import { normalizeHeader, parseCsv } from './csv';

export interface RemoteNotificationRow {
  notificationId: number;
  userId: number;
  mobile: string;
  title: string;
  body: string;
  timeLabel: string;
  category: string;
  section: string;
  unread: boolean;
  createdAt: string;
}

export interface NotificationSyncResult {
  localRowSaved: boolean;
  remoteSynced: boolean;
  mode: 'insert' | 'update';
  notificationId: number;
  message: string;
}

const normalizeMobile = (value?: string | null): string =>
  (value ?? '').replace(/\D/g, '').slice(-10);

const parseUnread = (raw: string): boolean => {
  const key = raw.trim().toLowerCase();
  return key === 'true' || key === '1' || key === 'yes' || key === 'y';
};

const headerMap: Record<string, keyof RemoteNotificationRow> = {
  notificationid: 'notificationId',
  userid: 'userId',
  mobile: 'mobile',
  title: 'title',
  body: 'body',
  timelabel: 'timeLabel',
  category: 'category',
  section: 'section',
  unread: 'unread',
  createdat: 'createdAt',
  'notification id': 'notificationId',
  'user id': 'userId',
  'time label': 'timeLabel',
  'created at': 'createdAt',
  phone: 'mobile',
};

const emptyRemote = (): RemoteNotificationRow => ({
  notificationId: 0,
  userId: 0,
  mobile: '',
  title: '',
  body: '',
  timeLabel: '',
  category: 'system',
  section: 'today',
  unread: true,
  createdAt: '',
});

const sheetCsvUrl = (): string =>
  DEMO_SHEET_LINKS.notificationsCsv(
    env.googleSheetId || DEMO_GOOGLE_SHEET_ID,
    env.googleSheetNotificationsGid || DEMO_NOTIFICATIONS_SHEET_GID,
  );

const assignCell = (
  row: RemoteNotificationRow,
  key: keyof RemoteNotificationRow,
  raw: string,
): void => {
  if (key === 'notificationId' || key === 'userId') {
    const amount = Number(String(raw).replace(/[^\d.]/g, ''));
    row[key] = Number.isFinite(amount) ? Math.floor(amount) : 0;
    return;
  }
  if (key === 'unread') {
    row.unread = parseUnread(raw);
    return;
  }
  row[key] = raw;
};

const mapCsvToRemoteRows = (csv: string): RemoteNotificationRow[] => {
  const table = parseCsv(csv.trim());
  if (table.length < 1) {
    return [];
  }
  const headers = table[0].map(normalizeHeader);
  const expected = NOTIFICATIONS_SHEET_HEADERS.map(normalizeHeader);
  const ordered =
    expected.length > 0 && expected.every((name, index) => headers[index] === name)
      ? NOTIFICATIONS_SHEET_FIELD_KEYS.map((key) => key)
      : null;

  return table
    .slice(1)
    .map((cells) => {
      const row = emptyRemote();
      if (ordered) {
        ordered.forEach((key, index) => {
          assignCell(row, key as keyof RemoteNotificationRow, cells[index] ?? '');
        });
        return row;
      }
      headers.forEach((header, index) => {
        const key = headerMap[header];
        if (key) {
          assignCell(row, key, cells[index] ?? '');
        }
      });
      return row;
    })
    .filter((row) => row.notificationId > 0 || row.title || row.body);
};

const localToRemote = (row: NotificationsSheetRow): RemoteNotificationRow => ({
  notificationId: row.notificationId,
  userId: row.userId,
  mobile: row.mobile,
  title: row.title,
  body: row.body,
  timeLabel: row.timeLabel,
  category: row.category,
  section: row.section,
  unread: row.unread,
  createdAt: row.createdAt,
});

const resolveOwner = () => {
  const phone = normalizeMobile(authSession.getUser()?.phone);
  return (
    (phone ? userDetailsSheetStore.findByMobile(phone) : undefined) ||
    userDetailsSheetStore.getAll()[0]
  );
};

export const notificationsSheetSync = {
  fetchRemoteRows: async (): Promise<RemoteNotificationRow[] | null> => {
    const url = sheetCsvUrl();
    console.log('[Notifications Sheet] fetch request', { url });
    const response = await fetch(url);
    const text = await response.text();
    console.log('[Notifications Sheet] fetch response', {
      httpStatus: response.status,
      bytes: text.length,
      preview: text.slice(0, 240),
    });
    if (!response.ok) {
      throw new Error('Unable to read Notifications sheet. Create the tab or check gid.');
    }
    if (
      text.trim().startsWith('<') ||
      !normalizeHeader(text.split('\n')[0] ?? '').includes('notification')
    ) {
      console.log('[Notifications Sheet] tab missing or wrong gid');
      return null;
    }
    return mapCsvToRemoteRows(text);
  },

  pullIntoLocal: async (): Promise<RemoteNotificationRow[]> => {
    await notificationsSheetStore.hydrate();
    let remoteRows: RemoteNotificationRow[] = [];
    try {
      const remote = await notificationsSheetSync.fetchRemoteRows();
      if (remote) {
        remoteRows = remote;
      }
    } catch (error) {
      console.log('[Notifications Sheet] pull skipped', error);
    }

    const sessionPhone = normalizeMobile(authSession.getUser()?.phone);
    for (const remote of remoteRows) {
      if (sessionPhone && normalizeMobile(remote.mobile) && normalizeMobile(remote.mobile) !== sessionPhone) {
        continue;
      }
      await notificationsSheetStore.upsert({
        notificationId: remote.notificationId > 0 ? remote.notificationId : undefined,
        userId: remote.userId > 0 ? remote.userId : undefined,
        mobile: remote.mobile || sessionPhone || undefined,
        title: remote.title,
        body: remote.body,
        timeLabel: remote.timeLabel,
        category: remote.category as NotificationsSheetRow['category'],
        section: remote.section as NotificationsSheetRow['section'],
        unread: remote.unread,
        createdAt: remote.createdAt,
      });
    }
    return remoteRows;
  },

  pushRemote: async (
    row: RemoteNotificationRow,
    mode: 'insert' | 'update',
  ): Promise<boolean> => {
    const webhook = env.googleSheetWebhookUrl;
    if (!webhook) {
      console.log('[Notifications Sheet] push skipped (no webhook)', { mode, row });
      return false;
    }
    const body = { entity: 'notification', action: mode, row };
    console.log('[Notifications Sheet] push request', { webhook, body });
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await response.text();
    console.log('[Notifications Sheet] push response', {
      httpStatus: response.status,
      body: text,
    });
    return response.ok;
  },

  upsertAndSync: async (
    input: Omit<Partial<RemoteNotificationRow>, 'notificationId'> & {
      notificationId?: number;
      title: string;
      body: string;
    },
  ): Promise<NotificationSyncResult> => {
    const owner = resolveOwner();
    const mobile =
      normalizeMobile(input.mobile) ||
      owner?.mobile ||
      normalizeMobile(authSession.getUser()?.phone) ||
      '';

    const existing =
      input.notificationId && input.notificationId > 0
        ? notificationsSheetStore.findByNotificationId(input.notificationId)
        : undefined;
    const mode: 'insert' | 'update' = existing ? 'update' : 'insert';
    const notificationId =
      existing?.notificationId && existing.notificationId > 0
        ? existing.notificationId
        : input.notificationId && input.notificationId >= NOTIFICATIONS_SHEET_ID_START
          ? input.notificationId
          : notificationsSheetStore.nextNotificationId();

    const saved = await notificationsSheetStore.upsert({
      notificationId,
      userId: input.userId || owner?.userId || 0,
      mobile,
      title: input.title,
      body: input.body,
      timeLabel: input.timeLabel,
      category: input.category as NotificationsSheetRow['category'],
      section: input.section as NotificationsSheetRow['section'],
      unread: input.unread,
      createdAt: input.createdAt,
    });

    let remoteSynced = false;
    try {
      remoteSynced = await notificationsSheetSync.pushRemote(localToRemote(saved), mode);
    } catch (error) {
      console.log('[Notifications Sheet] push failed', error);
    }

    return {
      localRowSaved: true,
      remoteSynced,
      mode,
      notificationId: saved.notificationId,
      message: remoteSynced
        ? `NotificationID ${saved.notificationId} ${mode === 'insert' ? 'added to' : 'updated in'} sheet.`
        : `NotificationID ${saved.notificationId} saved locally.`,
    };
  },

  markReadAndSync: async (notificationId: number): Promise<NotificationSyncResult> => {
    const saved = await notificationsSheetStore.markRead(notificationId, false);
    if (!saved) {
      throw Object.assign(new Error('Notification not found.'), {
        code: 'NOTIFICATION_NOT_FOUND',
      });
    }
    let remoteSynced = false;
    try {
      remoteSynced = await notificationsSheetSync.pushRemote(localToRemote(saved), 'update');
    } catch (error) {
      console.log('[Notifications Sheet] markRead push failed', error);
    }
    return {
      localRowSaved: true,
      remoteSynced,
      mode: 'update',
      notificationId: saved.notificationId,
      message: remoteSynced
        ? `NotificationID ${saved.notificationId} marked read in sheet.`
        : `NotificationID ${saved.notificationId} marked read locally.`,
    };
  },

  markAllReadAndSync: async (): Promise<{ synced: number }> => {
    const rows = await notificationsSheetStore.markAllReadForCurrentUser();
    let synced = 0;
    for (const row of rows) {
      try {
        if (await notificationsSheetSync.pushRemote(localToRemote(row), 'update')) {
          synced += 1;
        }
      } catch (error) {
        console.log('[Notifications Sheet] markAllRead push failed', error);
      }
    }
    return { synced };
  },
};
