import { useState, useEffect } from 'react';
import { registerServiceWorker, PWAState } from '@/lib/pwa';
import { installService, trackInstallEvent, subscribeToInstallPrompt } from '@/lib/installService';
import { InstallPromptEvent } from '@/types/pwa';

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isOnline: true,
    isInstalled: false,
    canInstall: false,
    installPrompt: null,
    serviceWorkerReady: false,
    pushSubscription: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializePWA = async () => {
      try {
        setLoading(true);

        // Initialize basic state
        setPwaState((prev) => ({
          ...prev,
          isOnline: navigator.onLine,
          isInstalled: installService.isInstalled(),
          serviceWorkerReady: 'serviceWorker' in navigator,
        }));

        // Register service worker
        const registration = await registerServiceWorker();
        if (registration) {
          setPwaState((prev) => ({ ...prev, serviceWorkerReady: true }));
        }

        // Subscribe to install prompt changes
        const unsubscribeInstallPrompt = subscribeToInstallPrompt((installPrompt) => {
          setPwaState((prev) => ({
            ...prev,
            installPrompt,
            canInstall: installPrompt !== null,
          }));
        });

        // Set up event listeners
        const handleOnline = () => setPwaState((prev) => ({ ...prev, isOnline: true }));
        const handleOffline = () => setPwaState((prev) => ({ ...prev, isOnline: false }));

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        setLoading(false);

        // Cleanup function
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          unsubscribeInstallPrompt();
        };
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize PWA');
        setLoading(false);
      }
    };

    initializePWA();
  }, []);

  const installApp = async (): Promise<boolean> => {
    try {
      trackInstallEvent('prompt_accepted');
      const result = await installService.showInstallPrompt();
      if (result.outcome === 'accepted') {
        setPwaState((prev) => ({ ...prev, isInstalled: true, installPrompt: null }));
        trackInstallEvent('app_installed');
        return true;
      } else {
        trackInstallEvent('prompt_dismissed');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to install app');
      return false;
    }
  };

  return {
    ...pwaState,
    loading,
    error,
    installApp,
    // Convenience getters
    isOnline: pwaState.isOnline,
    isInstalled: pwaState.isInstalled,
    canInstall: pwaState.canInstall,
    installPrompt: pwaState.installPrompt,
    serviceWorkerReady: pwaState.serviceWorkerReady,
  };
};
