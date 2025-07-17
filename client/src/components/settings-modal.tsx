import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/use-settings';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, updateSetting, resetSettings } = useSettings();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Eye Timer Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Eye Rest Timer</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  Reminder Interval
                </Label>
                <div className="flex items-center space-x-3">
                  <Slider
                    value={[settings.eyeInterval]}
                    onValueChange={(value) => updateSetting('eyeInterval', value[0])}
                    min={1}
                    max={60}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-900 w-16">
                    {settings.eyeInterval} min
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700">Enable notifications</Label>
                <Switch
                  checked={settings.eyeNotifications}
                  onCheckedChange={(checked) => updateSetting('eyeNotifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* Posture Timer Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Posture Timer</h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm text-gray-700 mb-2 block">
                  Reminder Interval
                </Label>
                <div className="flex items-center space-x-3">
                  <Slider
                    value={[settings.postureInterval]}
                    onValueChange={(value) => updateSetting('postureInterval', value[0])}
                    min={1}
                    max={120}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium text-gray-900 w-16">
                    {settings.postureInterval} min
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700">Enable notifications</Label>
                <Switch
                  checked={settings.postureNotifications}
                  onCheckedChange={(checked) => updateSetting('postureNotifications', checked)}
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700">Sound alerts</Label>
                <Switch
                  checked={settings.soundAlerts}
                  onCheckedChange={(checked) => updateSetting('soundAlerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm text-gray-700">Auto-start timers</Label>
                <Switch
                  checked={settings.autoStart}
                  onCheckedChange={(checked) => updateSetting('autoStart', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            onClick={resetSettings}
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
