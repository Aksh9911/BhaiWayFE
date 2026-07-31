import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import { ROUTES } from '@/config';
import { CORPORATE_VERIFICATION_SUCCESS_SCREEN } from '../constants/corporate-verification-success.constants';

export interface UseCorporateVerificationSuccessResult {
  trustScore: number;
  goDashboard: () => void;
  goBack: () => void;
}

export const useCorporateVerificationSuccess = (): UseCorporateVerificationSuccessResult => {
  const router = useRouter();
  const [trustScore, setTrustScore] = useState(0);

  useEffect(() => {
    const end = CORPORATE_VERIFICATION_SUCCESS_SCREEN.trustValue;
    const durationMs = 1500;
    const startedAt = Date.now();
    let frame = 0;

    const tick = () => {
      const progress = Math.min((Date.now() - startedAt) / durationMs, 1);
      setTrustScore(Math.floor(progress * end));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const goDashboard = useCallback(() => {
    router.replace(ROUTES.home);
  }, [router]);

  const goBack = useCallback(() => {
    router.replace(ROUTES.officeCommute);
  }, [router]);

  return {
    trustScore,
    goDashboard,
    goBack,
  };
};
