import { db } from '@/lib/db'
import { getAuthDoctor } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  degrees: z.string().optional(),
  specialty: z.string().optional(),
  bmdcNumber: z.string().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().optional(),
  chamberName: z.string().optional(),
  chamberAddress: z.string().optional(),
  chamberPhone: z.string().optional(),
  chamberEmail: z.string().optional(),
  // Settings fields
  letterheadLogoUrl: z.string().optional(),
  letterheadColor: z.string().optional(),
  signatureUrl: z.string().optional(),
  includeQrCode: z.boolean().optional(),
  defaultLanguage: z.enum(['en', 'bn']).optional(),
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
  autoSaveInterval: z.number().int().min(1).max(60).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { password: _, ...doctorData } = doctor
    return NextResponse.json({ success: true, data: doctorData })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = updateProfileSchema.parse(body)

    // Separate doctor fields from settings fields
    const settingsFields = [
      'letterheadLogoUrl',
      'letterheadColor',
      'signatureUrl',
      'includeQrCode',
      'defaultLanguage',
      'fontSize',
      'autoSaveInterval',
    ] as const

    const doctorData: Record<string, unknown> = {}
    const settingsData: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(validated)) {
      if (value === undefined) continue
      if (settingsFields.includes(key as (typeof settingsFields)[number])) {
        settingsData[key] = value
      } else {
        doctorData[key] = value
      }
    }

    // Update in transaction
    const updated = await db.doctor.update({
      where: { id: doctor.id },
      data: {
        ...(Object.keys(doctorData).length > 0 ? doctorData : {}),
        ...(Object.keys(settingsData).length > 0
          ? {
              settings: {
                upsert: {
                  create: settingsData,
                  update: settingsData,
                },
              },
            }
          : {}),
      },
      include: { settings: true, subscription: true },
    })

    const { password: _, ...doctorResult } = updated
    return NextResponse.json({ success: true, data: doctorResult })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }
    console.error('Profile PATCH error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
