export type SavedCardBrand = 'visa' | 'mastercard' | 'amex' | 'rupay' | 'card';

export interface SavedCard {
  id: string;
  brand: SavedCardBrand;
  brandLabel: string;
  last4: string;
  holderName: string;
  expiryLabel: string;
  label: string;
  subtitle: string;
}

const MAX_SAVED_CARDS = 8;

let savedCards: SavedCard[] = [];
/** Stable snapshot for useSyncExternalStore — same reference until data changes. */
let snapshot: SavedCard[] = savedCards;
let lastAddedId: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  snapshot = savedCards;
  listeners.forEach((listener) => listener());
};

export const savedCardStore = {
  get: (): SavedCard[] => snapshot,

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

  add: (card: Omit<SavedCard, 'id'>): SavedCard => {
    const existing = savedCards.find(
      (item) => item.last4 === card.last4 && item.brand === card.brand,
    );
    if (existing) {
      lastAddedId = existing.id;
      notify();
      return existing;
    }

    const next: SavedCard = {
      ...card,
      id: `custom-card-${Date.now()}`,
    };
    savedCards = [next, ...savedCards].slice(0, MAX_SAVED_CARDS);
    lastAddedId = next.id;
    notify();
    return next;
  },
};
