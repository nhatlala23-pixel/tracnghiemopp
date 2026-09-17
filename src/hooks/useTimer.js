import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDuration } from '../utils/calculateResult';

export function useTimer({ initialSeconds = 5400, onTimeUp, autoStart = true } = {}) {
  const [secondsRemaining, setSecondsRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const endTimeRef = useRef(Date.now() + initialSeconds * 1000);
  const intervalRef = useRef(null);

  // Khởi động hoặc cập nhật endTime khi initialSeconds thay đổi
  const start = useCallback((duration = initialSeconds) => {
    endTimeRef.current = Date.now() + duration * 1000;
    setSecondsRemaining(duration);
    setIsRunning(true);
  }, [initialSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resume = useCallback(() => {
    endTimeRef.current = Date.now() + secondsRemaining * 1000;
    setIsRunning(true);
  }, [secondsRemaining]);

  const reset = useCallback((duration = initialSeconds) => {
    setIsRunning(false);
    setSecondsRemaining(duration);
    endTimeRef.current = Date.now() + duration * 1000;
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.round((endTimeRef.current - now) / 1000));
      setSecondsRemaining(diff);

      if (diff <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
        if (onTimeUp) onTimeUp();
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, onTimeUp]);

  return {
    secondsRemaining,
    formattedTime: formatDuration(secondsRemaining),
    isRunning,
    start,
    pause,
    resume,
    reset,
  };
}
