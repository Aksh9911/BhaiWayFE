export const sanitizePhoneNumber = (value: string, maxLength = 10): string =>
  value.replace(/\D/g, '').slice(0, maxLength);

export const formatPhoneNumber = (digits: string): string => {
  const part1 = digits.slice(0, 3);
  const part2 = digits.slice(3, 6);
  const part3 = digits.slice(6, 10);
  return [part1, part2, part3].filter(Boolean).join(' ');
};

export const maskPhoneNumber = (digits: string, dialCode = ''): string => {
  const prefix = dialCode ? `${dialCode} ` : '';
  return `${prefix}${formatPhoneNumber(digits)}`.trim();
};
