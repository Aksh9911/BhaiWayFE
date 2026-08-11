import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { bhaiwayApi } from '@/services/api/apiSlice';
import '@/services/api/usersApi';
import '@/services/api/ridesApi';
import '@/services/api/bookingsApi';
import '@/services/api/paymentsApi';
import '@/services/api/notificationsApi';
import '@/services/api/trackingApi';
import '@/services/api/ratingsApi';
import { authReducer } from '@/store/slices/authSlice';
import { connectionReducer } from '@/store/slices/connectionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    connection: connectionReducer,
    [bhaiwayApi.reducerPath]: bhaiwayApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(bhaiwayApi.middleware),
  devTools: __DEV__,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
