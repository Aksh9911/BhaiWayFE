import type { MapCoordinate } from '@/features/ride-search/types';

export interface CommuteReviewMapPreviewProps {
  pickup: MapCoordinate;
  dropoff: MapCoordinate;
  routeCoordinates: MapCoordinate[];
  distanceLabel: string;
  durationLabel: string;
  distanceCaption: string;
  loading?: boolean;
}
