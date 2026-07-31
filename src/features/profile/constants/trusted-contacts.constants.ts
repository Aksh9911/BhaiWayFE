import type { TrustedContact } from '../types';

export const TRUSTED_CONTACTS_SCREEN = {
  title: 'Trusted Contacts',
  subtitle:
    'Your trusted contacts will be notified in case of an emergency. Add people you trust to ensure your safety during every journey.',
  keepSafeLabel: 'Keep your circle safe',
  addContactLabel: 'Add New Contact',
  deleteTitle: 'Remove Contact',
  deleteMessage: (name: string) => `Remove ${name} from your trusted contacts?`,
  deleteConfirm: 'Remove',
  deleteCancel: 'Cancel',
} as const;

/** Single source of truth for Safety Hub preview + Trusted Contacts manage screen. */
export const TRUSTED_CONTACTS: readonly TrustedContact[] = [
  {
    id: 'aavya',
    name: 'Aavya Sharma',
    relation: 'Sister',
    phoneLabel: '+91 98765 43210',
    avatarUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2wb4KEaHqoWpbw2yHl5jQ0caBRoGnzeGSSJoO53ygnjVCxOkBewSzWkyYgXprdA6VeIZjqBTD6LBNiPjbn39gPIEFPHJZWcrnx8hoRv-m9wtPLH_lMzlywfvgAYaHZX1mCtxkwhEmoV6OF6NibPQAix6C_fsPeMfqLrjFySYBOqkZC5ZVAxQ1DCx7NF8XLhL2WpbEs4VW__2hfGByfG3vVVtm1uzjydKBcficJs508NCifuOK8mSdvgpqpP63VDRvQIvFKXW4-l0',
  },
  {
    id: 'rajesh',
    name: 'Rajesh Kumar',
    relation: 'Father',
    phoneLabel: '+91 91234 56789',
    initials: 'RK',
  },
];
