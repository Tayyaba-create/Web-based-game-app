// Custom hook for timer functionality
"use client";

import { useEffect, useState } from "react";

interface UseTimerOptions {
  autoStart?: boolean;
  initialSeconds?: number;
}

export const useTimer = (options: UseTimerOptions = {}) => {
  const { autoStart = true, initialSeconds = 0 } = options;
  const [time, setTime] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
      formatted: `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
    };
  };

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    setTime(initialSeconds);
    setIsRunning(autoStart);
  };

  const formattedTime = formatTime(time);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    setTime,
    ...formattedTime,
  };
};
