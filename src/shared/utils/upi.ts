/** Basic VPA / UPI ID pattern: local-part @ handle */
export const UPI_ID_PATTERN = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-]{1,63}$/;

export const isValidUpiId = (value: string): boolean => UPI_ID_PATTERN.test(value.trim());
