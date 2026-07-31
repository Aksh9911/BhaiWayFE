import { useEffect, useState } from 'react';

import { authSession, type SessionUser } from '@/store';

export const useSessionUser = (): SessionUser | null => {
  const [user, setUser] = useState<SessionUser | null>(() => authSession.getUser());

  useEffect(() => {
    return authSession.subscribe((session) => setUser(session.user));
  }, []);

  return user;
};
