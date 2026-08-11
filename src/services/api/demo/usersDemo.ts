import { findCurrentUserSheetRow, userDetailsSheetStore } from '@/DemoData';
import { authSession } from '@/store';

import type { NormalizedRequest } from './demoRouter';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toUserDto = () => {
  const session = authSession.getUser();
  const row = findCurrentUserSheetRow();
  return {
    user: {
      id: session?.id ?? String(row?.userId ?? ''),
      fullName: row?.userName?.trim() || session?.fullName || '',
      phone: row?.mobile || session?.phone || '',
      email: row?.email || session?.email || null,
      avatarUri: row?.profilePicture || session?.avatarUri || null,
      corporateId: row?.corporateId || null,
      wallet: row?.bhaiWayWallet ?? 0,
    },
    row,
  };
};

export const handleUsersDemo = async (request: NormalizedRequest): Promise<unknown> => {
  await wait(80);
  const { method, url, body } = request;
  const path = url.split('?')[0] ?? url;

  if (method === 'GET' && path === '/users/me') {
    return toUserDto();
  }

  const userMatch = path.match(/^\/users\/([^/]+)$/);
  const profileMatch = path.match(/^\/users\/([^/]+)\/profile$/);

  if (method === 'GET' && (userMatch || profileMatch)) {
    const id = (userMatch ?? profileMatch)?.[1] ?? '';
    const byId = userDetailsSheetStore.getAll().find((row) => String(row.userId) === id);
    const byMobile = userDetailsSheetStore.findByMobile(id);
    const row = byId ?? byMobile ?? findCurrentUserSheetRow();
    if (!row) {
      throw new Error('User not found');
    }
    return {
      user: {
        id: String(row.userId),
        fullName: row.userName,
        phone: row.mobile,
        email: row.email,
        avatarUri: row.profilePicture,
        corporateId: row.corporateId,
        wallet: row.bhaiWayWallet,
      },
      row,
    };
  }

  if (method === 'PUT' && (userMatch || profileMatch)) {
    const session = authSession.getUser();
    const payload = (body ?? {}) as Record<string, unknown>;
    if (session) {
      authSession.setSession(authSession.getToken() ?? 'demo-token', {
        ...session,
        fullName: payload.fullName != null ? String(payload.fullName) : session.fullName,
        email:
          payload.email !== undefined ? ((payload.email as string | null) ?? null) : session.email,
        avatarUri:
          payload.avatarUri !== undefined
            ? ((payload.avatarUri as string | null) ?? null)
            : session.avatarUri,
      });
    }
    return toUserDto();
  }

  throw new Error(`Demo users route not implemented: ${method} ${path}`);
};
