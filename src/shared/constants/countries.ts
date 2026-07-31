import type { CountryOption } from '@/shared/types';

export const COUNTRIES: CountryOption[] = [
  { code: 'IN', dialCode: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AE', dialCode: '+971', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: 'SG', dialCode: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'AU', dialCode: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
];

export const DEFAULT_COUNTRY: CountryOption = COUNTRIES[0];
