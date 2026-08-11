let lastSelectedBankId: string | null = null;
const listeners = new Set<() => void>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

export const selectedBankStore = {
  getLastSelectedId: (): string | null => lastSelectedBankId,

  clearLastSelectedId: () => {
    lastSelectedBankId = null;
  },

  subscribe: (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  select: (bankId: string) => {
    lastSelectedBankId = `bank-${bankId}`;
    notify();
  },
};
