import { useState, useEffect } from 'react';

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

  return (
    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">{stats.todayEyeBreaks}</div>
        <div className="text-sm text-gray-500">Eye breaks today</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-green-600">{stats.todayPostureChecks}</div>
        <div className="text-sm text-gray-500">Posture checks</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-amber-600">{stats.weekStreak}</div>
        <div className="text-sm text-gray-500">Day streak</div>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <div className="text-2xl font-bold text-gray-600">{stats.totalTime}</div>
        <div className="text-sm text-gray-500">Focus time</div>
      </div>
    </div>
  );
}
