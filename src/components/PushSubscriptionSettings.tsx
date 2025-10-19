'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { pushNotificationService, type NotificationSettings } from '@/lib/pushNotificationService';

interface PushSubscriptionSettingsProps {
  className?: string;
}

export const PushSubscriptionSettings = ({ className }: PushSubscriptionSettingsProps) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: false,
    propertyUpdates: true,
    rentReminders: true,
    expenseAlerts: true,
    reportReady: true,
    systemUpdates: false,
  });

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        setIsSupported(pushNotificationService.isPushSupported());
        setPermission(await pushNotificationService.hasPermission());
        setIsSubscribed(pushNotificationService.isSubscribed());
        setSettings(pushNotificationService.getSettings());
      } catch (error) {
        console.error('Failed to initialize push notification settings:', error);
      }
    };

    initializeSettings();
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let currentPermission = permission;

      // Request permission if not granted
      if (currentPermission !== 'granted') {
        currentPermission = await pushNotificationService.requestPermission();
        setPermission(currentPermission);

        if (currentPermission !== 'granted') {
          throw new Error('Permission denied for notifications');
        }
      }

      // Subscribe to push notifications
      await pushNotificationService.subscribe();
      setIsSubscribed(true);
      setSuccess('Successfully subscribed to push notifications!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to subscribe to notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await pushNotificationService.unsubscribe();
      setIsSubscribed(false);
      setSuccess('Successfully unsubscribed from push notifications');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to unsubscribe from notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      await pushNotificationService.showTestNotification();
      setSuccess('Test notification sent!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send test notification');
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    pushNotificationService.updateSettings(newSettings);
  };

  const getPermissionStatus = () => {
    switch (permission) {
      case 'granted':
        return { icon: Check, color: 'text-green-500', text: 'Granted' };
      case 'denied':
        return { icon: X, color: 'text-red-500', text: 'Denied' };
      default:
        return { icon: AlertCircle, color: 'text-yellow-500', text: 'Not requested' };
    }
  };

  const permissionStatus = getPermissionStatus();
  const PermissionIcon = permissionStatus.icon;

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-muted-foreground" />
            Push Notifications Not Supported
          </CardTitle>
          <CardDescription>
            Your browser does not support push notifications. Please use a modern browser like
            Chrome, Firefox, or Safari.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Receive notifications about important updates even when the app is closed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permission Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PermissionIcon className={`h-4 w-4 ${permissionStatus.color}`} />
              <span className="text-sm font-medium">Permission Status</span>
            </div>
            <span className={`text-sm ${permissionStatus.color}`}>{permissionStatus.text}</span>
          </div>

          {/* Subscription Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Subscription Status</span>
            <span
              className={`text-sm ${isSubscribed ? 'text-green-500' : 'text-muted-foreground'}`}
            >
              {isSubscribed ? 'Subscribed' : 'Not subscribed'}
            </span>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {!isSubscribed ? (
              <Button onClick={handleSubscribe} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Subscribe to Notifications
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button onClick={handleTestNotification} variant="outline" className="flex-1">
                  Test Notification
                </Button>
                <Button onClick={handleUnsubscribe} disabled={isLoading} variant="destructive">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Unsubscribing...
                    </>
                  ) : (
                    <>
                      <BellOff className="h-4 w-4 mr-2" />
                      Unsubscribe
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Notification Settings */}
          {isSubscribed && (
            <div className="space-y-4 pt-4 border-t">
              <h4 className="text-sm font-medium">Notification Types</h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Property Updates</div>
                    <div className="text-xs text-muted-foreground">
                      New properties, updates to existing properties
                    </div>
                  </div>
                  <Switch
                    checked={settings.propertyUpdates}
                    onCheckedChange={(checked) => handleSettingChange('propertyUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Rent Reminders</div>
                    <div className="text-xs text-muted-foreground">
                      Reminders for upcoming rent payments
                    </div>
                  </div>
                  <Switch
                    checked={settings.rentReminders}
                    onCheckedChange={(checked) => handleSettingChange('rentReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Expense Alerts</div>
                    <div className="text-xs text-muted-foreground">
                      High expense alerts, budget warnings
                    </div>
                  </div>
                  <Switch
                    checked={settings.expenseAlerts}
                    onCheckedChange={(checked) => handleSettingChange('expenseAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Report Ready</div>
                    <div className="text-xs text-muted-foreground">
                      When reports are generated and ready
                    </div>
                  </div>
                  <Switch
                    checked={settings.reportReady}
                    onCheckedChange={(checked) => handleSettingChange('reportReady', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">System Updates</div>
                    <div className="text-xs text-muted-foreground">
                      App updates, maintenance notifications
                    </div>
                  </div>
                  <Switch
                    checked={settings.systemUpdates}
                    onCheckedChange={(checked) => handleSettingChange('systemUpdates', checked)}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
