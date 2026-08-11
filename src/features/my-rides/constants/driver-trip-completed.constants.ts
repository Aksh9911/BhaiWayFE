import { ROUTES } from '@/config';
import { formatBhaiWayCoins } from '@/shared/utils';

import type { DriverRideKind, DriverTripCompletedSummary } from '../types';
import {
  buildDriverCompletedFareLines,
  defaultRideIdForKind,
  getDriverCompletedEarningsLabels,
  parseDriverRideKind,
  withRideTypeParam,
} from '../utils';

export const DRIVER_TRIP_COMPLETED_SCREEN = {
  brandName: 'BhaiWay',
  heading: 'Trip Completed!',
  subtitle: "You've successfully finished your last journey.",
  totalEarningsLabel: 'Total Earnings',
  statusLabel: 'SUCCESSFUL',
  communityMessage:
    'Thank you for driving with the community! Your service helps keep the city moving efficiently.',
  ratePassengersLabel: 'Rate Your Passengers',
  viewTripDetailsLabel: 'View Trip Details',
  ratePassengersTitle: 'Rate passengers',
  ratePassengersMessage: 'Passenger ratings will be available soon.',
  mapImageUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBW9chvqfdpj0VFTftm-_zYHuQ59DPjRUGvtc4fkJGK_Bf4vXLYRIpVVMWW-RwuYhKMmBmj25iIxbSvAhhbjT3QLJULdlM0fqPTFC0BgtSIG4je3TRLJDEtUYox0p1aNJasnnB5LnCsPC6HnB9A8AG1WYIQ0oESJU9A_EYM9caPnGo_WSrL7Ij0QoLSWcpfu-reN26OrGoLaG7Amwtq5nMFBJO8dFqE1zToCLS_W4QLHHHzljth-Il-ApXtdXJU5FN4ObXEOqtJIN0',
} as const;

const PASSENGERS: DriverTripCompletedSummary['passengers'] = [
  {
    id: 'p1',
    name: 'Priya',
    avatarUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCaYzKdgLZtG_IFlmglf83KiepEEvaY5ytGqjpPZA6_zIY4GvetugKl08qdRaEF7JRRULcJRswmg293DUWtjtADXeyysa5AFdC-9EbwktNMrg5HMzzHhOUKgcJzkNp4pWLzK2sa9MArjLOIhUBGG2PVJPK1OXcJf5VWBxQ_Wr6wbUIqX4U7smUP3RpoJKharq-r_doEihsNa1vxMOqyE6_NHiGek0P1CWbHvQppz3ACN0w1hxaEndYnrIdkR1LStrdE5D_Y8hX0mus',
    fareLabel: formatBhaiWayCoins(300, { spaced: false }),
  },
  {
    id: 'p2',
    name: 'Amit',
    avatarUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA-aumMGLgEFXYxY5sSCvsxWiilErVurEIuKD7pBo9UQoubErtG_tBhUh-e1nAR33f6LQB0rbvjN6tdJMUp7iBuBOIaUHmNkAOHJ03CnwonsCTcHfSWXo7ope1KO-XvXzn3t92_2IINh1_rITiyW30TzqBOajykuI65vYrphaLwWW20QZM7px_Ilf6kAWQjJhpEmWbOXjsiV_pt_-NlGz-1gzY1B3G9sfVzN6dHSmSOdvhm6_i8sGAS9YK51NGVvXEhKdJoL7Yoc3s',
    fareLabel: formatBhaiWayCoins(300, { spaced: false }),
  },
];

export const getDriverTripCompletedMock = (params?: {
  destination?: string;
  rideType?: DriverRideKind;
}): DriverTripCompletedSummary => {
  const dropoffTitle = params?.destination?.trim() || 'BhaiWay Corporate Office';
  const rideType = parseDriverRideKind(params?.rideType);
  const earnings = getDriverCompletedEarningsLabels(rideType);

  return {
    rideId: defaultRideIdForKind(rideType),
    rideType,
    dateLabel: 'Aug 2, 2026',
    statusLabel: DRIVER_TRIP_COMPLETED_SCREEN.statusLabel,
    pickupTitle: 'Koramangala',
    pickupAddress: 'Koramangala 5th Block, Bengaluru',
    dropoffTitle,
    dropoffAddress: `${dropoffTitle}, Bengaluru`,
    distanceLabel: '12.6 km total distance',
    earningsLabel: earnings.earningsLabel,
    earningsAmount: earnings.earningsAmount,
    rideFareLabel: earnings.rideFareLabel,
    assuredBonusLabel: earnings.assuredBonusLabel,
    hasAssuredBonus: earnings.hasAssuredBonus,
    passengers: PASSENGERS,
    fareLines: buildDriverCompletedFareLines(rideType),
    pickup: {
      latitude: 12.9352,
      longitude: 77.6245,
    },
    dropoff: {
      latitude: 12.9716,
      longitude: 77.5946,
    },
  };
};

export const getDriverTripCompletedPath = (params?: {
  destination?: string;
  rideType?: DriverRideKind;
}) => ({
  pathname: ROUTES.myRidesTripCompleted,
  params: withRideTypeParam(
    { destination: params?.destination ?? '' },
    parseDriverRideKind(params?.rideType),
  ),
});
