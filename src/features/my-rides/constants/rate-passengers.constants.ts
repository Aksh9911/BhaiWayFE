import { ROUTES } from '@/config';

import type { RatePassengersSummary } from '../types';

export const RATE_PASSENGERS_SCREEN = {
  brandName: 'BhaiWay',
  title: 'Rate Your Passengers',
  subtitle: 'Your feedback helps maintain a safe and friendly community.',
  roleLabel: 'Co-Rider',
  submitLabel: 'Submit All Ratings',
  submitHint: 'Ratings cannot be changed after submission',
  incompleteTitle: 'Rate all passengers',
  incompleteMessage: 'Please rate each passenger before submitting.',
  successTitle: 'Ratings submitted',
  successMessage: 'Thanks for helping keep the BhaiWay community safe.',
} as const;

export const getRatePassengersMock = (params?: {
  rideId?: string;
}): RatePassengersSummary => ({
  rideId: params?.rideId || 'driver-trip-1',
  passengers: [
    {
      id: 'p-amit',
      name: 'Amit',
      roleLabel: RATE_PASSENGERS_SCREEN.roleLabel,
      avatarUri:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAKoyV4wqJum7qzx2zk60s7aEDEgXvFDCG8MlnPJFKswxx09sDn3D47AvvcBMvPFw3kSs6c7NI6T1rdBiL2Jbvt3aydSn2jhSVbsJr2T6y4OsuBvfysYdNQlTtyoxSjOVKQYg0NjQCS2cHTEx_6BFQwFQ41hmG_OdFJ1ZwrEK3qEC88cQ1Yk1lVkCU7E_TAOoN2MQ73yElaCw4aEknhprIDhmfHCqCXqSAibnd3FDr4sQ3ZM6z8jlI-UWjkI_NHf_HOnWF8iRH0iao',
    },
    {
      id: 'p-sneha',
      name: 'Sneha',
      roleLabel: RATE_PASSENGERS_SCREEN.roleLabel,
      avatarUri:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC13KqAssyXMumOlD28NLTaUSx0haowDAYJidWCnr-tPlyxV-uog30a-ZZF55kHIn2h_-gJbiT8Zd7nD1qGOc6kQwuJXcSNROuycf0NUwNoZ6CNdolxSN2q46svpG9Hss3YE340DPLxpHWUuVmp6gaTeob9Ru718_EWflQW0InMK3DqWLyEQVlPKdkk8JjmMIVL7iL1pqLy1_X0OmDc21tqUqi1Q4NB_DaxxpIe9HCS-rJVPysw-QGex4JnkxjapYtvgo7QuvgLkWk',
    },
    {
      id: 'p-rohan',
      name: 'Rohan',
      roleLabel: RATE_PASSENGERS_SCREEN.roleLabel,
      avatarUri:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB3XXHWbwCpdR4B4mUWXqf2oWY0muo9xRU3o2r-H2pAq1VWDQSApwtmIsUn_8kd0ZU76TotcU_y5V9Mj37sQYqUpwcoC5wl6oYaexEBXKij0SEtQaO2fJ9ghluiJHzqQRYyPIzCMwAwiQUs77pft3YntJlsi1VdoHYs9oDZT9ny-XUtvkDvQaNBUBVhiyVLBw-pt0LHTfaXZyZvjln8PMWqdaDF9E5T4SibxYjgA36WvY8flP_MxUpv5jAhESwMsDWx3fpD5LQ6DQM',
    },
    {
      id: 'p-priya',
      name: 'Priya',
      roleLabel: RATE_PASSENGERS_SCREEN.roleLabel,
      avatarUri:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDL8BiZzvLN6mORnuVBOfmtBjg9DOEviZiB6Hc--H1OXiSpOHS1OB3UXlVLZkDOtUroj9LIF8X13sjK2ZU1whhuLDMCSCmL4ZsXH-ErVQZBdffFxqR7btFnqsxKP2yznMx3OYf149bZTTP9TR5IHBNKzF6-5M8aFqrDt79iBpgjGHxx4uH8EfcDJfaoF9i6AVB78VUxltXpACdImT2-pPF9JU87-JYzR2iBtEsEtR2Zkqe31jNp8If_Xh23LPBfOz0ORNLk4PLwESQ',
    },
  ],
});

export const getRatePassengersPath = (params?: { rideId?: string }) => ({
  pathname: ROUTES.myRidesRatePassengers,
  params: {
    rideId: params?.rideId ?? '',
  },
});
