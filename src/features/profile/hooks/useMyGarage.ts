import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { triggerLightHaptic } from '@/shared/utils';
import { GARAGE_VEHICLES, MY_GARAGE_SCREEN } from '../constants';
import type { GarageVehicle } from '../types';

export interface UseMyGarageResult {
  vehicles: readonly GarageVehicle[];
  goBack: () => void;
  openVehicleMenu: (vehicle: GarageVehicle) => void;
  addVehicle: () => void;
}

export const useMyGarage = (): UseMyGarageResult => {
  const router = useRouter();

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.profile);
  }, [router]);

  const openVehicleMenu = useCallback((vehicle: GarageVehicle) => {
    triggerLightHaptic();
    Alert.alert(vehicle.name, MY_GARAGE_SCREEN.comingSoonMessage, [
      { text: 'OK' },
    ]);
  }, []);

  const addVehicle = useCallback(() => {
    triggerLightHaptic();
    router.push(ROUTES.addVehicle);
  }, [router]);

  return {
    vehicles: GARAGE_VEHICLES,
    goBack,
    openVehicleMenu,
    addVehicle,
  };
};
