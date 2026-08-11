import { authSession } from '@/store';

import { demoUsersStore } from './usersStore';
import type { DemoUser, DemoUserGender, DemoVehicleType } from './types';

export const mapGenderToDemo = (gender?: string | null): DemoUserGender => {
  const value = (gender ?? '').toLowerCase();
  if (value === 'female') {
    return 'Female';
  }
  if (value === 'other') {
    return 'Other';
  }
  return 'Male';
};

export const mapVehicleCategoryToDemo = (category?: string | null): DemoVehicleType => {
  const value = (category ?? '').toLowerCase();
  if (value.includes('suv')) {
    return 'SUV';
  }
  if (value.includes('hatch')) {
    return 'Hatchback';
  }
  if (value.includes('muv') || value.includes('mpv')) {
    return 'MUV';
  }
  if (value.includes('coupe')) {
    return 'Coupe';
  }
  if (value.includes('sedan')) {
    return 'Sedan';
  }
  return 'Other';
};

export const findDemoUserForSession = (): DemoUser | undefined => {
  const session = authSession.getUser();
  const users = demoUsersStore.getAll();
  if (users.length === 0) {
    return undefined;
  }

  const email = session?.email?.trim().toLowerCase();
  if (email) {
    const byEmail = users.find((user) => user.email.trim().toLowerCase() === email);
    if (byEmail) {
      return byEmail;
    }
  }

  const phoneDigits = (session?.phone ?? '').replace(/\D/g, '').slice(-10);
  if (phoneDigits.length >= 10) {
    const byPhone = users.find((user) => user.mobile.replace(/\D/g, '').endsWith(phoneDigits));
    if (byPhone) {
      return byPhone;
    }
  }

  return users[users.length - 1];
};

export const resolveDemoOwnerId = (): number => {
  const matched = findDemoUserForSession();
  if (matched) {
    return matched.user_id;
  }

  const session = authSession.getUser();
  const numeric = Number((session?.id ?? '').replace(/\D/g, ''));
  if (Number.isFinite(numeric) && numeric > 0) {
    return Math.floor(numeric % 1_000_000) || 1;
  }

  return 1;
};

export const parseRideIdToNumber = (rideId?: string | null): number => {
  const digits = String(rideId ?? '').replace(/\D/g, '');
  const numeric = Number(digits);
  if (Number.isFinite(numeric) && numeric > 0) {
    return Math.floor(numeric % 1_000_000_000) || 1;
  }
  return Math.floor(Date.now() % 1_000_000_000);
};

export const splitVehicleModel = (rawModel: string): { make: string; model: string } => {
  const trimmed = rawModel.trim();
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { make: 'Other', model: trimmed || 'Unknown' };
  }
  return {
    make: parts[0],
    model: parts.slice(1).join(' '),
  };
};
