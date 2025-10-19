/**
 * PWA Utility Functions
 * 
 * Provides safe access to PWA APIs with proper error handling
 * to prevent JavaScript errors in environments where PWA features aren't supported.
 */

/**
 * Safely check if service worker is supported
 */
export const isServiceWorkerSupported = (): boolean => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
};

/**
 * Safely get service worker registration
 */
export const getServiceWorkerRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    return null;
  }

  try {
    return await navigator.serviceWorker.getRegistration();
  } catch (error) {
    console.error('Error getting service worker registration:', error);
    return null;
  }
};

/**
 * Safely add event listener to service worker
 */
export const addServiceWorkerEventListener = (
  event: string,
  listener: EventListener
): void => {
  if (!isServiceWorkerSupported()) {
    return;
  }

  try {
    navigator.serviceWorker.addEventListener(event, listener);
  } catch (error) {
    console.error(`Error adding service worker event listener for ${event}:`, error);
  }
};

/**
 * Safely check if push notifications are supported
 */
export const isPushNotificationSupported = (): boolean => {
  return (
    isServiceWorkerSupported() &&
    'PushManager' in window &&
    'Notification' in window
  );
};

/**
 * Safely check if PWA is installable
 */
export const isPWAInstallable = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
};

/**
 * Safely get notification permission
 */
export const getNotificationPermission = (): NotificationPermission | null => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return null;
  }

  return Notification.permission;
};

/**
 * Safely request notification permission
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission | null> => {
  if (!isPushNotificationSupported()) {
    return null;
  }

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};
