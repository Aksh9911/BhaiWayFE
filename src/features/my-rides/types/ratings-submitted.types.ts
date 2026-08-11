export interface RatingsSubmittedItem {
  id: string;
  name: string;
  avatarUri: string;
  rating: number;
}

export interface RatingsSubmittedSummary {
  rideId: string;
  ratedCount: number;
  items: readonly RatingsSubmittedItem[];
}
