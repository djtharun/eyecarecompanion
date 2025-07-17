import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  totalTime: number;
  progress: number;
}

export function useTimer(defaultMinutes: number = 20, storageKey?: string, onTimerComplete?: () => void) {
  const [state, setState] = useState<TimerState>({
    isRunning: false,
    timeLeft: defaultMinutes * 60,
    totalTime: defaultMinutes * 60,
    progress: 0,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer state from localStorage on mount
  useEffect(() => {
    if (!storageKey) return;
    
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const { timeLeft, totalTime, isRunning, lastSaved } = JSON.parse(stored);
        const now = Date.now();
        const elapsed = Math.floor((now - lastSaved) / 1000);
        
        // Calculate actual time left based on elapsed time
        let actualTimeLeft = timeLeft;
        if (isRunning && elapsed > 0) {
          actualTimeLeft = Math.max(0, timeLeft - elapsed);
        }
        
        setState({
          isRunning: isRunning && actualTimeLeft > 0,
          timeLeft: actualTimeLeft,
          totalTime: totalTime,
          progress: actualTimeLeft === 0 ? 100 : ((totalTime - actualTimeLeft) / totalTime) * 100,
        });
      }
    } catch (error) {
      console.error('Failed to load timer state:', error);
    }
  }, [storageKey]);

  // Save timer state to localStorage
  const saveTimerState = useCallback((currentState: TimerState) => {
    if (!storageKey) return;
    
    try {
      const saveData = {
        timeLeft: currentState.timeLeft,
        totalTime: currentState.totalTime,
        isRunning: currentState.isRunning,
        lastSaved: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(saveData));
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }, [storageKey]);

  const updateProgress = useCallback((timeLeft: number, totalTime: number) => {
    const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
    return Math.min(progressPercent, 100);
  }, []);

  const tick = useCallback(() => {
    setState(prevState => {
      const newState = prevState.timeLeft <= 1 
        ? {
            ...prevState,
            isRunning: false,
            timeLeft: 0,
            progress: 100,
          }
        : {
            ...prevState,
            timeLeft: prevState.timeLeft - 1,
            progress: updateProgress(prevState.timeLeft - 1, prevState.totalTime),
          };
      
      // Call completion callback when timer finishes
      if (newState.timeLeft === 0 && prevState.timeLeft > 0) {
        onTimerComplete?.();
      }
      
      saveTimerState(newState);
      return newState;
    });
  }, [updateProgress, saveTimerState, onTimerComplete]);

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
    setState(prevState => {
      const newState = { ...prevState, isRunning: true };
      saveTimerState(newState);
      return newState;
    });
  }, [saveTimerState]);

  const pause = useCallback(() => {
    setState(prevState => {
      const newState = { ...prevState, isRunning: false };
      saveTimerState(newState);
      return newState;
    });
  }, [saveTimerState]);

  const reset = useCallback((minutes?: number) => {
    const newTotalTime = (minutes || defaultMinutes) * 60;
    const newState = {
      isRunning: false,
      timeLeft: newTotalTime,
      totalTime: newTotalTime,
      progress: 0,
    };
    setState(newState);
    saveTimerState(newState);
  }, [defaultMinutes, saveTimerState]);

  const toggle = useCallback(() => {
    setState(prevState => {
      const newState = { ...prevState, isRunning: !prevState.isRunning };
      saveTimerState(newState);
      return newState;
    });
  }, [saveTimerState]);

  const formatTime = useCallback((seconds: number) => {
    // Handle NaN and invalid values
    if (!seconds || isNaN(seconds) || seconds < 0) {
      return {
        minutes: 0,
        seconds: '00',
        display: '0:00',
      };
    }
    
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
