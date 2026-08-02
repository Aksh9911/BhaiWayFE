export interface MyRidesRouteMapProps {
  pickup: {
    latitude: number;
    longitude: number;
  };
  dropoff: {
    latitude: number;
    longitude: number;
  };
  pickupLabel?: string;
  dropoffLabel?: string;
  onExpandPress?: () => void;
  height?: number;
}
