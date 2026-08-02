import { useCallback, useEffect, useState } from 'react';
import { Share } from 'react-native';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { resetTo } from '@/shared/utils';
import { EMERGENCY_REQUEST_RAISED_SCREEN } from '../constants';

export interface UseEmergencyRequestRaisedResult {
  referenceNumber: string;
  statusMessage: string;
  copyReference: () => void;
  goToMyRides: () => void;
  openSupport: () => void;
}

export const useEmergencyRequestRaised = (): UseEmergencyRequestRaisedResult => {
  const router = useRouter();
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex(
        (prev) => (prev + 1) % EMERGENCY_REQUEST_RAISED_SCREEN.statusMessages.length,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const copyReference = useCallback(() => {
    void Share.share({
      message: EMERGENCY_REQUEST_RAISED_SCREEN.referenceNumber,
    });
  }, []);

  const goToMyRides = useCallback(() => {
    resetTo(router, ROUTES.myRides);
  }, [router]);

  const openSupport = useCallback(() => {
    router.push(ROUTES.supportChat);
  }, [router]);

  return {
    referenceNumber: EMERGENCY_REQUEST_RAISED_SCREEN.referenceNumber,
    statusMessage: EMERGENCY_REQUEST_RAISED_SCREEN.statusMessages[statusIndex],
    copyReference,
    goToMyRides,
    openSupport,
  };
};
