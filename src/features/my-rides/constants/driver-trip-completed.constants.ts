import { ROUTES } from '@/config';

import type { DriverTripCompletedSummary } from '../types';

export const DRIVER_TRIP_COMPLETED_SCREEN = {
  heading: 'Trip Completed!',
  subtitle: "Great work. Here's your trip overview and earnings.",
  summaryLabel: 'Trip Summary',
  statusLabel: 'COMPLETED',
  pickupLabel: 'PICKUP',
  destinationLabel: 'DESTINATION',
  ridersLabel: 'RIDERS',
  earningsLabel: 'TOTAL EARNINGS',
  earningsTitle: 'Earnings Breakdown',
  totalLabel: 'Total Earned',
  doneCta: 'Done',
  walletNote: 'Earnings will be settled to your BhaiWay wallet',
} as const;

export const getDriverTripCompletedMock = (params?: {
  destination?: string;
}): DriverTripCompletedSummary => {
  const dropoffTitle = params?.destination?.trim() || 'BhaiWay Corporate Office';

  return {
    rideId: 'driver-trip-1',
    dateLabel: 'Aug 2, 2026',
    statusLabel: DRIVER_TRIP_COMPLETED_SCREEN.statusLabel,
    pickupTitle: 'Koramangala',
    pickupAddress: 'Koramangala 5th Block, Bengaluru',
    dropoffTitle,
    dropoffAddress: `${dropoffTitle}, Bengaluru`,
    distanceLabel: '12.6 km total distance',
    earningsLabel: '₹420',
    earningsAmount: 420,
    passengers: [
      {
        id: 'p1',
        name: 'Priya',
        avatarUri:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCaYzKdgLZtG_IFlmglf83KiepEEvaY5ytGqjpPZA6_zIY4GvetugKl08qdRaEF7JRRULcJRswmg293DUWtjtADXeyysa5AFdC-9EbwktNMrg5HMzzHhOUKgcJzkNp4pWLzK2sa9MArjLOIhUBGG2PVJPK1OXcJf5VWBxQ_Wr6wbUIqX4U7smUP3RpoJKharq-r_doEihsNa1vxMOqyE6_NHiGek0P1CWbHvQppz3ACN0w1hxaEndYnrIdkR1LStrdE5D_Y8hX0mus',
        fareLabel: '₹210',
      },
      {
        id: 'p2',
        name: 'Amit',
        avatarUri:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA-aumMGLgEFXYxY5sSCvsxWiilErVurEIuKD7pBo9UQoubErtG_tBhUh-e1nAR33f6LQB0rbvjN6tdJMUp7iBuBOIaUHmNkAOHJ03CnwonsCTcHfSWXo7ope1KO-XvXzn3t92_2IINh1_rITiyW30TzqBOajykuI65vYrphaLwWW20QZM7px_Ilf6kAWQjJhpEmWbOXjsiV_pt_-NlGz-1gzY1B3G9sfVzN6dHSmSOdvhm6_i8sGAS9YK51NGVvXEhKdJoL7Yoc3s',
        fareLabel: '₹210',
      },
    ],
    fareLines: [
      { label: 'Rider fares (2)', amountLabel: '₹420' },
      { label: 'Platform fee', amountLabel: '-₹42' },
      { label: 'Incentive', amountLabel: '₹42' },
    ],
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

export const getDriverTripCompletedPath = (params?: { destination?: string }) => ({
  pathname: ROUTES.myRidesTripCompleted,
  params: {
    destination: params?.destination ?? '',
  },
});
