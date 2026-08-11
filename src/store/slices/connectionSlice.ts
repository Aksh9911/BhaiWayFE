import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ConnectionStatus = 'online' | 'offline' | 'reconnecting' | 'connected';

export interface ConnectionState {
  network: ConnectionStatus;
  realtime: ConnectionStatus;
  lastError: string | null;
}

const initialState: ConnectionState = {
  network: 'online',
  realtime: 'offline',
  lastError: null,
};

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setNetworkStatus(state, action: PayloadAction<ConnectionStatus>) {
      state.network = action.payload;
    },
    setRealtimeStatus(state, action: PayloadAction<ConnectionStatus>) {
      state.realtime = action.payload;
    },
    setConnectionError(state, action: PayloadAction<string | null>) {
      state.lastError = action.payload;
    },
  },
});

export const { setNetworkStatus, setRealtimeStatus, setConnectionError } = connectionSlice.actions;
export const connectionReducer = connectionSlice.reducer;
