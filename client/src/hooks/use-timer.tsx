import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  progress: number;
}

export function useTimer(defaultMinutes: number = 20) {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    timeLeft: defaultMinutes * 60,
    totalTime: defaultMinutes * 60,
    progress: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateProgress = useCallback((timeLeft: number, totalTime: number) => {
    const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
    return Math.min(progressPercent, 100);
  }, []);

  const tick = useCallback(() => {
    setState(prevState => {
      if (prevState.timeLeft <= 1) {
        return {
          ...prevState,
          isRunning: false,
          timeLeft: 0,
          progress: 100,
        };
      }
      
      const newTimeLeft = prevState.timeLeft - 1;
      return {
        ...prevState,
        timeLeft: newTimeLeft,
        progress: updateProgress(newTimeLeft, prevState.totalTime),
      };
    });
  }, [updateProgress]);

  useEffect(() => {
    if (state.isRunning && state.timeLeft > 0) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.timeLeft, tick]);

  const start = useCallback(() => {
    setState(prevState => ({ ...prevState, isRunning: true }));
  }, []);

  const pause = useCallback(() => {
    setState(prevState => ({ ...prevState, isRunning: false }));
  }, []);

  const reset = useCallback((minutes?: number) => {
    const newTotalTime = (minutes || defaultMinutes) * 60;
    setState({
      isRunning: false,
      timeLeft: newTotalTime,
      totalTime: newTotalTime,
      progress: 0,
    });
  }, [defaultMinutes]);

  const toggle = useCallback(() => {
    setState(prevState => ({ ...prevState, isRunning: !prevState.isRunning }));
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins,
      seconds: secs.toString().padStart(2, '0'),
      display: `${mins}:${secs.toString().padStart(2, '0')}`,
    };
  }, []);

  const getNextBreakTime = useCallback(() => {
    if (!state.isRunning) return null;
    
    const now = new Date();
    const breakTime = new Date(now.getTime() + state.timeLeft * 1000);
    return breakTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, [state.isRunning, state.timeLeft]);

  return {
    ...state,
    start,
    pause,
    reset,
    toggle,
    formatTime,
    getNextBreakTime,
  };
}
