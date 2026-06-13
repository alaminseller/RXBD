import { db } from '@/lib/db'
import { getAuthDoctor } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const updatePrescriptionSchema = z.object({
  bloodPressure: z.string().optional(),
  pulse: z.string().optional(),
  temperature: z.string().optional(),
  weight: z.string().optional(),
  spO2: z.string().optional(),
  diagnosis: z.string().optional(),
  clinicalNotes: z.string().optional(),
  advice: z.string().optional(),
  followUpDate: z.string().optional(),
  medications: z.array(z.unknown()).optional(),
  status: z.enum(['draft', 'completed']).optional(),
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
    const prescription = await db.prescription.findUnique({
      where: { id },
      include: {
        patient: {
          select: { id: true, name: true, age: true, gender: true, phone: true, bloodGroup: true, allergies: true },
        },
        doctor: {
          select: { id: true, name: true, degrees: true, specialty: true, chamberName: true, chamberAddress: true, chamberPhone: true },
        },
      },
    })

    if (!prescription || prescription.doctorId !== doctor.id) {
      return NextResponse.json(
        { success: false, error: 'Prescription not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: prescription })
  } catch (error) {
    console.error('Prescription GET error:', error)
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
    const existing = await db.prescription.findUnique({ where: { id } })
    if (!existing || existing.doctorId !== doctor.id) {
      return NextResponse.json(
        { success: false, error: 'Prescription not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validated = updatePrescriptionSchema.parse(body)

    const updateData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(validated)) {
      if (value === undefined) continue
      if (key === 'medications') {
        updateData[key] = JSON.stringify(value)
      } else {
        updateData[key] = value
      }
    }

    const prescription = await db.prescription.update({
      where: { id },
      data: updateData,
      include: {
        patient: {
          select: { id: true, name: true, age: true, gender: true, phone: true },
        },
      },
    })

    // Log audit
    await db.auditLog.create({
      data: {
        doctorId: doctor.id,
        action: 'UPDATE_PRESCRIPTION',
        entity: 'Prescription',
        entityId: id,
        details: 'Updated prescription',
      },
    })

    return NextResponse.json({ success: true, data: prescription })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }
    console.error('Prescription PATCH error:', error)
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
    const existing = await db.prescription.findUnique({ where: { id } })
    if (!existing || existing.doctorId !== doctor.id) {
      return NextResponse.json(
        { success: false, error: 'Prescription not found' },
        { status: 404 }
      )
    }

    await db.prescription.delete({ where: { id } })

    // Log audit
    await db.auditLog.create({
      data: {
        doctorId: doctor.id,
        action: 'DELETE_PRESCRIPTION',
        entity: 'Prescription',
        entityId: id,
        details: 'Deleted prescription',
      },
    })

    return NextResponse.json({ success: true, data: { id } })
  } catch (error) {
    console.error('Prescription DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
