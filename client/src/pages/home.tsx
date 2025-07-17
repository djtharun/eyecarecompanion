import { useState, useEffect } from 'react';
import { Eye, UserCheck, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimerCard } from '@/components/timer-card';
import { NotificationBanner } from '@/components/notification-banner';
import { ExerciseInstructions } from '@/components/exercise-instructions';
import { Statistics } from '@/components/statistics';
import { SettingsModal } from '@/components/settings-modal';
import { useTimer } from '@/hooks/use-timer';
import { useNotifications } from '@/hooks/use-notifications';
import { useSettings } from '@/hooks/use-settings';

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();
  const { showEyeBreakNotification, showPostureNotification } = useNotifications();
  
  const eyeTimer = useTimer(settings.eyeInterval);
  const postureTimer = useTimer(settings.postureInterval);

  // Update timer intervals when settings change
  useEffect(() => {
    eyeTimer.reset(settings.eyeInterval);
  }, [settings.eyeInterval]);

  useEffect(() => {
    postureTimer.reset(settings.postureInterval);
  }, [settings.postureInterval]);

  // Handle timer completion and notifications
  useEffect(() => {
    if (eyeTimer.timeLeft === 0 && eyeTimer.progress === 100) {
      if (settings.eyeNotifications) {
        showEyeBreakNotification();
      }
      // Auto-restart if enabled
      if (settings.autoStart) {
        setTimeout(() => {
          eyeTimer.reset(settings.eyeInterval);
          eyeTimer.start();
        }, 1000);
      }
    }
  }, [eyeTimer.timeLeft, eyeTimer.progress, settings.eyeNotifications, settings.autoStart, showEyeBreakNotification]);

  useEffect(() => {
    if (postureTimer.timeLeft === 0 && postureTimer.progress === 100) {
      if (settings.postureNotifications) {
        showPostureNotification();
      }
      // Auto-restart if enabled
      if (settings.autoStart) {
        setTimeout(() => {
          postureTimer.reset(settings.postureInterval);
          postureTimer.start();
        }, 1000);
      }
    }
  }, [postureTimer.timeLeft, postureTimer.progress, settings.postureNotifications, settings.autoStart, showPostureNotification]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Eye className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">EyeRest</h1>
                <p className="text-sm text-gray-500">Health & Posture Reminder</p>
              </div>
            </div>
            <Button
              onClick={() => setSettingsOpen(true)}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-gray-600"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <NotificationBanner />

        {/* Timer Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <TimerCard
            title="Eye Rest Timer"
            subtitle="20-20-20 Rule"
            icon={<Eye className="text-2xl" />}
            timer={eyeTimer}
            color="blue"
          />
          <TimerCard
            title="Posture Timer"
            subtitle="Stretch & Align"
            icon={<UserCheck className="text-2xl" />}
            timer={postureTimer}
            color="green"
          />
        </div>

        <ExerciseInstructions />
        <Statistics />
      </main>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
