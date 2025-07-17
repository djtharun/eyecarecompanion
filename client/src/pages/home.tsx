import { useState, useEffect, useCallback } from 'react';
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
import { useStreakTracking } from '@/hooks/use-streak-tracking';
import { useSoundSettings } from '@/hooks/use-sound-settings';

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { settings } = useSettings();
  const { showEyeBreakNotification, showPostureNotification } = useNotifications();
  const { recordActivity } = useStreakTracking();
  const { playNotificationSound } = useSoundSettings();

  // Timer completion handlers
  const handleEyeTimerComplete = useCallback(() => {
    recordActivity('eye');
    if (settings.eyeNotifications) {
      showEyeBreakNotification(settings.soundAlerts);
    }
    if (settings.soundAlerts) {
      playNotificationSound();
    }
  }, [recordActivity, settings.eyeNotifications, settings.soundAlerts, showEyeBreakNotification, playNotificationSound]);

  const handlePostureTimerComplete = useCallback(() => {
    recordActivity('posture');
    if (settings.postureNotifications) {
      showPostureNotification(settings.soundAlerts);
    }
    if (settings.soundAlerts) {
      playNotificationSound();
    }
  }, [recordActivity, settings.postureNotifications, settings.soundAlerts, showPostureNotification, playNotificationSound]);
  
  const eyeTimer = useTimer(settings.eyeInterval, 'eyerest-eye-timer', handleEyeTimerComplete);
  const postureTimer = useTimer(settings.postureInterval, 'eyerest-posture-timer', handlePostureTimerComplete);

  // Update timer intervals when settings change
  useEffect(() => {
    eyeTimer.reset(settings.eyeInterval);
  }, [settings.eyeInterval]);

  useEffect(() => {
    postureTimer.reset(settings.postureInterval);
  }, [settings.postureInterval]);

  // Handle auto-restart functionality
  useEffect(() => {
    if (eyeTimer.timeLeft === 0 && eyeTimer.progress === 100 && settings.autoStart) {
      setTimeout(() => {
        eyeTimer.reset(settings.eyeInterval);
        eyeTimer.start();
      }, 1000);
    }
  }, [eyeTimer.timeLeft, eyeTimer.progress, settings.autoStart, settings.eyeInterval]);

  useEffect(() => {
    if (postureTimer.timeLeft === 0 && postureTimer.progress === 100 && settings.autoStart) {
      setTimeout(() => {
        postureTimer.reset(settings.postureInterval);
        postureTimer.start();
      }, 1000);
    }
  }, [postureTimer.timeLeft, postureTimer.progress, settings.autoStart, settings.postureInterval]);

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
