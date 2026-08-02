export type InboxRideType = 'outstation' | 'office' | 'published';

export interface InboxThread {
  id: string;
  role: 'rider' | 'driver';
  rideType: InboxRideType;
  peerName: string;
  peerSubtitle: string;
  routeLabel: string;
  lastMessage: string;
  timeLabel: string;
  unreadCount: number;
  isOnline: boolean;
  avatarUri?: string;
}
