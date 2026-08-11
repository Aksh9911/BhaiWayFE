export const UPI_LINKED_SUCCESS_SCREEN = {
  headerTitle: 'Linked Successfully',
  title: 'UPI ID Linked Successfully',
  subtitle:
    'Your UPI ID has been verified and saved. You can now use it for instant top-ups and payments.',
  linkedLabel: 'Linked UPI ID',
  verifiedBadge: 'VERIFIED',
  continueWalletLabel: 'Continue to Wallet',
  backPaymentLabel: 'Back to Payment Methods',
  defaultUpiId: 'user@okaxis',
} as const;

export const getUpiLinkedSuccessPath = (params: { upiId?: string }) => ({
  pathname: '/upi-linked' as const,
  params: {
    upiId: params.upiId ?? '',
  },
});
