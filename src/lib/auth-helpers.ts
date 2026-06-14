import { db } from '@/lib/db'
import { NextRequest } from 'next/server'
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * Get the authenticated doctor from the request.
 *
 * Auth strategy (in order of priority):
 * 1. Supabase session cookies — validate via Supabase server client, look up Doctor by email
 * 2. Authorization Bearer token — legacy fallback, token = doctor ID
 */
export async function getAuthDoctor(request: NextRequest) {
  // ── Strategy 1: Supabase session from cookies ──────────────────────
  try {
    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()

    if (user?.email) {
      const doctor = await db.doctor.findUnique({
        where: { email: user.email },
        include: { settings: true, subscription: true },
      })
      if (doctor) return doctor
    }
  } catch {
    // Supabase session not available — fall through to legacy
  }

  // ── Strategy 2: Legacy Bearer token ────────────────────────────────
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)
  try {
    const doctor = await db.doctor.findUnique({
      where: { id: token },
      include: { settings: true, subscription: true },
    })
    return doctor
  } catch {
    return null
  }
}

/**
 * Get just the Supabase user from the current request context.
 * Returns null if no valid Supabase session exists.
 */
export async function getSupabaseUser() {
  try {
    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}
