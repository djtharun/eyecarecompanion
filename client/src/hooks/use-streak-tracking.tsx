import { useState, useEffect, useCallback } from 'react';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  totalCompletedSessions: number;
  weeklyGoal: number;
  completedThisWeek: number;
  streakGoal: number;
}

export interface DayActivity {
  date: string;
  eyeBreaks: number;
  postureChecks: number;
  completed: boolean;
}

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: '',
  totalCompletedSessions: 0,
  weeklyGoal: 35, // 5 sessions per day * 7 days
  completedThisWeek: 0,
  streakGoal: 7,
};

const STORAGE_KEY = 'eyerest-streak-data';
const ACTIVITY_KEY = 'eyerest-daily-activity';

export function useStreakTracking() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData);
  const [weeklyActivity, setWeeklyActivity] = useState<DayActivity[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedStreak = localStorage.getItem(STORAGE_KEY);
      const storedActivity = localStorage.getItem(ACTIVITY_KEY);
      
      if (storedStreak) {
        const parsedStreak = JSON.parse(storedStreak);
        setStreakData({ ...defaultStreakData, ...parsedStreak });
      }
      
      if (storedActivity) {
        const parsedActivity = JSON.parse(storedActivity);
        setWeeklyActivity(parsedActivity);
      } else {
        // Initialize with current week
        initializeWeeklyActivity();
      }
    } catch (error) {
      console.error('Failed to load streak data:', error);
      initializeWeeklyActivity();
    }
  }, []);

  const initializeWeeklyActivity = useCallback(() => {
    const activities: DayActivity[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      activities.push({
        date: date.toISOString().split('T')[0],
        eyeBreaks: 0,
        postureChecks: 0,
        completed: false,
      });
    }
    
    setWeeklyActivity(activities);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
  }, []);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const recordActivity = useCallback((type: 'eye' | 'posture') => {
    const today = getTodayString();
    
    setWeeklyActivity(prev => {
      const updated = prev.map(day => {
        if (day.date === today) {
          const newDay = {
            ...day,
            [type === 'eye' ? 'eyeBreaks' : 'postureChecks']: 
              day[type === 'eye' ? 'eyeBreaks' : 'postureChecks'] + 1
          };
          
          // Check if day is now completed (at least 5 eye breaks and 3 posture checks)
          newDay.completed = newDay.eyeBreaks >= 5 && newDay.postureChecks >= 3;
          
          return newDay;
        }
        return day;
      });
      
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
      return updated;
    });

    // Update streak data
    setStreakData(prev => {
      const todayActivity = weeklyActivity.find(day => day.date === today);
      const isNewCompletion = todayActivity && 
        ((type === 'eye' && todayActivity.eyeBreaks >= 4) || 
         (type === 'posture' && todayActivity.postureChecks >= 2));

      let newStreakData = { ...prev };
      
      if (isNewCompletion && prev.lastActivityDate !== today) {
        // Check if streak continues
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        if (prev.lastActivityDate === yesterdayString || prev.currentStreak === 0) {
          newStreakData.currentStreak += 1;
        } else {
          newStreakData.currentStreak = 1;
        }
        
        newStreakData.longestStreak = Math.max(
          newStreakData.longestStreak, 
          newStreakData.currentStreak
        );
        newStreakData.lastActivityDate = today;
      }
      
      newStreakData.totalCompletedSessions += 1;
      
      // Calculate completed this week
      const thisWeekCompleted = weeklyActivity.reduce((sum, day) => 
        sum + day.eyeBreaks + day.postureChecks, 0
      ) + 1;
      newStreakData.completedThisWeek = thisWeekCompleted;
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newStreakData));
      return newStreakData;
    });
  }, [weeklyActivity]);

  const getStreakMessage = useCallback(() => {
    if (streakData.currentStreak === 0) {
      return "Start your wellness streak today!";
    } else if (streakData.currentStreak === 1) {
      return "Great start! Keep it going tomorrow.";
    } else if (streakData.currentStreak < 7) {
      return `${streakData.currentStreak} days strong! You're building a healthy habit.`;
    } else if (streakData.currentStreak < 30) {
      return `Amazing! ${streakData.currentStreak} day streak. You're on fire! 🔥`;
    } else {
      return `Incredible! ${streakData.currentStreak} days of wellness. You're a champion! 🏆`;
    }
  }, [streakData.currentStreak]);

  const getWeeklyProgress = useCallback(() => {
    return Math.min((streakData.completedThisWeek / streakData.weeklyGoal) * 100, 100);
  }, [streakData.completedThisWeek, streakData.weeklyGoal]);

  const updateWeeklyGoal = useCallback((goal: number) => {
    setStreakData(prev => {
      const updated = { ...prev, weeklyGoal: goal };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const updateStreakGoal = useCallback((goal: number) => {
    setStreakData(prev => {
      const updated = { ...prev, streakGoal: goal };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetStreak = useCallback(() => {
    const resetData = {
      ...defaultStreakData,
      longestStreak: streakData.longestStreak, // Keep longest streak
      totalCompletedSessions: streakData.totalCompletedSessions, // Keep total
    };
    setStreakData(resetData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
  }, [streakData.longestStreak, streakData.totalCompletedSessions]);

  return {
    streakData,
    weeklyActivity,
    recordActivity,
    getStreakMessage,
    getWeeklyProgress,
    updateWeeklyGoal,
    updateStreakGoal,
    resetStreak,
    initializeWeeklyActivity,
  };
}