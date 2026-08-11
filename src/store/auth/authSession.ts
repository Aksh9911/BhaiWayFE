import type { UserProfile } from '@/features/auth/types';

import { authStorage } from './authStorage';

export interface SessionUser {
  id: string;
  fullName: string;
  email: string | null;
  avatarUri: string | null;
  phone: string | null;
}

interface AuthSessionState {
  token: string | null;
  user: SessionUser | null;
  role: string | null;
  hydrated: boolean;
}

type SessionListener = (state: AuthSessionState) => void;

const state: AuthSessionState = {
  token: null,
  user: null,
  role: null,
  hydrated: false,
};

const listeners = new Set<SessionListener>();

const notify = (): void => {
  listeners.forEach((listener) =>
    listener({
      token: state.token,
      user: state.user ? { ...state.user } : null,
      role: state.role,
      hydrated: state.hydrated,
    }),
  );
};

const toSessionUser = (
  partial: Partial<SessionUser> & { id: string; fullName: string },
): SessionUser => ({
  id: partial.id,
  fullName: partial.fullName,
  email: partial.email ?? null,
  avatarUri: partial.avatarUri ?? null,
  phone: partial.phone ?? null,
});

const persistCurrent = (): void => {
  if (!state.token || !state.user) {
    void authStorage.clear();
    return;
  }
  void authStorage.save({
    token: state.token,
    user: state.user,
    role: state.role,
  });
};

export const authSession = {
  getToken: (): string | null => state.token,
  getUser: (): SessionUser | null => (state.user ? { ...state.user } : null),
  getRole: (): string | null => state.role,
  isHydrated: (): boolean => state.hydrated,
  isAuthenticated: (): boolean => Boolean(state.token && state.user),

  /** Restore session from AsyncStorage before rendering auth gates. */
  hydrate: async (): Promise<boolean> => {
    const saved = await authStorage.load();
    if (saved) {
      state.token = saved.token;
      state.user = saved.user;
      state.role = saved.role ?? null;
    } else {
      state.token = null;
      state.user = null;
      state.role = null;
    }
    state.hydrated = true;
    notify();
    return Boolean(saved);
  },

  setSession: (token: string, user: SessionUser, role?: string | null): void => {
    state.token = token;
    state.user = user;
    state.role = role ?? state.role;
    state.hydrated = true;
    persistCurrent();
    notify();
  },

  setUserFromProfile: (profile: UserProfile): void => {
    state.user = toSessionUser({
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      avatarUri: profile.avatarUri,
      phone: state.user?.phone ?? null,
    });
    persistCurrent();
    notify();
  },

  clear: (): void => {
    state.token = null;
    state.user = null;
    state.role = null;
    state.hydrated = true;
    void authStorage.clear();
    notify();
  },

  subscribe: (listener: SessionListener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export const createSessionUser = toSessionUser;
