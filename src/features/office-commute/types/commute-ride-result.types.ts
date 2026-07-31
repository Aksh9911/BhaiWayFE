import type { RideResultItem } from '@/features/ride-search/types';

export interface CommuteRideResultItem extends RideResultItem {
  vehicleColor: string;
  seatsNote: string;
}

export interface CommuteSearchSummary {
  origin: string;
  destination: string;
  dateLabel: string;
  timeLabel: string;
}
