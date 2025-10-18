/**
 * useAuth Hook
 *
 * Centralized authentication state management
 * Provides user state, loading state, and auth actions
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check auth state
  const checkAuth = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log('[useAuth] Auth checked:', {
      user: user ? user.email : 'null',
      pathname,
      error: error?.message,
    });

    setUser(user);
    setLoading(false);

    return user;
  }, [pathname]);

  // Initialize auth state
  useEffect(() => {
    const supabase = createClient();

    // Check initial auth state
    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[useAuth] Auth changed:', event, session?.user?.email || 'null');

      setUser(session?.user ?? null);
      setLoading(false);

      // Refresh router on auth changes
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [checkAuth, router]);

  // Logout function
  const logout = useCallback(async () => {
    console.log('[useAuth] Logout initiated');

    try {
      // Call server logout endpoint
      await fetch('/auth/logout', {
        method: 'POST',
      });

      // Update local state immediately
      setUser(null);

      // Full page redirect to clear all state
      window.location.href = '/login';
    } catch (error) {
      console.error('[useAuth] Logout failed:', error);
      window.location.href = '/login';
    }
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    setUser(data.user);
    return data;
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
    login,
    checkAuth,
  };
}
