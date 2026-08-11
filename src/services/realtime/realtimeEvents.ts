export const REALTIME_EVENTS = {
  RIDE_CREATED: 'ride.created',
  RIDE_UPDATED: 'ride.updated',
  RIDE_CANCELLED: 'ride.cancelled',
  BOOKING_CREATED: 'booking.created',
  BOOKING_ACCEPTED: 'booking.accepted',
  BOOKING_REJECTED: 'booking.rejected',
  BOOKING_CANCELLED: 'booking.cancelled',
  PAYMENT_SUCCESS: 'payment.success',
  PAYMENT_FAILED: 'payment.failed',
  RIDE_DRIVER_ARRIVED: 'ride.driver_arrived',
  RIDE_STARTED: 'ride.started',
  RIDE_LOCATION_UPDATED: 'ride.location_updated',
  RIDE_COMPLETED: 'ride.completed',
  NOTIFICATION_CREATED: 'notification.created',
  RATING_CREATED: 'rating.created',
} as const;

export type RealtimeEventName = (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];

export interface RealtimeEnvelope<T = unknown> {
  event: RealtimeEventName | string;
  payload: T;
  at?: string;
}

export type RealtimeHandler = (envelope: RealtimeEnvelope) => void;
