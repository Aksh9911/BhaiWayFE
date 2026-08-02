import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import {
  DEFAULT_DRIVER_PICKUP_STOPS,
  DRIVER_PICKUP_SCREEN,
} from '../constants';
import type { DriverPickupStop } from '../types';

export interface UseDriverPickupResult {
  stop: DriverPickupStop;
  stopTitle: string;
  confirming: boolean;
  otpVisible: boolean;
  otpValue: string;
  otpError: string | null;
  otpVerifying: boolean;
  confirmedVisible: boolean;
  isLastStop: boolean;
  confirmArrival: () => void;
  setOtpValue: (value: string) => void;
  verifyOtp: () => void;
  closeOtp: () => void;
  continueAfterConfirmed: () => void;
  goBack: () => void;
  openNotifications: () => void;
}

export const useDriverPickup = (): UseDriverPickupResult => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpValue, setOtpValueState] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [confirmedVisible, setConfirmedVisible] = useState(false);

  const stop = useMemo(
    () => DEFAULT_DRIVER_PICKUP_STOPS[currentIndex] ?? DEFAULT_DRIVER_PICKUP_STOPS[0],
    [currentIndex],
  );

  const isLastStop = currentIndex >= DEFAULT_DRIVER_PICKUP_STOPS.length - 1;
  const stopTitle = DRIVER_PICKUP_SCREEN.pickupTitle(stop.index, stop.total);

  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(ROUTES.myRides);
  }, [router]);

  const openNotifications = useCallback(() => {
    router.push(ROUTES.notifications);
  }, [router]);

  const resetOtp = useCallback(() => {
    setOtpValueState('');
    setOtpError(null);
    setOtpVerifying(false);
  }, []);

  const setOtpValue = useCallback((value: string) => {
    setOtpValueState(value.replace(/[^0-9]/g, '').slice(0, DRIVER_PICKUP_SCREEN.otpLength));
    setOtpError(null);
  }, []);

  const confirmArrival = useCallback(() => {
    if (confirming && otpVisible) {
      return;
    }
    setConfirming(true);
    resetOtp();
    setOtpVisible(true);
  }, [confirming, otpVisible, resetOtp]);

  const closeOtp = useCallback(() => {
    setOtpVisible(false);
    setConfirming(false);
    resetOtp();
  }, [resetOtp]);

  const continueAfterConfirmed = useCallback(() => {
    setConfirmedVisible(false);

    if (isLastStop) {
      router.replace(ROUTES.myRidesActiveTrip);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setConfirming(false);
    resetOtp();
  }, [isLastStop, resetOtp, router]);

  const verifyOtp = useCallback(() => {
    if (otpVerifying) {
      return;
    }

    if (otpValue.length !== DRIVER_PICKUP_SCREEN.otpLength) {
      setOtpError(DRIVER_PICKUP_SCREEN.otpInvalidMessage);
      return;
    }

    setOtpVerifying(true);

    // Mock verification delay for UX.
    setTimeout(() => {
      if (otpValue !== stop.otp) {
        setOtpError(DRIVER_PICKUP_SCREEN.otpInvalidMessage);
        setOtpVerifying(false);
        return;
      }

      setOtpVisible(false);
      setOtpVerifying(false);
      setConfirmedVisible(true);
    }, 400);
  }, [otpValue, otpVerifying, stop.otp]);

  return {
    stop,
    stopTitle,
    confirming,
    otpVisible,
    otpValue,
    otpError,
    otpVerifying,
    confirmedVisible,
    isLastStop,
    confirmArrival,
    setOtpValue,
    verifyOtp,
    closeOtp,
    continueAfterConfirmed,
    goBack,
    openNotifications,
  };
};
