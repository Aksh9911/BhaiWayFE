import {
  type PublishedRidesSheetRow,
  type RideBookingsSheetRow,
} from '@/DemoData';

import { DEFAULT_PROFILE_AVATAR } from '../constants';
import type { UpcomingRideSummary } from '../types';

const FALLBACK_PICKUP = { latitude: 28.5921, longitude: 77.046 } as const;
const FALLBACK_DROPOFF = { latitude: 28.4595, longitude: 77.0266 } as const;

const coordOrFallback = (
  latitude: number,
  longitude: number,
  fallback: { latitude: number; longitude: number },
) => {
  if (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(latitude === 0 && longitude === 0)
  ) {
    return { latitude, longitude };
  }
  return { ...fallback };
};

const otpFromId = (id: number): string => String(1000 + (Math.abs(id) % 9000));

/** Map a PublishedRides row into a My Rides driver-mode upcoming card. */
export const mapPublishedRideToUpcoming = (
  row: PublishedRidesSheetRow,
): UpcomingRideSummary => {
  const dateLabel = [row.departureDate, row.departureTime]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(', ')
    .toUpperCase() || 'UPCOMING';

  const peer = {
    name: 'Pending requests',
    vehicleLabel: `${row.availableSeats} seat${row.availableSeats === 1 ? '' : 's'} open`,
    plateNumber: row.vehiclePlate || row.vehicleName || 'Published ride',
    verified: false,
    avatarUri: DEFAULT_PROFILE_AVATAR,
  };

  return {
    id: `pub-${row.rideId}`,
    dateLabel,
    title: 'Ride Published',
    assured: row.rideType === 'assured',
    otp: otpFromId(row.rideId),
    pickupLabel: row.origin || 'Pickup',
    dropoffLabel: row.destination || 'Drop-off',
    pickup: coordOrFallback(row.originLat, row.originLng, FALLBACK_PICKUP),
    dropoff: coordOrFallback(row.destLat, row.destLng, FALLBACK_DROPOFF),
    peer,
    driver: peer,
    riders: [],
    role: 'driver',
  };
};

/** Map a RideBookings row into a My Rides rider-mode upcoming card. */
export const mapBookingToUpcoming = (row: RideBookingsSheetRow): UpcomingRideSummary => {
  const peer = {
    name: row.driverName?.trim() || 'Driver',
    vehicleLabel: row.vehicleLabel?.trim() || 'Vehicle',
    plateNumber: row.paymentStatus === 'paid' ? 'Paid' : 'Pay later',
    verified: true,
    avatarUri: DEFAULT_PROFILE_AVATAR,
  };

  return {
    id: `book-${row.bookingId}`,
    dateLabel: (row.departureLabel || 'Upcoming').toUpperCase(),
    title: 'Ride Confirmed',
    assured: false,
    otp: otpFromId(row.bookingId),
    pickupLabel: row.origin || 'Pickup',
    dropoffLabel: row.destination || 'Drop-off',
    pickup: coordOrFallback(row.originLat, row.originLng, FALLBACK_PICKUP),
    dropoff: coordOrFallback(row.destLat, row.destLng, FALLBACK_DROPOFF),
    peer,
    driver: peer,
    role: 'rider',
  };
};
