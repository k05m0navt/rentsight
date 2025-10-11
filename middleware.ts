import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = await updateSession(request)

  // Protect dashboard route
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: { user } } = await res.supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return res.supabaseResponse
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
}

