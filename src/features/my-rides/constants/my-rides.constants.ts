import type { HistoryRideItem, UpcomingRideSummary } from '../types/my-rides.types';

export const MY_RIDES_SCREEN = {
  title: 'My Rides',
  riderModeBadge: 'Rider Mode',
  tabUpcoming: 'UPCOMING',
  tabPast: 'PAST',
  assuredLabel: 'ASSURED',
  otpLabel: 'OTP',
  pickupLabel: 'Pickup',
  dropoffLabel: 'Drop-off',
  verifiedLabel: 'VERIFIED',
  cancelLabel: 'Cancel Request',
  trackLabel: 'Track Driver',
  emptyUpcomingTitle: 'No upcoming rides',
  emptyUpcomingSubtitle: 'Book a commute and it will show up here.',
  emptyPastTitle: 'No past rides yet',
  emptyPastSubtitle: 'Completed rides will show up in this tab.',
  cancelTitle: 'Cancel Request',
  cancelMessage: 'Cancellation will be available soon.',
} as const;

export const DEFAULT_UPCOMING_RIDE: UpcomingRideSummary = {
  id: 'upcoming-1',
  dateLabel: 'TODAY, 08:30 AM',
  title: 'Ride Confirmed',
  assured: true,
  otp: '4921',
  pickupLabel: 'Delhi Center, Sector 12',
  dropoffLabel: 'Altus Mindstream Office',
  mapImageUri:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCVXZeqcQRiyiaZs9_hKuoF4XVMbs0PD-SD7AJNNHffGTvFzIcP5Bd0a8SwJlJkTeeBTS670hJyQ539eTtvL-yyR4-UoPtcBydDNCs94k7ri_IWp0ZEaUZOJtBCOlsvKFE7VMipr7ZcwukTJZ4K1mQX5ot5Sv5adrGwgU9MXghfp1t2gu-xiOBlUy3ulZX8n9DZNuZhSvhWPa2FWtgUDQDPEmWsnpTwusooVwjvkq4aHYxaK2qa1o8UVtJg9yvmPMLvkMR36QNYuhI',
  driver: {
    name: 'Arjun S.',
    vehicleLabel: 'Swift Dzire',
    plateNumber: 'DL 01 AB 1234',
    verified: true,
    avatarUri:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBWhK2iX3bo9PpAU5iqQWZ7gh0Wx_RZ4RIYmw6C0lo8VMj9ER9tbJQFoQNfD7GbGmTgI097WJVut_660L0PvUuL1oRbSjRHV8ncHGCHZqiLKLWGgsyP1QQ_lSN9AhkWoIrZBC4BVNwDeS4NOzSWwFJ_nA5R0zuH0gGFaeg5FK6g9mX67ukyazdmZ483pfut7hO15sADSGLfoiji3at_Z579WksNQOH7Ym2C82Vxj-cKVXDLaH2zcIFYIonlGsfcXyOnsuT8JtVV8LI',
  },
};

export const DEFAULT_HISTORY_RIDES: readonly HistoryRideItem[] = [
  {
    id: 'history-1',
    title: 'Morning Commute',
    routeLabel: 'Sector 12 → Altus Mindstream Office',
    dateLabel: 'Yesterday • 08:30 AM',
    statusLabel: 'Completed',
  },
  {
    id: 'history-2',
    title: 'Evening Return',
    routeLabel: 'Altus Mindstream Office → Sector 12',
    dateLabel: 'Mon • 06:15 PM',
    statusLabel: 'Completed',
  },
] as const;

export const DEFAULT_PROFILE_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCR7ViiU6Qfa72nqWMzfLs40ePuMA0iRVfsyayCPGmrTPMUzK7NWTISui3Lpj3DNzSYQsOwKdC257B5AEmyiSFE5jFyWAht7w3xmH_EFfYq2XEwAuK9F--fVXFpKJSv9JDXHI0r5CKBoQ-KrIlBFgb0nVEm6XfBqvlzgDbLxz-beRb0BV9Iy8X442-3IS_z7cbvFOrlY106-u9M-6tqQFxp5iVeyaMcFK_Dv6--e_P6OiFt0Evx3MiHUfG8VeQXbwhhyLCwjsyhqgw';
