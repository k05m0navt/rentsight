'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator = ({ className }: OfflineIndicatorProps) => {
  const [showIndicator, setShowIndicator] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline' | 'reconnecting'>(
    'online',
  );

  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus('reconnecting');

      // Show reconnecting status briefly
      setTimeout(() => {
        setConnectionStatus('online');
        setShowIndicator(true);

        // Hide indicator after showing online status
        setTimeout(() => {
          setShowIndicator(false);
        }, 3000);
      }, 1000);
    };

    const handleOffline = () => {
      setConnectionStatus('offline');
      setShowIndicator(true);
    };

    // Set initial state
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');
    setShowIndicator(!navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator) {
    return null;
  }

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'online':
        return {
          icon: CheckCircle,
          text: 'Back online',
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          textColor: 'text-success',
          iconColor: 'text-success',
        };
      case 'offline':
        return {
          icon: WifiOff,
          text: 'You&apos;re offline',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          textColor: 'text-warning',
          iconColor: 'text-warning',
        };
      case 'reconnecting':
        return {
          icon: Wifi,
          text: 'Reconnecting...',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary',
          iconColor: 'text-primary animate-pulse',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out',
        'px-4 py-2 rounded-lg border shadow-lg backdrop-blur-sm',
        config.bgColor,
        config.borderColor,
        className,
      )}
    >
      <div className="flex items-center space-x-2">
        <Icon className={cn('h-4 w-4', config.iconColor)} />
        <span className={cn('text-sm font-medium', config.textColor)}>{config.text}</span>
      </div>
    </div>
  );
};

// Compact version for mobile
export const OfflineIndicatorCompact = ({ className }: OfflineIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-20 left-4 right-4 z-50',
        'bg-warning/90 text-warning-foreground',
        'px-3 py-2 rounded-lg text-center text-sm font-medium',
        'backdrop-blur-sm border border-warning/20',
        className,
      )}
    >
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span>Offline - Some features may be limited</span>
      </div>
    </div>
  );
};

// Status badge for headers/navbars
export const OfflineStatusBadge = ({ className }: OfflineIndicatorProps) => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center space-x-1 px-2 py-1 rounded-md',
        'bg-warning/10 border border-warning/20',
        'text-warning text-xs font-medium',
        className,
      )}
    >
      <WifiOff className="h-3 w-3" />
      <span>Offline</span>
    </div>
  );
};
