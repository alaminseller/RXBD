import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const signupSchema = z.object({
  email: z.email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  degrees: z.string().optional(),
  bmdcNumber: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = signupSchema.parse(body)

    // Check if doctor already exists
    const existing = await db.doctor.findUnique({
      where: { email: validated.email },
    })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10)

    // Create doctor + settings + subscription in transaction
    const doctor = await db.doctor.create({
      data: {
        email: validated.email,
        name: validated.name,
        password: hashedPassword,
        phone: validated.phone ?? '',
        specialty: validated.specialty ?? '',
        degrees: validated.degrees ?? '',
        bmdcNumber: validated.bmdcNumber ?? '',
        settings: {
          create: {
            defaultLanguage: 'en',
            fontSize: 'medium',
            includeQrCode: true,
            autoSaveInterval: 10,
          },
        },
        subscription: {
          create: {
            plan: 'free',
            prescriptionsUsed: 0,
            prescriptionsLimit: 50,
            status: 'active',
          },
        },
      },
      include: { settings: true, subscription: true },
    })

    // Return doctor data without password
    const { password: _, ...doctorData } = doctor

    return NextResponse.json(
      { success: true, data: doctorData },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }
    console.error('Signup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
