import { bhaiwayApi } from './apiSlice';

export const usersApi = bhaiwayApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<{ user: Record<string, unknown> }, void>({
      query: () => '/users/me',
      providesTags: [{ type: 'User', id: 'ME' }],
    }),
    getUser: build.query<{ user: Record<string, unknown> }, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
    }),
    getUserProfile: build.query<{ user: Record<string, unknown> }, string>({
      query: (userId) => `/users/${userId}/profile`,
      providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
    }),
    updateUser: build.mutation<
      { user: Record<string, unknown> },
      { userId: string; body: Record<string, unknown> }
    >({
      query: ({ userId, body }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'User', id: arg.userId },
        { type: 'User', id: 'ME' },
      ],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetUserQuery,
  useGetUserProfileQuery,
  useUpdateUserMutation,
} = usersApi;
