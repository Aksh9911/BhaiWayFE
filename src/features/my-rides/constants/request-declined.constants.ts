import { ROUTES } from '@/config';

export const REQUEST_DECLINED_SCREEN = {
  brandName: 'BhaiWay',
  title: 'Request Declined',
  subtitle: (name: string) => `The request from ${name} has been removed.`,
  infoNote: (name: string) =>
    `${name} will be notified that you are unable to take this request. Your seat availability remains unchanged.`,
  dashboardLabel: 'Back to Dashboard',
  viewRequestsLabel: 'View Other Requests',
} as const;

export const getRequestDeclinedPath = (params: {
  rideId: string;
  riderId: string;
  name: string;
}) => ({
  pathname: ROUTES.myRidesRequestDeclined,
  params: {
    rideId: params.rideId,
    riderId: params.riderId,
    name: params.name,
  },
});
