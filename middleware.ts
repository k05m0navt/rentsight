import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = await updateSession(request);

  // Protect authenticated routes
  const protectedRoutes = [
    '/dashboard',
    '/settings',
    '/properties',
    '/reports',
    '/tags',
    '/rent-entries',
    '/expense-entries',
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isProtectedRoute) {
    // Check both session and user to ensure proper auth
    const {
      data: { session },
    } = await res.supabase.auth.getSession();
    const {
      data: { user },
    } = await res.supabase.auth.getUser();

    if (!session || !user) {
      // Create redirect response that clears any stale cookies
      const redirectUrl = new URL('/login', request.url);
      // Add the originally requested URL as a redirect parameter
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);

      // Use 307 Temporary Redirect to preserve the original request method
      const redirectResponse = NextResponse.redirect(redirectUrl, { status: 307 });

      // Clear any auth-related cookies to prevent stale state
      redirectResponse.cookies.delete('sb-access-token');
      redirectResponse.cookies.delete('sb-refresh-token');

      // Add headers to prevent caching of the redirect
      redirectResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      redirectResponse.headers.set('Pragma', 'no-cache');
      redirectResponse.headers.set('Expires', '0');

      return redirectResponse;
    }
  }

  return res.supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - .vscode (VSCode files)
     * - .cursor (Cursor files)
     * - .specify (Specify files)
     * - prisma (Prisma files)
     * - node_modules (node modules)
     * - public (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|.vscode|.cursor|.specify|prisma|node_modules|public).*)|',
  ],
};
