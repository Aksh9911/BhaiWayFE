import type {
  WalletSummary,
  WalletTransaction,
  WalletTransactionFilter,
} from '../types';
import {
  WALLET_BALANCE_LABEL,
  WALLET_ID,
} from './wallet-shared.constants';

export const WALLET_SCREEN = {
  brandTitle: 'BhaiWay',
  balanceLabel: 'Available Balance',
  walletName: 'BhaiWay Coins Wallet',
  walletIdLabel: 'Wallet ID',
  withdrawLabel: 'Withdraw',
  addMoneyLabel: 'Add Money',
  transactionsTitle: 'Recent Transactions',
  viewAllLabel: 'View All',
  promoEyebrow: 'Limited Offer',
  promoTitle: 'Earn 10% Cashback on 5 rides!',
  comingSoonTitle: 'Coming Soon',
  comingSoonMessage: 'This feature will be available soon.',
} as const;

export const WALLET_FILTERS: readonly {
  id: WalletTransactionFilter;
  label: string;
}[] = [
  { id: 'all', label: 'All' },
  { id: 'credit', label: 'Credit' },
  { id: 'debit', label: 'Debit' },
];

export const DEFAULT_WALLET_SUMMARY: WalletSummary = {
  balanceLabel: WALLET_BALANCE_LABEL,
  walletId: WALLET_ID,
  walletName: 'BhaiWay Coins Wallet',
};

export const WALLET_TRANSACTIONS: readonly WalletTransaction[] = [
  {
    id: 'tx-1',
    title: 'Ride Fare',
    dateLabel: 'Oct 24, 2023 • 09:15 AM',
    amountLabel: '- 120',
    type: 'debit',
    icon: 'car',
  },
  {
    id: 'tx-2',
    title: 'Added to Wallet',
    dateLabel: 'Oct 22, 2023 • 04:30 PM',
    amountLabel: '+ 500',
    type: 'credit',
    icon: 'card',
  },
  {
    id: 'tx-3',
    title: 'Withdrawal',
    dateLabel: 'Oct 20, 2023 • 11:20 AM',
    amountLabel: '- 2,000',
    type: 'debit',
    icon: 'business',
  },
  {
    id: 'tx-4',
    title: 'Referral Bonus',
    dateLabel: 'Oct 18, 2023 • 02:00 PM',
    amountLabel: '+ 50',
    type: 'credit',
    icon: 'star',
  },
  {
    id: 'tx-5',
    title: 'Office Commute',
    dateLabel: 'Oct 16, 2023 • 08:40 AM',
    amountLabel: '- 85',
    type: 'debit',
    icon: 'car',
  },
  {
    id: 'tx-6',
    title: 'Cashback Reward',
    dateLabel: 'Oct 15, 2023 • 06:10 PM',
    amountLabel: '+ 30',
    type: 'credit',
    icon: 'star',
  },
  {
    id: 'tx-7',
    title: 'Outstation Ride',
    dateLabel: 'Oct 12, 2023 • 07:25 AM',
    amountLabel: '- 650',
    type: 'debit',
    icon: 'car',
  },
  {
    id: 'tx-8',
    title: 'Added to Wallet',
    dateLabel: 'Oct 10, 2023 • 01:15 PM',
    amountLabel: '+ 1,000',
    type: 'credit',
    icon: 'card',
  },
];
