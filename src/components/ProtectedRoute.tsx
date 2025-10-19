'use client';

/**
 * ProtectedRoute Component
 *
 * Client-side authentication guard that prevents protected content from rendering
 * until authentication is confirmed. This prevents the flash of protected content
 * before the server-side redirect takes effect.
 */

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // If not loading and no user, redirect to login immediately
    if (!loading && !user && !hasRedirected) {
      setHasRedirected(true);

      // Set page title to indicate redirecting
      document.title = 'Redirecting... - RentSight';

      // Get the current pathname to preserve it for redirect after login
      const currentPath = window.location.pathname;
      const redirectTo =
        currentPath !== '/login' ? `?redirectTo=${encodeURIComponent(currentPath)}` : '';

      // Use window.location.href to force a full page navigation and trigger middleware
      window.location.href = `/login${redirectTo}`;
    }
  }, [user, loading, hasRedirected]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-sm text-muted dark:text-muted-dark">Loading...</div>
      </div>
    );
  }

  // If no user, don't render anything (redirect will happen immediately)
  if (!user) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
