import { useState, useEffect, useCallback } from 'react';

export interface AppSettings {
  eyeInterval: number; // in minutes
  postureInterval: number; // in minutes
  eyeNotifications: boolean;
  postureNotifications: boolean;
  soundAlerts: boolean;
  autoStart: boolean;
}

const defaultSettings: AppSettings = {
  eyeInterval: 20,
  postureInterval: 45,
  eyeNotifications: true,
  postureNotifications: true,
  soundAlerts: false,
  autoStart: true,
};

const STORAGE_KEY = 'eyerest-settings';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load settings from localStorage:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const saveSettings = useCallback((newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save settings to localStorage:', error);
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    saveSettings({ [key]: value });
  }, [saveSettings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
    } catch (error) {
      console.error('Failed to reset settings in localStorage:', error);
    }
  }, []);

  return {
    settings,
    updateSetting,
    saveSettings,
    resetSettings,
  };
}
