import type { UserProfile } from '@/features/auth/types';

export interface SessionUser {
  id: string;
  fullName: string;
  email: string | null;
  avatarUri: string | null;
}

interface AuthSessionState {
  token: string | null;
  user: SessionUser | null;
}

type SessionListener = (state: AuthSessionState) => void;

const state: AuthSessionState = {
  token: null,
  user: null,
};

const listeners = new Set<SessionListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener({ ...state }));
};

const toSessionUser = (partial: Partial<SessionUser> & { id: string; fullName: string }): SessionUser => ({
  id: partial.id,
  fullName: partial.fullName,
  email: partial.email ?? null,
  avatarUri: partial.avatarUri ?? null,
});

export const authSession = {
  getToken: (): string | null => state.token,
  getUser: (): SessionUser | null => (state.user ? { ...state.user } : null),

  setSession: (token: string, user: SessionUser): void => {
    state.token = token;
    state.user = user;
    notify();
  },

  setUserFromProfile: (profile: UserProfile): void => {
    state.user = toSessionUser({
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      avatarUri: profile.avatarUri,
    });
    notify();
  },

  clear: (): void => {
    state.token = null;
    state.user = null;
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
