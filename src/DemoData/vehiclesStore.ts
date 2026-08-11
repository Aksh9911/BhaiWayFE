import { DEMO_STORAGE_KEYS } from '@/DemoData/files';

import type { DemoVehicle, DemoVehicleInput } from './types';
import { createLocalListStore } from './localStore';

const store = createLocalListStore<DemoVehicle, 'vehicle_id'>(
  DEMO_STORAGE_KEYS.vehicles,
  'vehicle_id',
);

export const demoVehiclesStore = {
  hydrate: store.hydrate,
  getAll: store.getAll,
  getById: store.getById,
  subscribe: store.subscribe,
  removeById: store.removeById,
  clear: store.clear,

  add: async (input: DemoVehicleInput): Promise<DemoVehicle> => {
    await store.hydrate();
    const vehicle: DemoVehicle = {
      vehicle_id: store.nextId(),
      owner_id: input.owner_id,
      make: input.make.trim(),
      model: input.model.trim(),
      vehicle_number: input.vehicle_number.trim().toUpperCase(),
      vehicle_type: input.vehicle_type,
      color: input.color.trim(),
      year: input.year,
      seats: input.seats,
      ac: input.ac,
    };
    return store.save(vehicle);
  },

  update: async (
    vehicleId: number,
    patch: Partial<DemoVehicleInput>,
  ): Promise<DemoVehicle | null> => {
    await store.hydrate();
    const existing = store.getById(vehicleId);
    if (!existing) {
      return null;
    }
    const next: DemoVehicle = {
      ...existing,
      ...patch,
      vehicle_id: existing.vehicle_id,
      make: patch.make?.trim() ?? existing.make,
      model: patch.model?.trim() ?? existing.model,
      vehicle_number: patch.vehicle_number?.trim().toUpperCase() ?? existing.vehicle_number,
      color: patch.color?.trim() ?? existing.color,
    };
    return store.save(next);
  },

  getByOwnerId: (ownerId: number) =>
    store.getAll().filter((vehicle) => vehicle.owner_id === ownerId),
};

export const formatDemoVehicleLabel = (vehicle: DemoVehicle): string =>
  `${vehicle.color} ${vehicle.make} ${vehicle.model}`;

export const formatDemoVehiclePlate = (vehicle: DemoVehicle): string =>
  `${formatDemoVehicleLabel(vehicle)} • ${vehicle.vehicle_number}`;
