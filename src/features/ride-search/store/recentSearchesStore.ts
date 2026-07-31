import { generateId } from '@/shared/utils';
import type { RecentSearchItem, SelectedLocation } from '../types';

const MAX_RECENT_SEARCHES = 8;

let recentSearches: RecentSearchItem[] = [];
const listeners = new Set<(items: RecentSearchItem[]) => void>();

const notify = () => {
  const snapshot = [...recentSearches];
  listeners.forEach((listener) => listener(snapshot));
};

const sameRoute = (a: RecentSearchItem, b: RecentSearchItem): boolean =>
  a.origin === b.origin &&
  a.destination === b.destination &&
  a.dateLabel === b.dateLabel;

export const recentSearchesStore = {
  get: (): RecentSearchItem[] => [...recentSearches],

  subscribe: (listener: (items: RecentSearchItem[]) => void): (() => void) => {
    listeners.add(listener);
    listener([...recentSearches]);
    return () => {
      listeners.delete(listener);
    };
  },

  add: (params: {
    origin: SelectedLocation;
    destination: SelectedLocation;
    dateLabel: string;
  }) => {
    const next: RecentSearchItem = {
      id: generateId('recent'),
      origin: params.origin.placeName,
      destination: params.destination.placeName,
      dateLabel: params.dateLabel,
      originLocation: { ...params.origin },
      destinationLocation: { ...params.destination },
    };

    recentSearches = [
      next,
      ...recentSearches.filter((item) => !sameRoute(item, next)),
    ].slice(0, MAX_RECENT_SEARCHES);

    notify();
  },

  clear: () => {
    recentSearches = [];
    notify();
  },
};
