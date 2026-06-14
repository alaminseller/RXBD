import { NextResponse } from 'next/server'
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * POST /api/auth/logout
 * Signs out from Supabase and clears session cookies.
 */
export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = createSupabaseServerClient(cookieStore)
    await supabase.auth.signOut()
  } catch {
    // Supabase sign-out failed — still return success
    // Client will clear its own state regardless
  }

  const response = NextResponse.json({ success: true })

  // Clear legacy auth cookies
  response.cookies.set('rxbd-session', '', { maxAge: 0, path: '/' })
  response.cookies.set('rxbd-subscription', '', { maxAge: 0, path: '/' })

  return response
}
