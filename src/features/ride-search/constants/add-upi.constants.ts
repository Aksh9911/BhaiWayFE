export const ADD_UPI_SCREEN = {
  title: 'Add New UPI ID',
  heading: 'Link a UPI ID',
  subtitle: 'Add your UPI ID to use it under UPI Payments on the Payment Options screen.',
  upiLabel: 'UPI ID',
  upiPlaceholder: 'yourname@upi',
  upiHint: 'Format: username@bankhandle (e.g. rahul@oksbi, 9876543210@ybl)',
  nameLabel: 'Display name (optional)',
  namePlaceholder: 'e.g. Personal UPI',
  saveLabel: 'Save UPI ID',
  savingLabel: 'Saving...',
  invalidTitle: 'Invalid UPI ID',
  invalidMessage: 'Enter a valid UPI ID like name@upi or number@ybl.',
  duplicateTitle: 'Already added',
  duplicateMessage: 'This UPI ID is already saved in your UPI Payments list.',
  secureLabel: 'PCI-DSS SECURE PAYMENT',
} as const;

export { UPI_ID_PATTERN, isValidUpiId } from '@/shared/utils/upi';

export const getAddUpiPath = () => ({
  pathname: '/ride-search/add-upi' as const,
});
