/**
 * AuthGuard Component
 *
 * Client-side authentication guard that prevents flash of protected content
 * Shows loading state while checking auth, redirects if not authenticated
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      console.log('[AuthGuard] Checking auth:', {
        user: user?.email || 'none',
        error: error?.message,
      });

      if (!user) {
        console.log('[AuthGuard] Not authenticated, redirecting to /login');
        // Use window.location for hard redirect to avoid client-side state issues
        window.location.href = '/login';
        return;
      }

      setIsAuthenticated(true);
    };

    checkAuth();

    // Listen for auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[AuthGuard] Auth state changed:', event);

      if (!session) {
        console.log('[AuthGuard] Session lost, redirecting to /login');
        window.location.href = '/login';
      } else {
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Show loading state while checking
  if (isAuthenticated === null) {
    return (
      fallback || (
        <div className="flex flex-col gap-6 p-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      )
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}
