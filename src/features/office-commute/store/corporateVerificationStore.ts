export interface CorporateVerificationRecord {
  workEmail: string;
  companyName: string;
  verifiedAt: string;
}

type Listener = (record: CorporateVerificationRecord | null) => void;

let record: CorporateVerificationRecord | null = null;
const listeners = new Set<Listener>();

const notify = (): void => {
  listeners.forEach((listener) => listener(record ? { ...record } : null));
};

export const corporateVerificationStore = {
  get: (): CorporateVerificationRecord | null => (record ? { ...record } : null),

  isVerified: (): boolean => record != null,

  set: (next: CorporateVerificationRecord): void => {
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
