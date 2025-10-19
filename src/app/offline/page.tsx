/**
 * Offline Fallback Page
 *
 * Displayed when users try to access pages while offline
 * Provides information about offline capabilities and cached data
 */

'use client';

import { WifiOff, Database, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Offline Icon */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="h-8 w-8 text-warning" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">You&apos;re Offline</h1>
          <p className="text-muted-foreground">
            Don&apos;t worry, you can still access your cached data
          </p>
        </div>

        {/* Offline Features Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-success" />
              <span>Available Offline</span>
            </CardTitle>
            <CardDescription>These features work without an internet connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">View cached properties</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">View cached rent entries</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">View cached expense entries</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm">Create new entries (will sync when online)</span>
            </div>
          </CardContent>
        </Card>

        {/* Sync Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>Sync Status</span>
            </CardTitle>
            <CardDescription>
              Your data will automatically sync when you&apos;re back online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last sync:</span>
                <span className="text-sm font-medium">When you were last online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending changes:</span>
                <span className="text-sm font-medium">Will sync automatically</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-3">
          <Button onClick={handleRefresh} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button onClick={handleGoHome} variant="secondary" className="w-full">
            Go to Dashboard
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Check your internet connection and try again. Your data is safe and will sync when
            you&apos;re back online.
          </p>
        </div>
      </div>
    </div>
  );
}
