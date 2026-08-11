export type PassengerRatingValue = 0 | 1 | 2 | 3 | 4 | 5;

export interface RatePassengerItem {
  id: string;
  name: string;
  roleLabel: string;
  avatarUri: string;
}

export interface RatePassengersSummary {
  rideId: string;
  passengers: readonly RatePassengerItem[];
}
