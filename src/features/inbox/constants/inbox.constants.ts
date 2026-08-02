import { ROUTES } from '@/config';

import type { InboxRideType, InboxThread } from '../types';

export const INBOX_SCREEN = {
  title: 'Inbox',
  subtitleRiding: 'Chats with your drivers',
  subtitleDriving: 'Chats with your riders',
  emptyTitle: 'No conversations yet',
  emptyRiding:
    'Book an Outstation Carpool or Daily Office Commute ride to chat with your driver.',
  emptyDriving:
    'Publish a Carpool Ride and chat with riders who book seats on your trip.',
} as const;

export const INBOX_RIDE_TYPE_LABEL: Record<InboxRideType, string> = {
  outstation: 'Outstation',
  office: 'Office',
  published: 'Published',
};

export const INBOX_MOCK_THREADS: readonly InboxThread[] = [
  {
    id: 'thread-outstation-1',
    role: 'rider',
    rideType: 'outstation',
    peerName: 'Arjun Mehta',
    peerSubtitle: 'White Honda City · KA-01-AB-1234',
    routeLabel: 'Bengaluru → Mysuru',
    lastMessage: "I'm waiting near Gate No. 3.",
    timeLabel: '10:42 AM',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 'thread-office-1',
    role: 'rider',
    rideType: 'office',
    peerName: 'Sneha Reddy',
    peerSubtitle: 'Grey Creta · KA-05-CD-4821',
    routeLabel: 'Indiranagar → Manyata Tech Park',
    lastMessage: 'Leaving in 5 mins from the usual spot.',
    timeLabel: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'thread-outstation-2',
    role: 'rider',
    rideType: 'outstation',
    peerName: 'Rahul Verma',
    peerSubtitle: 'Black Innova · KA-03-EF-9910',
    routeLabel: 'Bengaluru → Chennai',
    lastMessage: 'Sure, see you at 6 AM sharp.',
    timeLabel: 'Mon',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 'thread-published-1',
    role: 'driver',
    rideType: 'published',
    peerName: 'Priya Sharma',
    peerSubtitle: 'Passenger · 1 seat',
    routeLabel: 'Koramangala → Electronic City',
    lastMessage: 'Is there space for a small bag?',
    timeLabel: '2:15 PM',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 'thread-published-2',
    role: 'driver',
    rideType: 'published',
    peerName: 'Vikram Singh',
    peerSubtitle: 'Passenger · 2 seats',
    routeLabel: 'Whitefield → MG Road',
    lastMessage: "Thanks! I'll be at the pickup by 8.",
    timeLabel: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 'thread-published-3',
    role: 'driver',
    rideType: 'published',
    peerName: 'Ananya Iyer',
    peerSubtitle: 'Passenger · 1 seat',
    routeLabel: 'HSR Layout → Airport',
    lastMessage: 'Can we leave 10 minutes early?',
    timeLabel: 'Sun',
    unreadCount: 3,
    isOnline: true,
  },
] as const;

export const getInboxChatPath = (thread: InboxThread) => ({
  pathname: ROUTES.rideSearchDriverChat,
  params: {
    driverName: thread.peerName,
    carModel: thread.peerSubtitle,
    threadId: thread.id,
    role: thread.role,
    rideType: thread.rideType,
  },
});
