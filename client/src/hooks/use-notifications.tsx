import { useState, useEffect, useCallback } from 'react';

export interface NotificationSettings {
  permission: NotificationPermission;
  isSupported: boolean;
}

export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>({
    permission: 'default',
    isSupported: false,
  });

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

  const playNotificationSound = useCallback(() => {
    // Create a simple notification sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, []);

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
    playNotificationSound,
  };
}
