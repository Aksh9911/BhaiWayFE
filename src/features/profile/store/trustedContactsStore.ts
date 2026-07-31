import { TRUSTED_CONTACTS } from '../constants/trusted-contacts.constants';
import type { TrustedContact } from '../types';

type ContactsListener = (contacts: TrustedContact[]) => void;

let contacts: TrustedContact[] = TRUSTED_CONTACTS.map((contact) => ({ ...contact }));
const listeners = new Set<ContactsListener>();

const notify = (): void => {
  listeners.forEach((listener) => listener(contacts.map((contact) => ({ ...contact }))));
};

const buildInitials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const trustedContactsStore = {
  get: (): TrustedContact[] => contacts.map((contact) => ({ ...contact })),

  subscribe: (listener: ContactsListener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  upsert: (contact: TrustedContact): void => {
    const next = {
      ...contact,
      initials: contact.initials || buildInitials(contact.name),
    };
    const index = contacts.findIndex((item) => item.id === next.id);
    if (index >= 0) {
      contacts = contacts.map((item, i) => (i === index ? next : item));
    } else {
      contacts = [...contacts, next];
    }
    notify();
  },

  remove: (id: string): void => {
    contacts = contacts.filter((item) => item.id !== id);
    notify();
  },

  getById: (id: string): TrustedContact | undefined =>
    contacts.find((item) => item.id === id),
};
