import { useCallback, useEffect, useState } from 'react';

export interface UseCountdownResult {
  secondsLeft: number;
  isRunning: boolean;
  canResend: boolean;
  restart: (seconds?: number) => void;
}

export const useCountdown = (initialSeconds: number, autoStart = true): UseCountdownResult => {
  const [secondsLeft, setSecondsLeft] = useState(autoStart ? initialSeconds : 0);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const restart = useCallback(
    (seconds: number = initialSeconds) => {
      setSecondsLeft(seconds);
      setIsRunning(true);
    },
    [initialSeconds],
  );

  return {
    secondsLeft,
    isRunning,
    canResend: secondsLeft === 0,
    restart,
  };
};
