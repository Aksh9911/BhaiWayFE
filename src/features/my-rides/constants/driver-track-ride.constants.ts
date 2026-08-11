import { ROUTES } from '@/config';

import type {
  DriverTrackConfirmedPassenger,
  DriverTrackPendingRequest,
  DriverTrackRideSummary,
} from '../types/driver-track-ride.types';

export const DRIVER_TRACK_RIDE_SCREEN = {
  title: 'Track My Ride',
  activeLabel: 'Active Ride',
  confirmedTitle: (confirmed: number, total: number) => `Confirmed (${confirmed}/${total})`,
  pendingTitle: (count: number) => `Pending Requests (${count})`,
  fullPercentLabel: (percent: number) => `${percent}% Full`,
  declineLabel: 'Decline',
  acceptLabel: 'Accept',
  ridesLabel: (count: number) => `${count} RIDES`,
  seatsAppliedLabel: (count: number) =>
    count === 1 ? 'Applied for 1 seat' : `Applied for ${count} seats`,
  seatsBookedShort: (count: number) => (count === 1 ? '+1 seat' : `+${count} seats`),
  idVerifiedLabel: 'ID VERIFIED',
  callAlertTitle: 'Call',
  chatAlertTitle: 'Chat',
  callAlertMessage: (name: string) => `Calling ${name} will be available soon.`,
  chatAlertMessage: (name: string) => `Chat with ${name} will be available soon.`,
  acceptedMessage: (name: string) => `${name} has been accepted.`,
  declinedMessage: (name: string) => `${name}'s request was declined.`,
} as const;

const AVATAR_ROHAN =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDcBd96RX-cSWPbpdQQv04InPo08bZTl6w1iowdZNQKsWDKE-evS0t8cAc1JXZ7u589scy17jic6iNU9wk1oDJZTQ_swPp33AVaBOAZL17bN_nnGAvY91Bny1bpAZXR2vbd8xijkIl1e5-T6oPuhjAHYGYHFF9FJSaiYdxJOCVfA1eft-RztwNpgD2zgR3M5g2GXyJJsRfiEZdYCjcfbDKktvkmYJfLozhEWBYh0vnDLwRPaXjre8VnmZuMOGO7nQYInteepgv94ug';
const AVATAR_PRIYA =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAcfH1AW7_5KiRSs2kB9NI0lM4imphLulD-3KnJ-rqK3xhRB-nSTZ1LU9FeupCcBvhbt-yTRDPuT4n9BGjz85egTp8JTK_9EE5VFOkkzfDm4C-etdKwn9fhyi_OpSCmSSP4vrEeH6ooJmvbi8BM3GNmevpNwfEu1po396LIyZBmScW0Tvfne2pOekEvnec51iwNgSWRQke-eptgu1uCQZeSQtnA_vG2oRqIRFHILgd4quNhUWbbx5krfXPdUlW2Ng3uKEPJZASAgoE';

export const DEFAULT_CONFIRMED_PASSENGERS: readonly DriverTrackConfirmedPassenger[] = [];

export const DEFAULT_PENDING_REQUESTS: readonly DriverTrackPendingRequest[] = [
  {
    id: 'pending-rohan',
    name: 'Rohan M.',
    subtitle: 'Senior Engineer @ Google',
    rating: 4.7,
    ridesCount: 142,
    idVerified: true,
    avatarUri: AVATAR_ROHAN,
    seatsBooked: 2,
  },
  {
    id: 'pending-priya',
    name: 'Priya S.',
    subtitle: 'Verified @ Microsoft',
    rating: 4.9,
    ridesCount: 89,
    idVerified: true,
    avatarUri: AVATAR_PRIYA,
    seatsBooked: 1,
  },
];

export const DEFAULT_DRIVER_TRACK_RIDE: DriverTrackRideSummary = {
  rideId: 'driving-upcoming-regular-1',
  listingId: 'BW-9942',
  routeTitle: 'Saket → Cyber City',
  dateLabel: 'Oct 25, 09:00 AM',
  seatsConfirmed: 0,
  seatsTotal: 4,
  confirmed: DEFAULT_CONFIRMED_PASSENGERS,
  pending: DEFAULT_PENDING_REQUESTS,
};

export const getDriverTrackRidePath = (rideId: string) => ({
  pathname: ROUTES.myRidesTrack,
  params: { rideId },
});
