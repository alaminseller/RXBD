import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

/**
 * GET /api/auth/me
 * Returns the current authenticated doctor using Supabase session cookies.
 */
export async function GET(request: NextRequest) {
  try {
    // Try Supabase session first
    let doctor = null
    try {
      const cookieStore = await cookies()
      const supabase = createSupabaseServerClient(cookieStore)
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email) {
        doctor = await db.doctor.findUnique({
          where: { email: user.email },
          include: { settings: true, subscription: true },
        })

        // Link Supabase UID if not yet set
        if (doctor && !doctor.supabaseUid && user.id) {
          await db.doctor.update({
            where: { id: doctor.id },
            data: { supabaseUid: user.id },
          })
        }
      }
    } catch {
      // Supabase not available
    }

    // Fallback: Bearer token
    if (!doctor) {
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        doctor = await db.doctor.findUnique({
          where: { id: token },
          include: { settings: true, subscription: true },
        })
      }
    }

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { password: _, ...doctorData } = doctor
    return NextResponse.json({ success: true, data: doctorData })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
