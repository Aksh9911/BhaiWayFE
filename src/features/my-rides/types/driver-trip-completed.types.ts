import type { DriverRideKind } from './my-rides.types';

export interface DriverTripCompletedPassenger {
  id: string;
  name: string;
  avatarUri: string;
  fareLabel: string;
}

export interface DriverTripCompletedFareLine {
  label: string;
  amountLabel: string;
  /** Emphasize bonus / incentive lines in primary color. */
  highlight?: boolean;
}

export interface DriverTripCompletedCoordinate {
  latitude: number;
  longitude: number;
}

export interface DriverTripCompletedSummary {
  rideId: string;
  rideType: DriverRideKind;
  dateLabel: string;
  statusLabel: string;
  pickupTitle: string;
  pickupAddress: string;
  dropoffTitle: string;
  dropoffAddress: string;
  distanceLabel: string;
  earningsLabel: string;
  earningsAmount: number;
  rideFareLabel: string;
  assuredBonusLabel: string;
  hasAssuredBonus: boolean;
  passengers: readonly DriverTripCompletedPassenger[];
  fareLines: readonly DriverTripCompletedFareLine[];
  pickup: DriverTripCompletedCoordinate;
  dropoff: DriverTripCompletedCoordinate;
}
