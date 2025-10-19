'use client';

import { useState, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface InstallPromptProps {
  onDismiss?: () => void;
  className?: string;
}

export const InstallPrompt = ({ onDismiss, className }: InstallPromptProps) => {
  const { canInstall, isInstalled, installPrompt, installApp, loading } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Show prompt if app can be installed and is not already installed
    if (canInstall && !isInstalled && installPrompt) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [canInstall, isInstalled, installPrompt]);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        setIsVisible(false);
        onDismiss?.();
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || loading) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 ${className}`}
    >
      <div className="bg-background border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Download className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Install RentSight</h3>
              <p className="text-sm text-muted-foreground">Get the app on your device</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Smartphone className="h-4 w-4" />
              <span>Mobile</span>
            </div>
            <div className="flex items-center space-x-1">
              <Monitor className="h-4 w-4" />
              <span>Desktop</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleInstall} disabled={isInstalling} className="flex-1">
              {isInstalling ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={handleDismiss}>
              Not Now
            </Button>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Install RentSight for quick access to your rental analytics dashboard
        </div>
      </div>
    </div>
  );
};
