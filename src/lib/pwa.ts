// PWA Utilities for RentSight

import { PWAState, InstallPromptEvent } from '@/types/pwa';

export type { PWAState };

/**
 * Check if the user is currently online
 */
export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
};

/**
 * Check if the app is installed (running in standalone mode)
 */
export const isInstalled = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
};

/**
 * Check if the browser supports PWA installation
 */
export const canInstall = (): boolean => {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
};

/**
 * Get the install prompt event
 */
export const getInstallPrompt = (): Promise<InstallPromptEvent | null> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      resolve(e as InstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Clean up listener after a timeout
    setTimeout(() => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      resolve(null);
    }, 10000); // 10 second timeout
  });
};

/**
 * Check if service worker is supported
 */
export const isServiceWorkerSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
};

/**
 * Register service worker
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!isServiceWorkerSupported()) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered successfully:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
};

/**
 * Get current PWA state
 */
export const getPWAState = async (): Promise<PWAState> => {
  const installPrompt = await getInstallPrompt();

  return {
    isOnline: isOnline(),
    isInstalled: isInstalled(),
    canInstall: canInstall() && installPrompt !== null,
    installPrompt,
    serviceWorkerReady: isServiceWorkerSupported(),
    pushSubscription: null, // Will be set by push notification service
  };
};

/**
 * Show install prompt
 */
export const showInstallPrompt = async (): Promise<boolean> => {
  const installPrompt = await getInstallPrompt();

  if (!installPrompt) {
    console.warn('Install prompt not available');
    return false;
  }

  try {
    await installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
      return true;
    } else {
      console.log('User dismissed the install prompt');
      return false;
    }
  } catch (error) {
    console.error('Error showing install prompt:', error);
    return false;
  }
};

/**
 * Check if app is running in standalone mode
 */
export const isStandaloneMode = (): boolean => {
  if (typeof window === 'undefined') return false;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Get app installation status
 */
export const getAppInstallationStatus = (): 'installed' | 'installable' | 'not-supported' => {
  if (isInstalled()) {
    return 'installed';
  }

  if (canInstall()) {
    return 'installable';
  }

  return 'not-supported';
};
