import { ROUTES } from '@/config';

import type { RatingsSubmittedItem, RatingsSubmittedSummary } from '../types';

export const RATINGS_SUBMITTED_SCREEN = {
  headerTitle: 'Submission Status',
  titleLine1: 'Ratings',
  titleLine2: 'Submitted!',
  subtitle:
    'Thank you for rating your passengers. Your feedback helps maintain our high-trust community and professional standards.',
  summaryLabel: 'Summary',
  ratedCountLabel: (count: number) =>
    `${count} Passenger${count === 1 ? '' : 's'} Rated`,
  verifiedLabel: 'Verified',
  dashboardLabel: 'Back to Dashboard',
  supportPrompt: 'Need to change something?',
  supportLinkLabel: 'Contact Support',
  supportTitle: 'Contact Support',
  supportMessage: 'Support chat will be available soon.',
} as const;

const DEFAULT_ITEMS: readonly RatingsSubmittedItem[] = [
  {
    id: 'p-amit',
    name: 'Amit',
    avatarUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKoyV4wqJum7qzx2zk60s7aEDEgXvFDCG8MlnPJFKswxx09sDn3D47AvvcBMvPFw3kSs6c7NI6T1rdBiL2Jbvt3aydSn2jhSVbsJr2T6y4OsuBvfysYdNQlTtyoxSjOVKQYg0NjQCS2cHTEx_6BFQwFQ41hmG_OdFJ1ZwrEK3qEC88cQ1Yk1lVkCU7E_TAOoN2MQ73yElaCw4aEknhprIDhmfHCqCXqSAibnd3FDr4sQ3ZM6z8jlI-UWjkI_NHf_HOnWF8iRH0iao',
    rating: 5,
  },
  {
    id: 'p-priya',
    name: 'Priya',
    avatarUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDL8BiZzvLN6mORnuVBOfmtBjg9DOEviZiB6Hc--H1OXiSpOHS1OB3UXlVLZkDOtUroj9LIF8X13sjK2ZU1whhuLDMCSCmL4ZsXH-ErVQZBdffFxqR7btFnqsxKP2yznMx3OYf149bZTTP9TR5IHBNKzF6-5M8aFqrDt79iBpgjGHxx4uH8EfcDJfaoF9i6AVB78VUxltXpACdImT2-pPF9JU87-JYzR2iBtEsEtR2Zkqe31jNp8If_Xh23LPBfOz0ORNLk4PLwESQ',
    rating: 4,
  },
];

export const getRatingsSubmittedMock = (params?: {
  rideId?: string;
  items?: readonly RatingsSubmittedItem[];
}): RatingsSubmittedSummary => {
  const items = params?.items?.length ? params.items : DEFAULT_ITEMS;
  return {
    rideId: params?.rideId || 'driver-trip-1',
    ratedCount: items.length,
    items,
  };
};

export const getRatingsSubmittedPath = (params: {
  rideId: string;
  items: readonly RatingsSubmittedItem[];
}) => ({
  pathname: ROUTES.myRidesRatingsSubmitted,
  params: {
    rideId: params.rideId,
    items: JSON.stringify(params.items),
  },
});
