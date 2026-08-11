import { parseSlashDate } from '@/shared/utils';

/** Digits only, max 12. */
export const sanitizeAadhaarDigits = (value: string): string =>
  value.replace(/\D/g, '').slice(0, 12);

/** Display as `XXXX XXXX XXXX`. */
export const formatAadhaarNumber = (digits: string): string => {
  const clean = sanitizeAadhaarDigits(digits);
  const parts = [clean.slice(0, 4), clean.slice(4, 8), clean.slice(8, 12)].filter(Boolean);
  return parts.join(' ');
};

export const maskAadhaarNumber = (digits: string): string => {
  const clean = sanitizeAadhaarDigits(digits);
  if (clean.length < 4) {
    return 'XXXX XXXX XXXX';
  }
  return `XXXX XXXX ${clean.slice(-4)}`;
};

export const isValidAadhaarNumber = (digits: string): boolean => {
  const clean = sanitizeAadhaarDigits(digits);
  if (clean.length !== 12) {
    return false;
  }
  // Reject trivial / clearly fake patterns.
  if (/^(\d)\1{11}$/.test(clean)) {
    return false;
  }
  return true;
};

/** Auto-format DOB as DD/MM/YYYY while typing. */
export const formatDobInput = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) {
    return digits;
  }
  if (digits.length <= 4) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const isValidAadhaarDob = (value: string): boolean => {
  const date = parseSlashDate(value);
  if (!date) {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date.getTime() > today.getTime()) {
    return false;
  }
  const minYear = today.getFullYear() - 120;
  if (date.getFullYear() < minYear) {
    return false;
  }
  return true;
};
