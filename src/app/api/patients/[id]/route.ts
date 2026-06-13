import { db } from '@/lib/db'
import { getAuthDoctor } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const updatePatientSchema = z.object({
  name: z.string().min(1, 'Patient name is required').optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  consentGiven: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const patient = await db.patient.findUnique({
      where: { id },
      include: {
        prescriptions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            date: true,
            diagnosis: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })

    if (!patient || patient.doctorId !== doctor.id) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: patient })
  } catch (error) {
    console.error('Patient GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership
    const existing = await db.patient.findUnique({ where: { id } })
    if (!existing || existing.doctorId !== doctor.id) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validated = updatePatientSchema.parse(body)

    // Handle consent date
    const updateData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(validated)) {
      if (value === undefined) continue
      if (key === 'consentGiven' && value === true && !existing.consentGiven) {
        updateData.consentGiven = true
        updateData.consentDate = new Date()
      } else {
        updateData[key] = value
      }
    }

    const patient = await db.patient.update({
      where: { id },
      data: updateData,
    })

    // Log audit
    await db.auditLog.create({
      data: {
        doctorId: doctor.id,
        action: 'UPDATE_PATIENT',
        entity: 'Patient',
        entityId: id,
        details: `Updated patient: ${patient.name}`,
      },
    })

    return NextResponse.json({ success: true, data: patient })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }
    console.error('Patient PATCH error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verify ownership
    const existing = await db.patient.findUnique({ where: { id } })
    if (!existing || existing.doctorId !== doctor.id) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    await db.patient.delete({ where: { id } })

    // Log audit
    await db.auditLog.create({
      data: {
        doctorId: doctor.id,
        action: 'DELETE_PATIENT',
        entity: 'Patient',
        entityId: id,
        details: `Deleted patient: ${existing.name}`,
      },
    })

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('Patient DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
