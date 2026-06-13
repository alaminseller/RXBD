import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'
import bcrypt from 'bcryptjs'

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = loginSchema.parse(body)

    // Find doctor by email
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

    // Compare password
    const isPasswordValid = await bcrypt.compare(validated.password, doctor.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Return doctor data without password, using doctor ID as session token
    const { password: _, ...doctorData } = doctor

    return NextResponse.json({
      success: true,
      data: {
        ...doctorData,
        token: doctor.id, // Simple token - doctor's ID (use JWT in production)
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
