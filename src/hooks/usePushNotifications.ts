'use client';

import { useState, useEffect, useCallback } from 'react';
import { pushNotificationService, type NotificationSettings } from '@/lib/pushNotificationService';
import { getNotificationTemplate, type NotificationContext } from '@/lib/notificationTemplates';

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  settings: NotificationSettings;
}

export const usePushNotifications = () => {
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
    isLoading: false,
    error: null,
    settings: {
      enabled: false,
      propertyUpdates: true,
      rentReminders: true,
      expenseAlerts: true,
      reportReady: true,
      systemUpdates: false,
    },
  });

  const initialize = useCallback(async () => {
    try {
      const isSupported = pushNotificationService.isPushSupported();
      const permission = await pushNotificationService.hasPermission();
      const isSubscribed = pushNotificationService.isSubscribed();
      const settings = pushNotificationService.getSettings();

      setState((prev) => ({
        ...prev,
        isSupported,
        permission,
        isSubscribed,
        settings,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize',
      }));
    }
  }, []);

  const subscribe = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await pushNotificationService.subscribe();
      await initialize();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to subscribe',
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [initialize]);

  const unsubscribe = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await pushNotificationService.unsubscribe();
      await initialize();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to unsubscribe',
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [initialize]);

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    pushNotificationService.updateSettings(newSettings);
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  const showTestNotification = useCallback(async () => {
    try {
      await pushNotificationService.showTestNotification();
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to show test notification',
      }));
    }
  }, []);

  const sendNotification = useCallback(async (
    type: string,
    context: NotificationContext = {}
  ) => {
    try {
      const template = getNotificationTemplate(type, context);
      await pushNotificationService.showNotification(template);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send notification',
      }));
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const permission = await pushNotificationService.requestPermission();
      setState((prev) => ({ ...prev, permission }));
      return permission;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to request permission',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    ...state,
    subscribe,
    unsubscribe,
    updateSettings,
    showTestNotification,
    sendNotification,
    requestPermission,
    clearError,
    initialize,
  };
};

// Hook for sending specific notification types
export const useNotificationSender = () => {
  const sendPropertyUpdate = useCallback(async (context: NotificationContext) => {
    const template = getNotificationTemplate('propertyUpdate', context);
    await pushNotificationService.showNotification(template);
  }, []);

  const sendRentReminder = useCallback(async (context: NotificationContext) => {
    const template = getNotificationTemplate('rentReminder', context);
    await pushNotificationService.showNotification(template);
  }, []);

  const sendExpenseAlert = useCallback(async (context: NotificationContext) => {
    const template = getNotificationTemplate('expenseAlert', context);
    await pushNotificationService.showNotification(template);
  }, []);

  const sendReportReady = useCallback(async (context: NotificationContext) => {
    const template = getNotificationTemplate('reportReady', context);
    await pushNotificationService.showNotification(template);
  }, []);

  const sendSystemUpdate = useCallback(async (context: NotificationContext) => {
    const template = getNotificationTemplate('systemUpdate', context);
    await pushNotificationService.showNotification(template);
  }, []);

  const sendWelcome = useCallback(async (context: NotificationContext) => {
    const template = getNotificationTemplate('welcome', context);
    await pushNotificationService.showNotification(template);
  }, []);

  return {
    sendPropertyUpdate,
    sendRentReminder,
    sendExpenseAlert,
    sendReportReady,
    sendSystemUpdate,
    sendWelcome,
  };
};

// Hook for notification analytics
export const useNotificationAnalytics = () => {
  const trackNotificationSent = useCallback(async (type: string, success: boolean) => {
    try {
      await fetch('/api/analytics/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sent',
          type,
          success,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error('Failed to track notification analytics:', error);
    }
  }, []);

  const trackNotificationClick = useCallback(async (type: string, action: string) => {
    try {
      await fetch('/api/analytics/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'click',
          type,
          clickAction: action,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error('Failed to track notification click:', error);
    }
  }, []);

  const trackPermissionRequest = useCallback(async (permission: NotificationPermission) => {
    try {
      await fetch('/api/analytics/notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'permission',
          permission,
          timestamp: Date.now(),
        }),
      });
    } catch (error) {
      console.error('Failed to track permission request:', error);
    }
  }, []);

  return {
    trackNotificationSent,
    trackNotificationClick,
    trackPermissionRequest,
  };
};
