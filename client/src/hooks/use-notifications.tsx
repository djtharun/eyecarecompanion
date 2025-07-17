import { useState, useEffect, useCallback } from 'react';
import { useSoundSettings } from './use-sound-settings';

export interface NotificationSettings {
  permission: NotificationPermission;
  isSupported: boolean;
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    permission: 'default',
    isSupported: false,
  });
  
  const { playNotificationSound } = useSoundSettings();

  useEffect(() => {
    if ('Notification' in window) {
      setSettings({
        permission: Notification.permission,
        isSupported: true,
      });
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    setSettings(prev => ({ ...prev, permission }));
    return permission;
  }, []);

  const showNotification = useCallback((
    title: string,
    options?: NotificationOptions
  ): Notification | null => {
    if (settings.permission !== 'granted' || !settings.isSupported) {
      return null;
    }

    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }, [settings.permission, settings.isSupported]);



  const showEyeBreakNotification = useCallback((withSound = false) => {
    if (withSound) {
      playNotificationSound();
    }
    
    return showNotification('Time for an eye break! 👁️', {
      body: 'Look at something 20 feet away for 20 seconds to rest your eyes.',
      tag: 'eye-break',
    });
  }, [showNotification, playNotificationSound]);

  const showPostureNotification = useCallback((withSound = false) => {
    if (withSound) {
      playNotificationSound();
    }
    
    return showNotification('Posture check time! 🧘', {
      body: 'Take a moment to stretch and check your posture.',
      tag: 'posture-check',
    });
  }, [showNotification, playNotificationSound]);

  return {
    settings,
    requestPermission,
    showNotification,
    showEyeBreakNotification,
    showPostureNotification,
  };
}
