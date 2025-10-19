// Push Notification Service for RentSight PWA

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
}

interface NotificationSettings {
  enabled: boolean;
  propertyUpdates: boolean;
  rentReminders: boolean;
  expenseAlerts: boolean;
  reportReady: boolean;
  systemUpdates: boolean;
}

class PushNotificationService {
  private subscription: PushSubscription | null = null;
  private settings: NotificationSettings = {
    enabled: false,
    propertyUpdates: true,
    rentReminders: true,
    expenseAlerts: true,
    reportReady: true,
    systemUpdates: false,
  };
  private isSupported = false;
  private vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

  constructor() {
    this.isSupported = this.checkSupport();
    this.loadSettings();
    this.initializeServiceWorker();
  }

  private checkSupport(): boolean {
    return (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  private async initializeServiceWorker(): Promise<void> {
    if (!this.isSupported) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      this.subscription = await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to initialize service worker for push notifications:', error);
    }
  }

  private loadSettings(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem('pushNotificationSettings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Failed to load push notification settings:', error);
    }
  }

  private saveSettings(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('pushNotificationSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Failed to save push notification settings:', error);
    }
  }

  /**
   * Check if push notifications are supported
   */
  isPushSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Check if user has granted permission
   */
  async hasPermission(): Promise<boolean> {
    if (!this.isSupported) return false;
    return Notification.permission === 'granted';
  }

  /**
   * Check if user is subscribed to push notifications
   */
  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  /**
   * Request permission for push notifications
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      throw error;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription> {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    if (!this.vapidPublicKey) {
      throw new Error('VAPID public key is not configured');
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      this.subscription = subscription;
      this.settings.enabled = true;
      this.saveSettings();

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      console.log('Successfully subscribed to push notifications');
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) return false;

    try {
      const result = await this.subscription.unsubscribe();
      if (result) {
        this.subscription = null;
        this.settings.enabled = false;
        this.saveSettings();

        // Remove subscription from server
        await this.removeSubscriptionFromServer();
      }

      console.log('Successfully unsubscribed from push notifications');
      return result;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      throw error;
    }
  }

  /**
   * Send subscription to server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
              auth: this.arrayBufferToBase64(subscription.getKey('auth')!),
            },
          },
          settings: this.settings,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send subscription to server: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
      throw error;
    }
  }

  /**
   * Remove subscription from server
   */
  private async removeSubscriptionFromServer(): Promise<void> {
    try {
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: this.subscription?.endpoint,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to remove subscription from server: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to remove subscription from server:', error);
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();

    // Update server with new settings if subscribed
    if (this.isSubscribed()) {
      this.updateServerSettings();
    }
  }

  /**
   * Get current notification settings
   */
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  /**
   * Update settings on server
   */
  private async updateServerSettings(): Promise<void> {
    try {
      const response = await fetch('/api/push/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: this.subscription?.endpoint,
          settings: this.settings,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update server settings: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to update server settings:', error);
    }
  }

  /**
   * Show a local notification
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported || !(await this.hasPermission())) {
      console.warn('Cannot show notification: not supported or permission not granted');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        badge: payload.badge || '/icons/icon-72x72.png',
        tag: payload.tag,
        data: payload.data,
        actions: payload.actions,
        requireInteraction: payload.requireInteraction,
        silent: payload.silent,
        timestamp: payload.timestamp || Date.now(),
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
      throw error;
    }
  }

  /**
   * Show a test notification
   */
  async showTestNotification(): Promise<void> {
    await this.showNotification({
      title: 'RentSight Test',
      body: 'Push notifications are working correctly!',
      tag: 'test',
      data: { type: 'test' },
    });
  }

  /**
   * Handle notification click
   */
  handleNotificationClick(event: NotificationEvent): void {
    event.notification.close();

    const data = event.notification.data;
    if (data?.url) {
      // Open the app to the specified URL
      event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(self.location.origin) && 'focus' in client) {
              return client.focus().then(() => {
                if (data.url) {
                  return client.navigate(data.url);
                }
              });
            }
          }

          // Open new window if app is not open
          if (clients.openWindow) {
            return clients.openWindow(data.url || '/');
          }
        }),
      );
    }
  }

  /**
   * Utility: Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  /**
   * Utility: Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Get subscription data for debugging
   */
  getSubscriptionData(): PushSubscriptionData | null {
    if (!this.subscription) return null;

    return {
      endpoint: this.subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64(this.subscription.getKey('p256dh')!),
        auth: this.arrayBufferToBase64(this.subscription.getKey('auth')!),
      },
    };
  }
}

// Create singleton instance
export const pushNotificationService = new PushNotificationService();

// Export convenience functions
export const isPushSupported = () => pushNotificationService.isPushSupported();
export const hasPermission = () => pushNotificationService.hasPermission();
export const requestPermission = () => pushNotificationService.requestPermission();
export const subscribe = () => pushNotificationService.subscribe();
export const unsubscribe = () => pushNotificationService.unsubscribe();
export const isSubscribed = () => pushNotificationService.isSubscribed();
export const updateSettings = (settings: Partial<NotificationSettings>) =>
  pushNotificationService.updateSettings(settings);
export const getSettings = () => pushNotificationService.getSettings();
export const showNotification = (payload: NotificationPayload) =>
  pushNotificationService.showNotification(payload);
export const showTestNotification = () => pushNotificationService.showTestNotification();
export const handleNotificationClick = (event: NotificationEvent) =>
  pushNotificationService.handleNotificationClick(event);
