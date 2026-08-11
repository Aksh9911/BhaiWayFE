import type { NotificationsSheetRow } from '@/DemoData';

import { bhaiwayApi } from './apiSlice';

export const notificationsApi = bhaiwayApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<{ notifications: NotificationsSheetRow[]; total: number }, void>({
      query: () => '/notifications',
      providesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
    markNotificationRead: build.mutation<{ ok: boolean }, string | number>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
    markAllNotificationsRead: build.mutation<{ ok: boolean }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PUT',
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
