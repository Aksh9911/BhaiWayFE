export interface DestinationMapProps {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  /** Optional place perimeter used to frame the map camera (not drawn). */
  boundary?: Array<{ latitude: number; longitude: number }>;
  /** Extra bottom padding so map controls clear an overlay panel. */
  controlsBottomInset?: number;
  onRegionChangeComplete: (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => void;
  /** Fired when the user drags/pinches the map (not programmatic camera moves). */
  onUserGesture?: () => void;
  onLocatePress: () => void;
}
