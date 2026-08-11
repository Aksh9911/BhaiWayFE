import type { PaymentBankOption } from '../types';
import { POPULAR_BANKS } from './payment.constants';

export const SEE_ALL_BANKS_SCREEN = {
  title: 'See All Banks',
  heading: 'Choose your bank',
  subtitle: 'Select a bank to pay via Net Banking.',
  searchPlaceholder: 'Search banks',
  emptyLabel: 'No banks match your search.',
  popularLabel: 'Popular',
  allLabel: 'All banks',
} as const;

export const ALL_BANKS: readonly PaymentBankOption[] = [
  ...POPULAR_BANKS,
  { id: 'axis', label: 'Axis Bank', color: '#97144D' },
  { id: 'kotak', label: 'Kotak', color: '#ED1C24' },
  { id: 'yes', label: 'Yes Bank', color: '#00518F' },
  { id: 'pnb', label: 'PNB', color: '#9B1D20' },
  { id: 'bob', label: 'Bank of Baroda', color: '#F58220' },
  { id: 'canara', label: 'Canara Bank', color: '#00A651' },
  { id: 'union', label: 'Union Bank', color: '#E21836' },
  { id: 'idfc', label: 'IDFC First', color: '#9B1D83' },
  { id: 'indusind', label: 'IndusInd', color: '#6C1D45' },
  { id: 'federal', label: 'Federal Bank', color: '#0066B3' },
  { id: 'au', label: 'AU Small Finance', color: '#EC1C24' },
  { id: 'rbl', label: 'RBL Bank', color: '#1B4F72' },
] as const;

export const getSeeAllBanksPath = () => ({
  pathname: '/ride-search/see-all-banks' as const,
});

export const getBankPaymentMethodId = (bankId: string) => `bank-${bankId}`;
