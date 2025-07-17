import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { TimerState } from '@/hooks/use-timer';

interface TimerCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  timer: TimerState & {
    toggle: () => void;
    reset: () => void;
    formatTime: (seconds: number) => { minutes: number; seconds: string };
    getNextBreakTime: () => string | null;
  };
  color: 'blue' | 'green';
}

export function TimerCard({ title, subtitle, icon, timer, color }: TimerCardProps) {
  const timeDisplay = timer.formatTime(timer.timeLeft);
  const nextBreak = timer.getNextBreakTime();
  
  // Calculate stroke-dashoffset for progress circle
  const circumference = 2 * Math.PI * 45; // radius is 45
  const strokeDashoffset = circumference - (timer.progress / 100) * circumference;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      icon: 'text-blue-600',
      stroke: '#2563eb',
      button: 'bg-blue-600 hover:bg-blue-700',
    },
    green: {
      bg: 'bg-green-100',
      icon: 'text-green-600',
      stroke: '#10b981',
      button: 'bg-green-600 hover:bg-green-700',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <div className={colors.icon}>{icon}</div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={colors.stroke}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="circular-progress"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {timeDisplay.minutes}
              </div>
              <div className="text-sm text-gray-500">
                :{timeDisplay.seconds}
              </div>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-3">
          <Button
            onClick={timer.toggle}
            className={`flex items-center space-x-2 ${colors.button} text-white`}
          >
            {timer.isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start</span>
              </>
            )}
          </Button>
          <Button
            onClick={timer.reset}
            variant="outline"
            className="px-4 py-2"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Next Break Info */}
        {nextBreak && (
          <div className="mt-4 text-xs text-gray-500">
            Next break: <span className="font-medium">{nextBreak}</span>
          </div>
        )}
      </div>
    </div>
  );
}
