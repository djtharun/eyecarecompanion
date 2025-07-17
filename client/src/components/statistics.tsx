import { useState, useEffect } from 'react';
import { useStreakTracking } from '@/hooks/use-streak-tracking';
import { Trophy, Target, Calendar, Clock } from 'lucide-react';

interface Stats {
  todayEyeBreaks: number;
  todayPostureChecks: number;
  weekStreak: number;
  totalTime: string;
}

export function Statistics() {
  const [stats, setStats] = useState<Stats>({
    todayEyeBreaks: 0,
    todayPostureChecks: 0,
    weekStreak: 0,
    totalTime: '0h 0m',
  });

  const { streakData, weeklyActivity, getStreakMessage, getWeeklyProgress } = useStreakTracking();

  useEffect(() => {
    // Load stats from localStorage
    const loadStats = () => {
      try {
        const stored = localStorage.getItem('eyerest-stats');
        if (stored) {
          const parsedStats = JSON.parse(stored);
          setStats(parsedStats);
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };

    loadStats();
  }, []);

  const incrementEyeBreaks = () => {
    setStats(prev => {
      const newStats = { ...prev, todayEyeBreaks: prev.todayEyeBreaks + 1 };
      localStorage.setItem('eyerest-stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const incrementPostureChecks = () => {
    setStats(prev => {
      const newStats = { ...prev, todayPostureChecks: prev.todayPostureChecks + 1 };
      localStorage.setItem('eyerest-stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const getTodayStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayActivity = weeklyActivity.find(day => day.date === today);
    return {
      eyeBreaks: todayActivity?.eyeBreaks || 0,
      postureChecks: todayActivity?.postureChecks || 0,
    };
  };

  const todayStats = getTodayStats();

  return (
    <div className="mt-8 space-y-6">
      {/* Streak Message */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Trophy className="w-5 h-5 text-amber-600" />
          <span className="text-lg font-semibold text-gray-800">
            {streakData.currentStreak} Day Streak
          </span>
        </div>
        <p className="text-sm text-gray-600">{getStreakMessage()}</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-600">{todayStats.eyeBreaks}</div>
          <div className="text-sm text-gray-500">Eye breaks today</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-green-600">{todayStats.postureChecks}</div>
          <div className="text-sm text-gray-500">Posture checks</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-600">{streakData.longestStreak}</div>
          <div className="text-sm text-gray-500">Best streak</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-purple-600">{streakData.totalCompletedSessions}</div>
          <div className="text-sm text-gray-500">Total sessions</div>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Weekly Progress</h3>
          <span className="text-sm text-gray-500">
            {streakData.completedThisWeek} / {streakData.weeklyGoal} sessions
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${getWeeklyProgress()}%` }}
          />
        </div>
        
        {/* Weekly Activity Calendar */}
        <div className="grid grid-cols-7 gap-2">
          {weeklyActivity.map((day, index) => {
            const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
            const isToday = day.date === new Date().toISOString().split('T')[0];
            const totalActivities = day.eyeBreaks + day.postureChecks;
            
            return (
              <div key={day.date} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{dayName}</div>
                <div 
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                    isToday 
                      ? 'ring-2 ring-blue-500 ring-offset-1' 
                      : ''
                  } ${
                    day.completed
                      ? 'bg-green-500 text-white'
                      : totalActivities > 0
                      ? 'bg-yellow-400 text-gray-800'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {totalActivities || '-'}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <span>No activity</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>Some activity</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Goal reached</span>
          </div>
        </div>
      </div>
    </div>
  );
}
