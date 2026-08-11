import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  hydrateSessionFromSheet,
  vehiclesSheetStore,
  vehiclesSheetSync,
  type VehiclesSheetRow,
} from '@/DemoData';
import { getErrorMessage, triggerLightHaptic, triggerSuccessHaptic, showAppAlert } from '@/shared/utils';
import { MY_GARAGE_SCREEN } from '../constants';
import type { GarageVehicle } from '../types';

export interface UseMyGarageResult {
  vehicles: readonly GarageVehicle[];
  refreshing: boolean;
  goBack: () => void;
  deleteVehicle: (vehicle: GarageVehicle) => void;
  addVehicle: () => void;
}

const formatPlate = (plate: string): string => plate.replace(/\s+/g, ' ').trim().toUpperCase();

const mapVehicleRow = (row: VehiclesSheetRow): GarageVehicle => {
  const plate = formatPlate(row.vehicleNumberPlate ?? '');
  const model = (row.vehicleModel ?? '').trim();
  const color = (row.vehicleColor ?? '').trim();
  const type = (row.vehicleType ?? '').trim();
  const name =
    [color, model].filter(Boolean).join(' ') ||
    [type, model].filter(Boolean).join(' ') ||
    model ||
    plate ||
    `Vehicle ${row.vehicleId}`;

  return {
    id: String(row.row_id),
    name,
    model,
    color,
    plateNumber: plate || '—',
    rcStatus: (row.rc ?? '').trim() ? 'approved' : 'pending',
  };
};

const getGarageSnapshot = (): string =>
  vehiclesSheetStore
    .getForCurrentUser()
    .map(
      (row) =>
        `${row.row_id}:${row.vehicleId}:${row.vehicleModel}:${row.vehicleColor}:${row.vehicleNumberPlate}:${row.rc}`,
    )
    .join('|');

const subscribeGarage = (onStoreChange: () => void): (() => void) =>
  vehiclesSheetStore.subscribe(() => onStoreChange());

export const useMyGarage = (): UseMyGarageResult => {
  const router = useRouter();
  const sheetSnapshot = useSyncExternalStore(subscribeGarage, getGarageSnapshot);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setRefreshing(true);
      void (async () => {
        try {
          await hydrateSessionFromSheet();
          await vehiclesSheetSync.pullIntoLocal();
        } finally {
          if (active) {
            setRefreshing(false);
          }
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const vehicles = useMemo((): readonly GarageVehicle[] => {
    return vehiclesSheetStore.getForCurrentUser().map(mapVehicleRow);
  }, [sheetSnapshot]);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.profile);
  }, [router]);

  const deleteVehicle = useCallback((vehicle: GarageVehicle) => {
    triggerLightHaptic();
    showAppAlert(MY_GARAGE_SCREEN.deleteTitle, MY_GARAGE_SCREEN.deleteMessage(vehicle.name), [
      { text: MY_GARAGE_SCREEN.cancelLabel, style: 'cancel' },
      {
        text: MY_GARAGE_SCREEN.deleteConfirmLabel,
        style: 'destructive',
        onPress: () => {
          void (async () => {
            const rowId = Number(vehicle.id);
            if (!Number.isFinite(rowId)) {
              showAppAlert(MY_GARAGE_SCREEN.deleteFailedTitle, 'Vehicle not found.');
              return;
            }
            try {
              await vehiclesSheetSync.deleteAndSync(rowId);
              triggerSuccessHaptic();
            } catch (error) {
              showAppAlert(MY_GARAGE_SCREEN.deleteFailedTitle, getErrorMessage(error));
            }
          })();
        },
      },
    ]);
  }, []);

  const addVehicle = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.addVehicle);
  }, [router]);

  return {
    vehicles,
    refreshing,
    goBack,
    deleteVehicle,
    addVehicle,
  };
};
