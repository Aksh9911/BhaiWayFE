import type { AadhaarVerificationRecord } from '../types';

type Listener = (record: AadhaarVerificationRecord | null) => void;

let record: AadhaarVerificationRecord | null = null;
const listeners = new Set<Listener>();

const notify = (): void => {
  listeners.forEach((listener) => listener(record ? { ...record } : null));
};

export const aadhaarVerificationStore = {
  get: (): AadhaarVerificationRecord | null => (record ? { ...record } : null),

  set: (next: AadhaarVerificationRecord): void => {
    record = { ...next };
    notify();
  },

  clear: (): void => {
    record = null;
    notify();
  },

  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    listener(record ? { ...record } : null);
    return () => {
      listeners.delete(listener);
    };
  },
};
