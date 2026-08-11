export const LINK_UPI_SCREEN = {
  title: 'Link UPI ID',
  settingsTitle: 'UPI Settings',
  settingsSubtitle: 'Enter your UPI ID (e.g., username@bank) to link it for faster top-ups.',
  upiLabel: 'VPA / UPI ID',
  upiPlaceholder: 'e.g. rahul@oksbi',
  verifyLabel: 'Verify',
  verifiedPrefix: 'UPI ID Verified:',
  verifiedFallbackName: 'Linked account',
  securityNote:
    'BhaiWay uses bank-grade 256-bit encryption. Your UPI details are stored securely and never shared with third parties.',
  saveLabel: 'Link & Save UPI ID',
  secureFooter: 'Secure Transaction',
  invalidTitle: 'Invalid UPI ID',
  invalidMessage: 'Enter a valid UPI ID like name@upi or number@ybl.',
  verifyFirstTitle: 'Verify UPI ID',
  verifyFirstMessage: 'Please verify your UPI ID before linking and saving.',
} as const;

export { UPI_ID_PATTERN as LINK_UPI_ID_PATTERN, isValidUpiId as isValidLinkUpiId } from '@/shared/utils/upi';

export const getLinkUpiPath = () => ({
  pathname: '/link-upi' as const,
});
