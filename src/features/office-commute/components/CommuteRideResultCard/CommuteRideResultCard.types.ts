import type { CommuteRideResultItem } from '../../types/commute-ride-result.types';

export type CommuteRequestState = 'idle' | 'requesting' | 'requested';

export interface CommuteRideResultCardProps {
  ride: CommuteRideResultItem;
  requestState?: CommuteRequestState;
  onPress: (ride: CommuteRideResultItem) => void;
  onRequestPress: (ride: CommuteRideResultItem) => void;
}
