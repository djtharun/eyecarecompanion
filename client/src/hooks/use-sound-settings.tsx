import { useState, useEffect, useCallback } from 'react';

export type SoundType = 'beep' | 'chime' | 'bell' | 'nature' | 'custom';

export interface SoundSettings {
  soundType: SoundType;
  volume: number; // 0-1
  duration: number; // in milliseconds
  enabled: boolean;
}

const defaultSoundSettings: SoundSettings = {
  soundType: 'chime',
  volume: 0.5,
  duration: 500,
  enabled: false,
};

const STORAGE_KEY = 'eyerest-sound-settings';

export function useSoundSettings() {
  const [settings, setSettings] = useState<SoundSettings>(defaultSoundSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings({ ...defaultSoundSettings, ...parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load sound settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  const updateSettings = useCallback((newSettings: Partial<SoundSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save sound settings:', error);
    }
  }, [settings]);

  const playNotificationSound = useCallback(() => {
    if (!settings.enabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configure sound based on type
      switch (settings.soundType) {
        case 'beep':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          gainNode.gain.setValueAtTime(settings.volume * 0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + settings.duration / 1000);
          break;
        
        case 'chime':
          oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
          oscillator.frequency.setValueAtTime(400, audioContext.currentTime + 0.2);
          gainNode.gain.setValueAtTime(settings.volume * 0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + settings.duration / 1000);
          break;
        
        case 'bell':
          oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
          oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
          gainNode.gain.setValueAtTime(settings.volume * 0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + settings.duration / 1000);
          break;
        
        case 'nature':
          // Simulate a gentle wind sound
          const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * (settings.duration / 1000), audioContext.sampleRate);
          const noiseData = noiseBuffer.getChannelData(0);
          for (let i = 0; i < noiseData.length; i++) {
            noiseData[i] = (Math.random() * 2 - 1) * 0.1 * settings.volume;
          }
          
          const noiseSource = audioContext.createBufferSource();
          const noiseGain = audioContext.createGain();
          const filter = audioContext.createBiquadFilter();
          
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(300, audioContext.currentTime);
          
          noiseSource.buffer = noiseBuffer;
          noiseSource.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(audioContext.destination);
          
          noiseGain.gain.setValueAtTime(settings.volume * 0.5, audioContext.currentTime);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + settings.duration / 1000);
          
          noiseSource.start(audioContext.currentTime);
          noiseSource.stop(audioContext.currentTime + settings.duration / 1000);
          return; // Skip the oscillator for nature sounds
        
        default:
          oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
          gainNode.gain.setValueAtTime(settings.volume * 0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + settings.duration / 1000);
      }
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + settings.duration / 1000);
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }, [settings]);

  const testSound = useCallback(() => {
    playNotificationSound();
  }, [playNotificationSound]);

  return {
    settings,
    updateSettings,
    playNotificationSound,
    testSound,
  };
}