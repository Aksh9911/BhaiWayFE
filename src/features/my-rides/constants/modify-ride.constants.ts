import { ROUTES } from '@/config';
import {
  DEFAULT_RIDE_PREFERENCES,
  PUBLISH_RIDE_VEHICLES,
  RIDE_PREFERENCE_OPTIONS,
} from '@/features/offer-ride/constants';
import type { PublishRidePreferences, RidePreferenceId } from '@/features/offer-ride/types';

export const MODIFY_RIDE_SCREEN = {
  brandName: 'BhaiWay',
  title: 'Modify Outstation Ride',
  routeTitle: 'Route Details',
  schedulingTitle: 'Scheduling',
  seatingTitle: 'Seating & Pricing',
  preferencesTitle: 'Ride Preferences',
  vehicleTitle: 'Vehicle Details',
  addVehicleLabel: '+ Add New',
  departureTimeLabel: 'Departure Time',
  travelDateLabel: 'Travel Date',
  availableSeatsLabel: 'Available Seats',
  pricePerSeatLabel: 'Price per seat',
  maxTwoLabel: 'Max 2 people in back seat',
  maxTwoHint: 'Ensures comfort and premium experience',
  updateLabel: 'Update Ride Details',
  updateSuccessTitle: 'Ride updated',
  updateSuccessMessage: 'Your outstation ride details have been updated.',
  addVehicleMessage: 'Adding a new vehicle will be available soon.',
} as const;

export interface ModifyRideFormState {
  rideId: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  availableSeats: number;
  pricePerSeat: string;
  maxTwoInBackSeat: boolean;
  preferences: PublishRidePreferences;
  selectedVehicleId: string;
}

export const DEFAULT_MODIFY_RIDE_FORM: ModifyRideFormState = {
  rideId: 'driving-upcoming-regular-1',
  origin: 'Saket, South Delhi',
  destination: 'Cyber City, Gurgaon',
  departureDate: '28/10/2023',
  departureTime: '09:00 AM',
  availableSeats: 3,
  pricePerSeat: '150',
  maxTwoInBackSeat: true,
  preferences: {
    ...DEFAULT_RIDE_PREFERENCES,
    luggage: true,
    music: true,
  },
  selectedVehicleId: '',
};

export const MODIFY_RIDE_PREFERENCE_OPTIONS = RIDE_PREFERENCE_OPTIONS;
/** @deprecated Prefer My Garage vehicles via vehiclesSheetStore. */
export const MODIFY_RIDE_VEHICLES = PUBLISH_RIDE_VEHICLES;

export type ModifyRidePreferenceId = RidePreferenceId;

export const getModifyRidePath = (params: {
  rideId: string;
  pickupLabel?: string;
  dropoffLabel?: string;
  dateLabel?: string;
}) => ({
  pathname: ROUTES.myRidesModifyRide,
  params: {
    rideId: params.rideId,
    ...(params.pickupLabel ? { pickupLabel: params.pickupLabel } : {}),
    ...(params.dropoffLabel ? { dropoffLabel: params.dropoffLabel } : {}),
    ...(params.dateLabel ? { dateLabel: params.dateLabel } : {}),
  },
});
