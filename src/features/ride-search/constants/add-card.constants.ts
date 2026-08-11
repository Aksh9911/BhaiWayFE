import type { SavedCardBrand } from '../store/savedCardStore';

export const ADD_CARD_SCREEN = {
  title: 'Add New Card',
  heading: 'Save a debit or credit card',
  subtitle: 'Card details are stored for quicker checkout under Saved Cards.',
  numberLabel: 'Card number',
  numberPlaceholder: 'XXXX XXXX XXXX XXXX',
  nameLabel: 'Name on card',
  namePlaceholder: 'As printed on card',
  expiryLabel: 'Expiry (MM/YY)',
  expiryPlaceholder: 'MM/YY',
  cvvLabel: 'CVV',
  cvvPlaceholder: '•••',
  saveLabel: 'Save Card',
  savingLabel: 'Saving...',
  invalidTitle: 'Invalid card details',
  invalidNumberMessage: 'Enter a valid 13–19 digit card number.',
  invalidNameMessage: 'Enter the name printed on the card.',
  invalidExpiryMessage: 'Enter a valid expiry in MM/YY format.',
  invalidCvvMessage: 'Enter a valid 3 or 4 digit CVV.',
  secureLabel: 'PCI-DSS SECURE PAYMENT',
} as const;

export const getAddCardPath = () => ({
  pathname: '/ride-search/add-card' as const,
});

export const detectCardBrand = (digits: string): SavedCardBrand => {
  if (/^4/.test(digits)) {
    return 'visa';
  }
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) {
    return 'mastercard';
  }
  if (/^3[47]/.test(digits)) {
    return 'amex';
  }
  if (/^6/.test(digits)) {
    return 'rupay';
  }
  return 'card';
};

export const cardBrandLabel = (brand: SavedCardBrand): string => {
  switch (brand) {
    case 'visa':
      return 'VISA';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'Amex';
    case 'rupay':
      return 'RuPay';
    default:
      return 'Card';
  }
};

export const digitsOnly = (value: string) => value.replace(/\D/g, '');

export const formatCardNumber = (value: string): string => {
  const digits = digitsOnly(value).slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

export const formatExpiry = (value: string): string => {
  const digits = digitsOnly(value).slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const isValidCardNumber = (value: string): boolean => {
  const digits = digitsOnly(value);
  return digits.length >= 13 && digits.length <= 19;
};

export const isValidExpiry = (value: string): boolean => {
  const match = /^(\d{2})\/(\d{2})$/.exec(value.trim());
  if (!match) {
    return false;
  }
  const month = Number(match[1]);
  const year = Number(match[2]);
  if (month < 1 || month > 12) {
    return false;
  }
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  if (year < currentYear) {
    return false;
  }
  if (year === currentYear && month < currentMonth) {
    return false;
  }
  return true;
};

export const isValidCvv = (value: string, brand: SavedCardBrand): boolean => {
  const digits = digitsOnly(value);
  return brand === 'amex' ? digits.length === 4 : digits.length === 3;
};
