import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'
import bcrypt from 'bcryptjs'
import { createClient as createSupabaseServerClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    // ── Try Supabase Auth first ──────────────────────────────────────
    // If the client has already signed in via Supabase browser client,
    // the session cookies will be set. Validate them server-side.
    try {
      const cookieStore = await cookies()
      const supabase = createSupabaseServerClient(cookieStore)
      const { data: { user } } = await supabase.auth.getUser()

      if (user?.email === validated.email) {
        // Supabase session is valid — look up doctor by email
        const doctor = await db.doctor.findUnique({
          where: { email: validated.email },
          include: { settings: true, subscription: true },
        })

        if (doctor) {
          // Link Supabase UID if not yet set
          if (!doctor.supabaseUid && user.id) {
            await db.doctor.update({
              where: { id: doctor.id },
              data: { supabaseUid: user.id },
            })
          }

          const { password: _, ...doctorData } = doctor
          return NextResponse.json({
            success: true,
            data: {
              ...doctorData,
              supabaseUid: user.id,
              token: doctor.id,
            },
          })
        }
      }
    } catch {
      // Supabase session not available — fall through to bcrypt
    }

    // ── Fallback: bcrypt password verification ───────────────────────
    const doctor = await db.doctor.findUnique({
      where: { email: validated.email },
      include: { subscription: true },
    })

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const isPasswordValid = await bcrypt.compare(validated.password, doctor.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const { password: _, ...doctorData } = doctor

    return NextResponse.json({
      success: true,
      data: {
        ...doctorData,
        token: doctor.id,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
