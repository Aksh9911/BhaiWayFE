import { notificationsSheetStore } from '@/DemoData';

import type { NormalizedRequest } from './demoRouter';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const handleNotificationsDemo = async (request: NormalizedRequest): Promise<unknown> => {
  await wait(80);
  const { method, url } = request;
  const path = url.split('?')[0] ?? url;

  if (method === 'GET' && path === '/notifications') {
    const rows = notificationsSheetStore.getForCurrentUser();
    return { notifications: rows, total: rows.length };
  }

  const readMatch = path.match(/^\/notifications\/([^/]+)\/read$/);
  if (method === 'PUT' && readMatch) {
    return { ok: true, id: readMatch[1] };
  }

  if (method === 'PUT' && path === '/notifications/read-all') {
    return { ok: true };
  }

  throw new Error(`Demo notifications route not implemented: ${method} ${path}`);
};
