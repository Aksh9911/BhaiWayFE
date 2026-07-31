export type RatingValue = 0 | 1 | 2 | 3 | 4 | 5;

export interface TripReviewTag {
  id: string;
  label: string;
}

export interface TripReviewData {
  rideId: string;
  driverName: string;
  driverAvatarUri?: string;
}
