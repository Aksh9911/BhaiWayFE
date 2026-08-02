import type { HistoryRideItem, UpcomingRideSummary } from '../types/my-rides.types';

export const MY_RIDES_SCREEN = {
  title: 'My Rides',
  riderModeBadge: 'Rider Mode',
  driverModeBadge: 'Driver Mode',
  tabUpcoming: 'UPCOMING',
  tabPast: 'PAST',
  assuredLabel: 'ASSURED',
  otpLabel: 'OTP',
  pickupLabel: 'Pickup',
  dropoffLabel: 'Drop-off',
  verifiedLabel: 'VERIFIED',
  cancelLabelRiding: 'Cancel Request',
  cancelLabelDriving: 'Cancel Ride',
  trackLabelRiding: 'Track Ride',
  trackLabelDriving: 'Start Ride',
  peerLabelRiding: 'Your driver',
  peerLabelDriving: 'Your rider',
  emptyUpcomingTitle: 'No upcoming rides',
  emptyUpcomingSubtitleRiding: 'Book a carpool or office commute and it will show up here.',
  emptyUpcomingSubtitleDriving: 'Publish a carpool ride and booked trips will show up here.',
  emptyPastTitle: 'No past rides yet',
  emptyPastSubtitleRiding: 'Completed rides will show up in this tab.',
  emptyPastSubtitleDriving: 'Completed published rides will show up in this tab.',
  cancelTitleRiding: 'Cancel Request',
  cancelTitleDriving: 'Cancel Ride',
  cancelMessage: 'Cancellation will be available soon.',
} as const;

const DRIVER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBWhK2iX3bo9PpAU5iqQWZ7gh0Wx_RZ4RIYmw6C0lo8VMj9ER9tbJQFoQNfD7GbGmTgI097WJVut_660L0PvUuL1oRbSjRHV8ncHGCHZqiLKLWGgsyP1QQ_lSN9AhkWoIrZBC4BVNwDeS4NOzSWwFJ_nA5R0zuH0gGFaeg5FK6g9mX67ukyazdmZ483pfut7hO15sADSGLfoiji3at_Z579WksNQOH7Ym2C82Vxj-cKVXDLaH2zcIFYIonlGsfcXyOnsuT8JtVV8LI';

const RIDER_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCR7ViiU6Qfa72nqWMzfLs40ePuMA0iRVfsyayCPGmrTPMUzK7NWTISui3Lpj3DNzSYQsOwKdC257B5AEmyiSFE5jFyWAht7w3xmH_EFfYq2XEwAuK9F--fVXFpKJSv9JDXHI0r5CKBoQ-KrIlBFgb0nVEm6XfBqvlzgDbLxz-beRb0BV9Iy8X442-3IS_z7cbvFOrlY106-u9M-6tqQFxp5iVeyaMcFK_Dv6--e_P6OiFt0Evx3MiHUfG8VeQXbwhhyLCwjsyhqgw';

/** Rider mode: Delhi Sector 12 → Gurugram office corridor */
const RIDER_PICKUP = { latitude: 28.5921, longitude: 77.046 } as const;
const RIDER_DROPOFF = { latitude: 28.4595, longitude: 77.0266 } as const;

/** Driver mode: Koramangala → Electronic City */
const DRIVER_PICKUP = { latitude: 12.9352, longitude: 77.6245 } as const;
const DRIVER_DROPOFF = { latitude: 12.8399, longitude: 77.677 } as const;

export const DEFAULT_UPCOMING_RIDE: UpcomingRideSummary = {
  id: 'upcoming-1',
  dateLabel: 'TODAY, 08:30 AM',
  title: 'Ride Confirmed',
  assured: true,
  otp: '4921',
  pickupLabel: 'Delhi Center, Sector 12',
  dropoffLabel: 'Altus Mindstream Office',
  pickup: { ...RIDER_PICKUP },
  dropoff: { ...RIDER_DROPOFF },
  peer: {
    name: 'Arjun S.',
    vehicleLabel: 'Swift Dzire',
    plateNumber: 'DL 01 AB 1234',
    verified: true,
    avatarUri: DRIVER_AVATAR,
  },
  driver: {
    name: 'Arjun S.',
    vehicleLabel: 'Swift Dzire',
    plateNumber: 'DL 01 AB 1234',
    verified: true,
    avatarUri: DRIVER_AVATAR,
  },
};

export const DEFAULT_DRIVING_UPCOMING_RIDE: UpcomingRideSummary = {
  id: 'driving-upcoming-1',
  dateLabel: 'TODAY, 07:00 AM',
  title: 'Ride Published',
  assured: true,
  otp: '3184',
  pickupLabel: 'Koramangala 5th Block',
  dropoffLabel: 'Electronic City Phase 1',
  pickup: { ...DRIVER_PICKUP },
  dropoff: { ...DRIVER_DROPOFF },
  peer: {
    name: 'Priya Sharma',
    vehicleLabel: '2 seats booked',
    plateNumber: '₹240 earned',
    verified: true,
    avatarUri: RIDER_AVATAR,
  },
  driver: {
    name: 'Priya Sharma',
    vehicleLabel: '2 seats booked',
    plateNumber: '₹240 earned',
    verified: true,
    avatarUri: RIDER_AVATAR,
  },
};

export const DEFAULT_HISTORY_RIDES: readonly HistoryRideItem[] = [
  {
    id: 'history-1',
    title: 'Morning Commute',
    routeLabel: 'Sector 12 → Altus Mindstream Office',
    dateLabel: 'Yesterday • 08:30 AM',
    statusLabel: 'Completed',
    pickupLabel: 'Delhi Center, Sector 12',
    dropoffLabel: 'Altus Mindstream Office',
    pickup: { ...RIDER_PICKUP },
    dropoff: { ...RIDER_DROPOFF },
  },
  {
    id: 'history-2',
    title: 'Evening Return',
    routeLabel: 'Altus Mindstream Office → Sector 12',
    dateLabel: 'Mon • 06:15 PM',
    statusLabel: 'Completed',
    pickupLabel: 'Altus Mindstream Office',
    dropoffLabel: 'Delhi Center, Sector 12',
    pickup: { ...RIDER_DROPOFF },
    dropoff: { ...RIDER_PICKUP },
  },
] as const;

export const DEFAULT_DRIVING_HISTORY_RIDES: readonly HistoryRideItem[] = [
  {
    id: 'driving-history-1',
    title: 'Published Outstation',
    routeLabel: 'Bengaluru → Mysuru',
    dateLabel: 'Yesterday • 06:00 AM',
    statusLabel: 'Completed',
    pickupLabel: 'Bengaluru',
    dropoffLabel: 'Mysuru',
    pickup: { latitude: 12.9716, longitude: 77.5946 },
    dropoff: { latitude: 12.2958, longitude: 76.6394 },
  },
  {
    id: 'driving-history-2',
    title: 'Published City Ride',
    routeLabel: 'Whitefield → MG Road',
    dateLabel: 'Sun • 09:15 AM',
    statusLabel: 'Completed',
    pickupLabel: 'Whitefield',
    dropoffLabel: 'MG Road',
    pickup: { latitude: 12.9698, longitude: 77.75 },
    dropoff: { latitude: 12.975, longitude: 77.6063 },
  },
] as const;

export const DEFAULT_PROFILE_AVATAR = RIDER_AVATAR;
