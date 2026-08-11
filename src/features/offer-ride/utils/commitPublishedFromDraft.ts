import { publishedRidesSheetSync, vehiclesSheetStore } from '@/DemoData';
import { bhaiwayApi } from '@/services/api';
import { REALTIME_EVENTS, realtimeService } from '@/services/realtime';
import { store } from '@/store/redux';

import { RIDE_PUBLISHED_SCREEN } from '../constants';
import { publishRideDraft, publishedRideStore } from '../store';
import type { PublishRidePreferences } from '../types';
import { mapGarageVehicleToOption } from './mapGarageVehicle';

const formatPreferences = (preferences: PublishRidePreferences): string => {
  const labels: string[] = [];
  if (preferences.noSmoking) {
    labels.push('No smoking');
  }
  if (preferences.noPets) {
    labels.push('No pets');
  }
  if (preferences.luggage) {
    labels.push('Luggage OK');
  }
  if (preferences.music) {
    labels.push('Music OK');
  }
  return labels.join(', ');
};

/**
 * Persists the current publish draft into local success store + PublishedRides sheet,
 * then resets the draft. Returns false when a vehicle has not been selected yet.
 */
export const commitPublishedFromDraft = async (): Promise<boolean> => {
  const current = publishRideDraft.get();
  if (!current.selectedVehicleId) {
    return false;
  }

  const garageVehicles = vehiclesSheetStore.getForCurrentUser().map(mapGarageVehicleToOption);
  const vehicle =
    garageVehicles.find((item) => item.id === current.selectedVehicleId) ?? null;

  if (!vehicle) {
    return false;
  }

  try {
    const result = await publishedRidesSheetSync.upsertAndSync({
      rideType: current.rideType,
      origin: current.origin,
      destination: current.destination,
      departureDate: current.departureDate,
      departureTime: current.departureTime,
      availableSeats: current.availableSeats,
      pricePerSeat: current.pricePerSeat,
      preferences: formatPreferences(current.preferences),
      notes: current.notes,
      vehicleName: vehicle.name,
      vehiclePlate: vehicle.plateNumber,
      maxTwoInBack: current.maxTwoInBackSeat,
      womenOnly: current.womenOnly,
      originLat: current.originLocation?.latitude,
      originLng: current.originLocation?.longitude,
      destLat: current.destinationLocation?.latitude,
      destLng: current.destinationLocation?.longitude,
      status: 'published',
      publishedAt: new Date().toISOString(),
    });
    realtimeService.publish(REALTIME_EVENTS.RIDE_CREATED, { rideId: result.rideId });
    store.dispatch(
      bhaiwayApi.util.invalidateTags([
        { type: 'Ride', id: 'LIST' },
        { type: 'Ride', id: 'SEARCH' },
      ]),
    );
  } catch (error) {
    console.log('[Publish Ride] sheet sync failed', error);
  }

  publishedRideStore.set({
    pickupLabel: current.origin,
    dropoffLabel: current.destination,
    departureLabel: `${current.departureDate} · ${current.departureTime}`,
    seats: current.availableSeats,
    pricePerSeat: current.pricePerSeat,
    rideType: current.rideType,
    vehicle,
    preferences: { ...current.preferences },
    notes: current.notes,
    refundableAmount:
      current.rideType === 'assured'
        ? RIDE_PUBLISHED_SCREEN.defaultRefundableAmount
        : null,
  });
  publishRideDraft.reset(current.rideType);
  return true;
};
