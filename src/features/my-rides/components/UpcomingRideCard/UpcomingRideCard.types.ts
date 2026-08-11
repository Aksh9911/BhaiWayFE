import type { MyRidesRideRole, UpcomingRideSummary } from '../../types';

export interface UpcomingRideCardProps {
  ride: UpcomingRideSummary;
  role: MyRidesRideRole;
  peerLabel: string;
  cancelLabel: string;
  trackLabel: string;
  modifyLabel: string;
  onCancel: () => void;
  onTrack: () => void;
  onModify: () => void;
  onOpenDetails: () => void;
}
