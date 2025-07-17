import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSoundSettings, type SoundType } from '@/hooks/use-sound-settings';
import { Volume2, Play } from 'lucide-react';

interface SoundSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SoundSettingsModal({ open, onOpenChange }: SoundSettingsModalProps) {
  const { settings, updateSettings, testSound } = useSoundSettings();

  const soundOptions: { value: SoundType; label: string; description: string }[] = [
    {
      value: 'beep',
      label: 'Simple Beep',
      description: 'A classic notification beep'
    },
    {
      value: 'chime',
      label: 'Gentle Chime',
      description: 'Soft descending tones'
    },
    {
      value: 'bell',
      label: 'Pleasant Bell',
      description: 'Harmonic bell sound'
    },
    {
      value: 'nature',
      label: 'Nature Sound',
      description: 'Gentle wind-like sound'
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Volume2 className="w-5 h-5" />
            <span>Sound Settings</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enable Sound */}
          <div className="flex items-center justify-between">
            <Label className="text-sm text-gray-700">Enable notification sounds</Label>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => updateSettings({ enabled: checked })}
            />
          </div>

          {/* Sound Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm text-gray-700">Sound Type</Label>
            <Select
              value={settings.soundType}
              onValueChange={(value: SoundType) => updateSettings({ soundType: value })}
              disabled={!settings.enabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a sound" />
              </SelectTrigger>
              <SelectContent>
                {soundOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Volume Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-700">Volume</Label>
              <span className="text-sm text-gray-500">{Math.round(settings.volume * 100)}%</span>
            </div>
            <Slider
              value={[settings.volume]}
              onValueChange={(value) => updateSettings({ volume: value[0] })}
              min={0}
              max={1}
              step={0.1}
              disabled={!settings.enabled}
              className="flex-1"
            />
          </div>

          {/* Duration Control */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-gray-700">Duration</Label>
              <span className="text-sm text-gray-500">{settings.duration}ms</span>
            </div>
            <Slider
              value={[settings.duration]}
              onValueChange={(value) => updateSettings({ duration: value[0] })}
              min={200}
              max={2000}
              step={100}
              disabled={!settings.enabled}
              className="flex-1"
            />
          </div>

          {/* Test Sound Button */}
          <div className="pt-2">
            <Button
              onClick={testSound}
              disabled={!settings.enabled}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Test Sound</span>
            </Button>
          </div>

          {/* Sound Tips */}
          <div className="bg-blue-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-1">Sound Tips</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Choose a sound that's noticeable but not jarring</li>
              <li>• Consider your environment (office, home, etc.)</li>
              <li>• Test different volumes to find what works best</li>
              <li>• Nature sounds are often less disruptive</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            onClick={() => updateSettings({
              soundType: 'chime',
              volume: 0.5,
              duration: 500,
              enabled: false,
            })}
            variant="outline"
          >
            Reset to Default
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}