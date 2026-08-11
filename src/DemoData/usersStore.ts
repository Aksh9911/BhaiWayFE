import { DEMO_STORAGE_KEYS } from '@/DemoData/files';

import type { DemoUser, DemoUserInput } from './types';
import { createLocalListStore } from './localStore';

const store = createLocalListStore<DemoUser, 'user_id'>(DEMO_STORAGE_KEYS.users, 'user_id');

export const demoUsersStore = {
  hydrate: store.hydrate,
  getAll: store.getAll,
  getById: store.getById,
  subscribe: store.subscribe,
  removeById: store.removeById,
  clear: store.clear,

  add: async (input: DemoUserInput): Promise<DemoUser> => {
    await store.hydrate();
    const user: DemoUser = {
      user_id: store.nextId(),
      full_name: input.full_name.trim(),
      email: input.email.trim(),
      mobile: input.mobile.trim(),
      profile_image: input.profile_image?.trim() || '',
      gender: input.gender,
      rating: input.rating ?? 5,
      total_rides: input.total_rides ?? 0,
      is_verified: input.is_verified ?? false,
      role: input.role,
      created_at: input.created_at ?? new Date().toISOString(),
    };
    return store.save(user);
  },

  update: async (userId: number, patch: Partial<DemoUserInput>): Promise<DemoUser | null> => {
    await store.hydrate();
    const existing = store.getById(userId);
    if (!existing) {
      return null;
    }
    const next: DemoUser = {
      ...existing,
      ...patch,
      user_id: existing.user_id,
      full_name: patch.full_name?.trim() ?? existing.full_name,
      email: patch.email?.trim() ?? existing.email,
      mobile: patch.mobile?.trim() ?? existing.mobile,
      profile_image: patch.profile_image?.trim() ?? existing.profile_image,
    };
    return store.save(next);
  },

  getByRole: (role: DemoUser['role']) =>
    store.getAll().filter((user) => user.role === role || user.role === 'both'),

  getDrivers: () =>
    store.getAll().filter((user) => user.role === 'driver' || user.role === 'both'),

  getPassengers: () =>
    store.getAll().filter((user) => user.role === 'passenger' || user.role === 'both'),
};
