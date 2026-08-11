import { ROUTES } from '@/config';

export const RIDER_REQUEST_ACCEPTED_SCREEN = {
  brandName: 'BhaiWay',
  title: 'Rider Request Accepted',
  subtitle: (name: string) => `${name} has been added to your upcoming trip.`,
  infoNote:
    'A notification has been sent to the rider. You can now chat with them under My Rides.',
  dashboardLabel: 'Back to Dashboard',
  messageLabel: (name: string) => `Message ${name.split(' ')[0] ?? name}`,
  ratingLabel: (rating: number, rides: number) => `${rating.toFixed(1)}`,
  ridesCountLabel: (rides: number) => `(${rides} rides)`,
} as const;

export const getRiderRequestAcceptedPath = (params: {
  rideId: string;
  riderId: string;
  name: string;
  subtitle: string;
  avatarUri: string;
  rating: number;
  ridesCount: number;
  seatsBooked: number;
}) => ({
  pathname: ROUTES.myRidesRiderAccepted,
  params: {
    rideId: params.rideId,
    riderId: params.riderId,
    name: params.name,
    subtitle: params.subtitle,
    avatarUri: params.avatarUri,
    rating: String(params.rating),
    ridesCount: String(params.ridesCount),
    seatsBooked: String(params.seatsBooked),
  },
});
