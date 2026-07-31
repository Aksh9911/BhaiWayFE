import type { WithdrawBankAccount, WithdrawQuickAmount } from '../types';
import {
  WALLET_BALANCE,
  WALLET_BALANCE_LABEL,
} from './wallet-shared.constants';

export const WITHDRAW_SCREEN = {
  title: 'Withdraw',
  balanceLabel: 'Available Balance',
  amountLabel: 'Enter Amount',
  amountPlaceholder: '0.00',
  selectAccountLabel: 'Select Account',
  addAccountTitle: 'Add New Bank Account',
  addAccountSubtitle: 'Securely link a new method',
  proceedLabel: 'Proceed to Withdraw',
  invalidAmountTitle: 'Invalid Amount',
  invalidAmountMessage: 'Enter an amount greater than zero to continue.',
  exceedBalanceTitle: 'Insufficient Balance',
  exceedBalanceMessage: 'Withdrawal amount cannot exceed your available balance.',
  selectAccountTitle: 'Select Account',
  selectAccountMessage: 'Choose a bank account to withdraw to.',
} as const;

export const WITHDRAW_AVAILABLE_BALANCE = WALLET_BALANCE;
export const WITHDRAW_AVAILABLE_BALANCE_LABEL = WALLET_BALANCE_LABEL;

export const WITHDRAW_QUICK_AMOUNTS: readonly WithdrawQuickAmount[] = [
  { id: '100', amount: 100, label: '+ ₹100' },
  { id: '500', amount: 500, label: '+ ₹500' },
  { id: '1000', amount: 1000, label: '+ ₹1000' },
  { id: '5000', amount: 5000, label: '+ ₹5000' },
];

export const WITHDRAW_BANK_ACCOUNTS: readonly WithdrawBankAccount[] = [
  {
    id: 'hdfc',
    bankName: 'HDFC Bank',
    accountTypeLabel: 'Savings Account',
    maskedNumber: '•••• 1234',
  },
  {
    id: 'sbi',
    bankName: 'SBI Bank',
    accountTypeLabel: 'Current Account',
    maskedNumber: '•••• 5678',
  },
];

export const DEFAULT_WITHDRAW_AMOUNT = 1000;
export const DEFAULT_WITHDRAW_BANK_ID = 'hdfc';
