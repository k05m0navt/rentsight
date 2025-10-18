/**
 * Logout API Route
 *
 * Properly clears Supabase session and cookies
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const supabase = createClient();

    // Sign out from Supabase (clears cookies)
    await supabase.auth.signOut();

    // Get cookies and explicitly clear all Supabase-related cookies
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    // Clear all Supabase auth cookies
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
        cookieStore.delete(cookie.name);
      }
    });

    // Revalidate all paths to clear cached auth state
    revalidatePath('/', 'layout');

    // Create response that explicitly clears cookies
    const response = NextResponse.json({ success: true }, { status: 200 });

    // Also set cookies to expire in the response
    allCookies.forEach((cookie) => {
      if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
        response.cookies.set(cookie.name, '', {
          expires: new Date(0),
          path: '/',
        });
      }
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
