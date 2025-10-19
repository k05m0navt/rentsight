'use client';

import { useState } from 'react';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/button';
import { Download, Check, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InstallButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export const InstallButton = ({
  variant = 'primary',
  size = 'default',
  className,
  showIcon = true,
  children,
}: InstallButtonProps) => {
  const { canInstall, isInstalled, installApp } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (!canInstall || isInstalled) return;

    setIsInstalling(true);
    try {
      await installApp();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't render if app is already installed or can't be installed
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleInstall}
      disabled={isInstalling}
      className={cn(className)}
    >
      {isInstalling ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Installing...
        </>
      ) : (
        <>
          {showIcon && <Download className="h-4 w-4 mr-2" />}
          {children || 'Install App'}
        </>
      )}
    </Button>
  );
};

// Compact install button for headers/navbars
export const InstallButtonCompact = ({ className }: { className?: string }) => {
  const { canInstall, isInstalled, installApp } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    if (!canInstall || isInstalled) return;

    setIsInstalling(true);
    try {
      await installApp();
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't render if app is already installed or can't be installed
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleInstall}
      disabled={isInstalling}
      className={cn('h-8 w-8 p-0', className)}
      title="Install RentSight App"
    >
      {isInstalling ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : (
        <Smartphone className="h-4 w-4" />
      )}
    </Button>
  );
};

// Status indicator showing install state
export const InstallStatus = ({ className }: { className?: string }) => {
  const { canInstall, isInstalled } = usePWA();

  if (isInstalled) {
    return (
      <div className={cn('flex items-center text-sm text-green-600', className)}>
        <Check className="h-4 w-4 mr-1" />
        App Installed
      </div>
    );
  }

  if (canInstall) {
    return (
      <div className={cn('flex items-center text-sm text-orange-600', className)}>
        <Download className="h-4 w-4 mr-1" />
        Install Available
      </div>
    );
  }

  return null;
};
