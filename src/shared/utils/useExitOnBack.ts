import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Intercepts Android hardware back on terminal screens (cancel confirmed, trip done).
 * Pair with `gestureEnabled: false` on the Stack screen.
 */
export const useExitOnBack = (onExit: () => void): void => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onExit();
      return true;
    });

    return () => subscription.remove();
  }, [onExit]);
};
