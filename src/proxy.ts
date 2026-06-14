import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseMiddlewareClient } from '@/utils/supabase/middleware'

/**
 * RxBD Middleware
 *
 * - Supabase session refresh: Keeps Supabase auth sessions fresh on every request
 * - Auth protection: Redirects unauthenticated users to login for dashboard routes
 * - Subscription gating: Shows upgrade prompt for premium-only features
 * - Public route allowance: /verify/[id] and /api/verify/[id] are accessible without auth
 * - API route protection: All /api/ routes (except /api/verify and /api/auth) require a valid session
 * - Static assets and _next are allowed through
 */

// Routes that do NOT require authentication
const PUBLIC_PAGE_ROUTES = ['/', '/login', '/register']

// API route prefixes that don't require auth
const PUBLIC_API_PREFIXES = ['/api/verify', '/api/auth']

// Page routes that require premium subscription
const PREMIUM_PAGE_ROUTES: string[] = []

// API routes that require premium subscription
const PREMIUM_API_PREFIXES = ['/api/export/json']

function isPublicPage(pathname: string): boolean {
  if (PUBLIC_PAGE_ROUTES.includes(pathname)) return true
  if (pathname.startsWith('/verify/')) return true
  return false
}

function isPublicApi(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isPremiumApi(pathname: string): boolean {
  return PREMIUM_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/icons') ||
    pathname.includes('.') // Files with extensions (images, fonts, etc.)
  )
}

function hasAuthToken(request: NextRequest): boolean {
  // Check for Supabase session cookies (sb-<ref>-auth-token)
  const supabaseCookieKeys = request.cookies.getAll().filter(c =>
    c.name.includes('-auth-token')
  )
  if (supabaseCookieKeys.length > 0) return true

  // Check for rxbd-session cookie (legacy)
  const sessionCookie = request.cookies.get('rxbd-session')
  if (sessionCookie?.value) return true

  // Check for Authorization header (for API routes)
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) return true

  return false
}

function getSubscriptionPlan(request: NextRequest): string {
  // Check subscription cookie or header
  const subCookie = request.cookies.get('rxbd-subscription')
  if (subCookie?.value) {
    try {
      const sub = JSON.parse(subCookie.value)
      return sub.plan || 'free'
    } catch {
      return 'free'
    }
  }
  return 'free'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ─── Supabase Session Refresh ─────────────────────────────────────
  // Create a Supabase client for the middleware and refresh the session.
  // This ensures the Supabase auth session stays fresh on every request.
  const { supabase, response: supabaseResponse } = createSupabaseMiddlewareClient(request)

  // Refresh the Supabase session (this sets cookies via setAll)
  await supabase.auth.getUser()

  // Allow static assets through
  if (isStaticAsset(pathname)) {
    return supabaseResponse
  }

  // Allow public pages through (but still refresh Supabase session)
  if (isPublicPage(pathname)) {
    return supabaseResponse
  }

  // Allow public API routes through (but still refresh Supabase session)
  if (pathname.startsWith('/api/') && isPublicApi(pathname)) {
    return supabaseResponse
  }

  // Check authentication for API routes
  if (pathname.startsWith('/api/')) {
    if (!hasAuthToken(request)) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check premium-only API routes
    if (isPremiumApi(pathname)) {
      const plan = getSubscriptionPlan(request)
      if (plan !== 'premium') {
        return NextResponse.json(
          {
            success: false,
            error: 'Premium subscription required',
            upgradeUrl: '/subscription',
          },
          { status: 403 }
        )
      }
    }

    return supabaseResponse
  }

  // For page routes, check auth
  if (!hasAuthToken(request)) {
    // Redirect to login page (since this is an SPA, we redirect to / with login view)
    const loginUrl = new URL('/', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check premium-only page routes
  if (PREMIUM_PAGE_ROUTES.some((prefix) => pathname.startsWith(prefix))) {
    const plan = getSubscriptionPlan(request)
    if (plan !== 'premium') {
      const upgradeUrl = new URL('/', request.url)
      upgradeUrl.searchParams.set('upgrade', 'true')
      return NextResponse.redirect(upgradeUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
