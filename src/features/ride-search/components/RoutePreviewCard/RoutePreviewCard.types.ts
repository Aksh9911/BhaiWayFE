import type { RouteInfo, SelectedLocation } from '../../types';

export interface RoutePreviewCardProps {
  origin: SelectedLocation;
  destination: SelectedLocation;
  routeInfo: RouteInfo;
}
