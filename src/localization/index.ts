import en from './en.json';
import hi from './hi.json';

export type AppLocale = 'en' | 'hi';

export const translations: Record<AppLocale, typeof en> = {
  en,
  hi,
};

export const DEFAULT_LOCALE: AppLocale = 'en';
