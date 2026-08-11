import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Tiny AsyncStorage-backed list store for user-entered DemoData.
 * Data is kept in memory after hydrate and mirrored to device storage.
 */

type Listener<T> = (items: T[]) => void;

export interface LocalListStore<T extends { [K in IdKey]: number }, IdKey extends string> {
  hydrate: () => Promise<T[]>;
  getAll: () => T[];
  getById: (id: number) => T | undefined;
  subscribe: (listener: Listener<T>) => () => void;
  save: (item: T) => Promise<T>;
  saveMany: (items: T[]) => Promise<T[]>;
  removeById: (id: number) => Promise<void>;
  clear: () => Promise<void>;
  nextId: () => number;
}

export const createLocalListStore = <T extends { [K in IdKey]: number }, IdKey extends string>(
  storageKey: string,
  idKey: IdKey,
): LocalListStore<T, IdKey> => {
  let items: T[] = [];
  let hydrated = false;
  let hydratePromise: Promise<T[]> | null = null;
  const listeners = new Set<Listener<T>>();

  const notify = () => {
    const snapshot = [...items];
    listeners.forEach((listener) => listener(snapshot));
  };

  const persist = async () => {
    await AsyncStorage.setItem(storageKey, JSON.stringify(items));
  };

  const hydrate = async (): Promise<T[]> => {
    if (hydrated) {
      return [...items];
    }
    if (hydratePromise) {
      return hydratePromise;
    }

    hydratePromise = (async () => {
      try {
        const raw = await AsyncStorage.getItem(storageKey);
        if (raw) {
          const parsed = JSON.parse(raw) as T[];
          items = Array.isArray(parsed) ? parsed : [];
        } else {
          items = [];
        }
      } catch {
        items = [];
      }
      hydrated = true;
      hydratePromise = null;
      notify();
      return [...items];
    })();

    return hydratePromise;
  };

  return {
    hydrate,

    getAll: () => [...items],

    getById: (id) => items.find((item) => item[idKey] === id),

    subscribe: (listener) => {
      listeners.add(listener);
      listener([...items]);
      return () => {
        listeners.delete(listener);
      };
    },

    save: async (item) => {
      await hydrate();
      const id = item[idKey];
      const index = items.findIndex((entry) => entry[idKey] === id);
      if (index >= 0) {
        items = [...items.slice(0, index), item, ...items.slice(index + 1)];
      } else {
        items = [...items, item];
      }
      await persist();
      notify();
      return item;
    },

    saveMany: async (nextItems) => {
      await hydrate();
      items = [...nextItems];
      await persist();
      notify();
      return [...items];
    },

    removeById: async (id) => {
      await hydrate();
      items = items.filter((item) => item[idKey] !== id);
      await persist();
      notify();
    },

    clear: async () => {
      items = [];
      hydrated = true;
      await AsyncStorage.removeItem(storageKey);
      notify();
    },

    nextId: () => {
      if (items.length === 0) {
        return 1;
      }
      return Math.max(...items.map((item) => item[idKey])) + 1;
    },
  };
};
