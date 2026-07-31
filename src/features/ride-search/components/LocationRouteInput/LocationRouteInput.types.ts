export interface LocationRouteInputProps {
  origin: string;
  destination: string;
  originPlaceholder?: string;
  destinationPlaceholder: string;
  originLabel?: string;
  destinationLabel?: string;
  onOriginPress: () => void;
  onDestinationPress: () => void;
  onOriginClear?: () => void;
  onDestinationClear?: () => void;
  onSwapPress?: () => void;
}
