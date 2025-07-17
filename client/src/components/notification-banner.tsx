import { Button } from '@/components/ui/button';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { useState } from 'react';

export function NotificationBanner() {
  const { settings, requestPermission } = useNotifications();
  const [dismissed, setDismissed] = useState(false);

  if (settings.permission === 'granted' || dismissed || !settings.isSupported) {
    return null;
  }

  const handleEnable = async () => {
    await requestPermission();
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Bell className="h-5 w-5 text-amber-600" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            Enable notifications to receive reminders
          </p>
          <p className="text-xs text-amber-600">
            We'll send you gentle reminders to take care of your eyes and posture
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={handleEnable}
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Enable
        </Button>
        <Button
          onClick={handleDismiss}
          size="sm"
          variant="ghost"
          className="text-amber-600 hover:bg-amber-100"
        >
          Later
        </Button>
      </div>
    </div>
  );
}
