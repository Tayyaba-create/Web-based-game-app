"use client";

import { useEffect, useState, useRef } from "react";

interface UseCountdownTimerOptions {
  initialSeconds?: number;
  autoStart?: boolean;
  onComplete?: () => void;
}

export const useCountdownTimer = ({
  initialSeconds = 60,
  autoStart = true,
  onComplete,
}: UseCountdownTimerOptions = {}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        const newValue = prev - 1;

        // If timer reaches 0 and hasn't completed yet
        if (newValue <= 0 && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          setIsRunning(false);
          onComplete?.();
          return 0;
        }

        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, onComplete]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setSecondsRemaining(initialSeconds);
    setIsRunning(autoStart);
    hasCompletedRef.current = false;
  };

  return {
    secondsRemaining,
    isRunning,
    formatted: formatTime(secondsRemaining),
    start,
    pause,
    reset,
    setSecondsRemaining,
  };
};
