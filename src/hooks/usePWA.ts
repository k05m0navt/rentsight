import { useState, useEffect } from 'react';
import { getInstallPrompt, registerServiceWorker, getPWAState, PWAState } from '@/lib/pwa';
import { installService, trackInstallEvent } from '@/lib/installService';
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
        // Get initial PWA state
        const state = await getPWAState();
        setPwaState(state);

        // Register service worker
        const registration = await registerServiceWorker();
        if (registration) {
          setPwaState((prev) => ({ ...prev, serviceWorkerReady: true }));
        }

        // Set up event listeners
        const handleOnline = () => setPwaState((prev) => ({ ...prev, isOnline: true }));
        const handleOffline = () => setPwaState((prev) => ({ ...prev, isOnline: false }));

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Listen for beforeinstallprompt
        const handleBeforeInstallPrompt = (e: Event) => {
          e.preventDefault();
          setPwaState((prev) => ({ ...prev, installPrompt: e as InstallPromptEvent }));
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Listen for appinstalled
        const handleAppInstalled = () => {
          setPwaState((prev) => ({ ...prev, isInstalled: true, installPrompt: null }));
        };

        window.addEventListener('appinstalled', handleAppInstalled);

        setLoading(false);

        // Cleanup function
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
          window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
          window.removeEventListener('appinstalled', handleAppInstalled);
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

  const refreshInstallPrompt = async () => {
    try {
      const prompt = await getInstallPrompt();
      setPwaState((prev) => ({ ...prev, installPrompt: prompt }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh install prompt');
    }
  };

  return {
    ...pwaState,
    loading,
    error,
    installApp,
    refreshInstallPrompt,
    // Convenience getters
    isOnline: pwaState.isOnline,
    isInstalled: pwaState.isInstalled,
    canInstall: pwaState.canInstall,
    installPrompt: pwaState.installPrompt,
    serviceWorkerReady: pwaState.serviceWorkerReady,
  };
};
