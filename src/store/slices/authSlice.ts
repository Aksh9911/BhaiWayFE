import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { SessionUser } from '@/store/auth';

export interface AuthState {
  userId: string | null;
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
  user: SessionUser | null;
}

const initialState: AuthState = {
  userId: null,
  token: null,
  role: null,
  isAuthenticated: false,
  user: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthSession(
      state,
      action: PayloadAction<{ token: string; user: SessionUser; role?: string | null }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.userId = action.payload.user.id;
      state.role = action.payload.role ?? null;
      state.isAuthenticated = true;
    },
    patchAuthUser(state, action: PayloadAction<Partial<SessionUser>>) {
      if (!state.user) {
        return;
      }
      state.user = { ...state.user, ...action.payload };
      state.userId = state.user.id;
    },
    clearAuthSession() {
      return initialState;
    },
  },
});

export const { setAuthSession, patchAuthUser, clearAuthSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
