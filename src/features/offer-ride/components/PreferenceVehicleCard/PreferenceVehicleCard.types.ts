import type { PublishRideVehicleOption } from '../../types';

export interface PreferenceVehicleCardProps {
  vehicle: PublishRideVehicleOption;
  selected: boolean;
  onSelect: () => void;
}
