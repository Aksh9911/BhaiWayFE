import type { AddMoneyPaymentSource, AddMoneyQuickAmount } from '../types';

export const ADD_MONEY_SCREEN = {
  brandTitle: 'BhaiWay',
  amountLabel: 'Enter BhaiWay Coins',
  amountPlaceholder: '0.00',
  paymentSourceLabel: 'Select Payment Source',
  linkUpiTitle: 'Link UPI ID',
  linkUpiSubtitle: 'Instant setup with Google Pay/PhonePe',
  linkBankTitle: 'Link Bank Account',
  linkBankSubtitle: 'Secure verification via NetBanking',
  submitLabel: 'Add Funds',
  secureNote: '100% Secure PCI-DSS Compliant Payments',
  invalidAmountTitle: 'Invalid Amount',
  invalidAmountMessage: 'Enter an amount greater than zero to continue.',
  selectSourceTitle: 'Select Payment Source',
  selectSourceMessage: 'Choose a payment source to add funds from.',
} as const;

export const ADD_MONEY_QUICK_AMOUNTS: readonly AddMoneyQuickAmount[] = [
  { id: '500', amount: 500, label: '+ 500' },
  { id: '1000', amount: 1000, label: '+ 1,000' },
  { id: '2000', amount: 2000, label: '+ 2,000' },
];

export const ADD_MONEY_PAYMENT_SOURCES: readonly AddMoneyPaymentSource[] = [
  {
    id: 'hdfc',
    type: 'bank',
    title: 'HDFC Bank •••• 4291',
    subtitle: 'Savings Account',
    icon: 'business',
  },
  {
    id: 'upi-okaxis',
    type: 'upi',
    title: 'user@okaxis',
    subtitle: 'Linked UPI ID',
    icon: 'card',
  },
];

export const DEFAULT_ADD_MONEY_AMOUNT = '';
export const DEFAULT_ADD_MONEY_SOURCE_ID = 'hdfc';
