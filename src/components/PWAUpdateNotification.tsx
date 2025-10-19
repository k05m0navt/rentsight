'use client';

import { useState, useEffect } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  isServiceWorkerSupported,
  getServiceWorkerRegistration,
  addServiceWorkerEventListener,
} from '@/lib/pwaUtils';

interface PWAUpdateNotificationProps {
  className?: string;
}

export const PWAUpdateNotification = ({ className }: PWAUpdateNotificationProps) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Don't render if service workers aren't supported
  if (!isServiceWorkerSupported()) {
    return null;
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for service worker updates
    const checkForUpdates = async () => {
      if (isServiceWorkerSupported()) {
        try {
          const reg = await getServiceWorkerRegistration();
          if (reg) {
            setRegistration(reg);

            // Check for updates
            const newReg = await reg.update();
            if (newReg.waiting) {
              setUpdateAvailable(true);
            }

            // Listen for updates
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed') {
                    setUpdateAvailable(true);
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error('Failed to check for updates:', error);
        }
      }
    };

    // Only run PWA checks in browser environment
    if (typeof window !== 'undefined') {
      checkForUpdates();

      // Listen for controller change (app updated)
      addServiceWorkerEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  const handleUpdate = async () => {
    if (!registration || !registration.waiting) return;

    setIsUpdating(true);

    try {
      // Send message to waiting service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });

      // The controllerchange event will trigger a reload
      setUpdateAvailable(false);
    } catch (error) {
      console.error('Failed to update app:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
    // Store dismissal in localStorage to not show again for this session
    localStorage.setItem('pwa-update-dismissed', Date.now().toString());
  };

  // Don't show if dismissed recently (within 24 hours)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-update-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const now = Date.now();
      const hoursSinceDismissed = (now - dismissedTime) / (1000 * 60 * 60);

      if (hoursSinceDismissed < 24) {
        setUpdateAvailable(false);
      }
    }
  }, []);

  if (!updateAvailable || isUpdating) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96',
        className,
      )}
    >
      <Card className="bg-background border-border shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-base">App Update Available</CardTitle>
                <CardDescription className="text-sm">
                  A new version of RentSight is ready
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Update now to get the latest features and improvements.
            </p>
            <div className="flex space-x-2">
              <Button onClick={handleUpdate} className="flex-1">
                {isUpdating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Update Now
                  </>
                )}
              </Button>
              <Button variant="secondary" onClick={handleDismiss}>
                Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Hook for managing PWA updates
export const usePWAUpdate = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg) {
            setRegistration(reg);

            // Check for updates
            const newReg = await reg.update();
            if (newReg.waiting) {
              setUpdateAvailable(true);
            }

            // Listen for updates
            reg.addEventListener('updatefound', () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed') {
                    setUpdateAvailable(true);
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error('Failed to check for updates:', error);
        }
      }
    };

    checkForUpdates();
  }, []);

  const updateApp = async () => {
    if (!registration || !registration.waiting) return;

    try {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    } catch (error) {
      console.error('Failed to update app:', error);
    }
  };

  return {
    updateAvailable,
    updateApp,
  };
};
