/**
 * User Preferences Utilities
 *
 * Helper functions for working with user preferences
 */

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

/**
 * Get user's default view preference
 * @param userId - The user ID
 * @returns The default view path
 */
export async function getUserDefaultView(userId: string): Promise<string> {
  try {
    const preferences = await prisma.userPreferences.findUnique({
      where: { user_id: userId },
      select: { default_view: true },
    });

    const defaultView = preferences?.default_view || 'dashboard';

    // Map preference values to actual routes
    switch (defaultView) {
      case 'properties':
        return '/properties';
      case 'reports':
        return '/reports';
      case 'settings':
        return '/settings';
      case 'dashboard':
      default:
        return '/dashboard';
    }
  } catch (error) {
    console.error('Error getting user default view:', error);
    return '/dashboard'; // Fallback to dashboard
  }
}

/**
 * Get current user's default view preference
 * @returns The default view path
 */
export async function getCurrentUserDefaultView(): Promise<string> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return '/dashboard';
    }

    return await getUserDefaultView(user.id);
  } catch (error) {
    console.error('Error getting current user default view:', error);
    return '/dashboard'; // Fallback to dashboard
  }
}
