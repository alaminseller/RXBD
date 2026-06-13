import { db } from '@/lib/db'
import { getAuthDoctor } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'
import { v4 as uuidv4 } from 'uuid'

const createPrescriptionSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
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

export async function GET(request: NextRequest) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const status = searchParams.get('status') || undefined
    const patientId = searchParams.get('patientId') || undefined

    const where = {
      doctorId: doctor.id,
      ...(status ? { status } : {}),
      ...(patientId ? { patientId } : {}),
    }

    const [prescriptions, total] = await Promise.all([
      db.prescription.findMany({
        where,
        include: {
          patient: {
            select: { id: true, name: true, age: true, gender: true, phone: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.prescription.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Prescriptions GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = createPrescriptionSchema.parse(body)

    // Check subscription limits
    const subscription = doctor.subscription
    if (subscription && subscription.plan === 'free') {
      if (subscription.prescriptionsUsed >= subscription.prescriptionsLimit) {
        return NextResponse.json(
          {
            success: false,
            error: 'Prescription limit reached. Please upgrade your subscription.',
          },
          { status: 403 }
        )
      }
    }

    // Verify patient belongs to this doctor
    const patient = await db.patient.findFirst({
      where: { id: validated.patientId, doctorId: doctor.id },
    })
    if (!patient) {
      return NextResponse.json(
        { success: false, error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Generate unique QR code
    const qrCode = uuidv4()

    // Create prescription
    const prescription = await db.prescription.create({
      data: {
        doctorId: doctor.id,
        patientId: validated.patientId,
        bloodPressure: validated.bloodPressure ?? '',
        pulse: validated.pulse ?? '',
        temperature: validated.temperature ?? '',
        weight: validated.weight ?? '',
        spO2: validated.spO2 ?? '',
        diagnosis: validated.diagnosis ?? '',
        clinicalNotes: validated.clinicalNotes ?? '',
        advice: validated.advice ?? '',
        followUpDate: validated.followUpDate ?? '',
        medications: JSON.stringify(validated.medications ?? []),
        qrCode,
        status: validated.status ?? 'completed',
      },
      include: {
        patient: {
          select: { id: true, name: true, age: true, gender: true, phone: true },
        },
      },
    })

    // Increment subscription usage
    if (subscription) {
      await db.subscription.update({
        where: { doctorId: doctor.id },
        data: { prescriptionsUsed: { increment: 1 } },
      })
    }

    // Log audit
    await db.auditLog.create({
      data: {
        doctorId: doctor.id,
        action: 'CREATE_PRESCRIPTION',
        entity: 'Prescription',
        entityId: prescription.id,
        details: `Created prescription for patient ${patient.name}`,
      },
    })

    return NextResponse.json(
      { success: true, data: prescription },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }
    console.error('Prescriptions POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
