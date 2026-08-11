export interface SavedUpiId {
  id: string;
  upiId: string;
  label: string;
}

const MAX_SAVED_UPIS = 8;

let savedUpis: SavedUpiId[] = [];
/** Stable snapshot for useSyncExternalStore — same reference until data changes. */
let snapshot: SavedUpiId[] = savedUpis;
let lastAddedId: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  snapshot = savedUpis;
  listeners.forEach((listener) => listener());
};

const normalizeUpiId = (value: string) => value.trim().toLowerCase();

export const savedUpiStore = {
  get: (): SavedUpiId[] => snapshot,

  getLastAddedId: (): string | null => lastAddedId,

  clearLastAddedId: () => {
    lastAddedId = null;
  },

  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  add: (upiId: string, label?: string): SavedUpiId | null => {
    const normalized = normalizeUpiId(upiId);
    if (!normalized) {
      return null;
    }

    const existing = savedUpis.find((item) => item.upiId === normalized);
    if (existing) {
      lastAddedId = existing.id;
      notify();
      return existing;
    }

    const next: SavedUpiId = {
      id: `custom-upi-${Date.now()}`,
      upiId: normalized,
      label: label?.trim() || normalized,
    };

    savedUpis = [next, ...savedUpis].slice(0, MAX_SAVED_UPIS);
    lastAddedId = next.id;
    notify();
    return next;
  },
};
