import type { RideResultItem } from '../../types';

export interface RideResultCardProps {
  ride: RideResultItem;
  onPress: (ride: RideResultItem) => void;
  onBookPress: (ride: RideResultItem) => void;
}
