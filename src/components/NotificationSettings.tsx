'use client';

import { useState, useEffect } from 'react';
import { Bell, Settings, Volume2, VolumeX, Clock, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FormSelect } from '@/components/forms/FormSelect';
import { pushNotificationService, type NotificationSettings } from '@/lib/pushNotificationService';

interface NotificationPreferences {
  enabled: boolean;
  sound: boolean;
  volume: number;
  quietHours: boolean;
  quietStart: string;
  quietEnd: string;
  frequency: 'immediate' | 'hourly' | 'daily';
  digest: boolean;
}

interface NotificationSettingsProps {
  className?: string;
}

export const NotificationSettings = ({ className }: NotificationSettingsProps) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    enabled: true,
    sound: true,
    volume: 70,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
    frequency: 'immediate',
    digest: false,
  });

  const [pushSettings, setPushSettings] = useState<NotificationSettings>({
    enabled: false,
    propertyUpdates: true,
    rentReminders: true,
    expenseAlerts: true,
    reportReady: true,
    systemUpdates: false,
  });

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setIsSupported(pushNotificationService.isPushSupported());
        setPushSettings(pushNotificationService.getSettings());
        
        // Load user preferences from localStorage
        const savedPreferences = localStorage.getItem('notificationPreferences');
        if (savedPreferences) {
          setPreferences({ ...preferences, ...JSON.parse(savedPreferences) });
        }
      } catch (error) {
        console.error('Failed to initialize notification settings:', error);
      }
    };

    initializeSettings();
  }, []);

  const savePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    localStorage.setItem('notificationPreferences', JSON.stringify(updated));
  };

  const handlePushSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...pushSettings, [key]: value };
    setPushSettings(newSettings);
    pushNotificationService.updateSettings(newSettings);
  };

  const handleVolumeChange = (value: number[]) => {
    savePreferences({ volume: value[0] });
  };

  const handleQuietHoursToggle = (enabled: boolean) => {
    savePreferences({ quietHours: enabled });
  };

  const handleTimeChange = (type: 'start' | 'end', time: string) => {
    savePreferences({ [`quiet${type.charAt(0).toUpperCase() + type.slice(1)}`]: time });
  };

  const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const frequency = e.target.value;
    savePreferences({ frequency: frequency as NotificationPreferences['frequency'] });
  };

  const handleDigestToggle = (enabled: boolean) => {
    savePreferences({ digest: enabled });
  };

  const handleTestNotification = async () => {
    try {
      await pushNotificationService.showTestNotification();
    } catch (error) {
      console.error('Failed to send test notification:', error);
    }
  };

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser does not support notifications. Please use a modern browser.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sound Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {preferences.sound ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  <Label htmlFor="sound-toggle">Sound</Label>
                </div>
                <Switch
                  id="sound-toggle"
                  checked={preferences.sound}
                  onCheckedChange={(checked) => savePreferences({ sound: checked })}
                />
              </div>

              {preferences.sound && (
                <div className="space-y-2">
                  <Label>Volume: {preferences.volume}%</Label>
                  <Slider
                    value={[preferences.volume]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Frequency Settings */}
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <FormSelect
                value={preferences.frequency}
                onChange={handleFrequencyChange}
                options={[
                  { value: 'immediate', label: 'Immediate' },
                  { value: 'hourly', label: 'Hourly Digest' },
                  { value: 'daily', label: 'Daily Digest' },
                ]}
                className="w-full"
              />
            </div>

            {/* Digest Settings */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="digest-toggle">Digest Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Group multiple notifications into a single message
                </p>
              </div>
              <Switch
                id="digest-toggle"
                checked={preferences.digest}
                onCheckedChange={handleDigestToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Quiet Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Quiet Hours
            </CardTitle>
            <CardDescription>
              Set times when you don't want to receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours-toggle">Enable Quiet Hours</Label>
              <Switch
                id="quiet-hours-toggle"
                checked={preferences.quietHours}
                onCheckedChange={handleQuietHoursToggle}
              />
            </div>

            {preferences.quietHours && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <input
                    type="time"
                    value={preferences.quietStart}
                    onChange={(e) => handleTimeChange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <input
                    type="time"
                    value={preferences.quietEnd}
                    onChange={(e) => handleTimeChange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Types
            </CardTitle>
            <CardDescription>
              Choose which types of notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Property Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    New properties, updates to existing properties
                  </p>
                </div>
                <Switch
                  checked={pushSettings.propertyUpdates}
                  onCheckedChange={(checked) => handlePushSettingChange('propertyUpdates', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Rent Reminders</Label>
                  <p className="text-xs text-muted-foreground">
                    Reminders for upcoming rent payments
                  </p>
                </div>
                <Switch
                  checked={pushSettings.rentReminders}
                  onCheckedChange={(checked) => handlePushSettingChange('rentReminders', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Expense Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    High expense alerts, budget warnings
                  </p>
                </div>
                <Switch
                  checked={pushSettings.expenseAlerts}
                  onCheckedChange={(checked) => handlePushSettingChange('expenseAlerts', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Report Ready</Label>
                  <p className="text-xs text-muted-foreground">
                    When reports are generated and ready
                  </p>
                </div>
                <Switch
                  checked={pushSettings.reportReady}
                  onCheckedChange={(checked) => handlePushSettingChange('reportReady', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>System Updates</Label>
                  <p className="text-xs text-muted-foreground">
                    App updates, maintenance notifications
                  </p>
                </div>
                <Switch
                  checked={pushSettings.systemUpdates}
                  onCheckedChange={(checked) => handlePushSettingChange('systemUpdates', checked)}
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleTestNotification} variant="outline" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Send Test Notification
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
