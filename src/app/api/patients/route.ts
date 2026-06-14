import { db } from '@/lib/db'
import { getAuthDoctor } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const createPatientSchema = z.object({
  name: z.string().min(1, 'Patient name is required'),
  age: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  allergies: z.string().optional(),
  chronicDiseases: z.string().optional(),
  consentGiven: z.boolean().optional(),
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
    const search = searchParams.get('search') || undefined

    const where = {
      doctorId: doctor.id,
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { phone: { contains: search } },
            ],
          }
        : {}),
    }

    const [patients, total] = await Promise.all([
      db.patient.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.patient.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: {
        patients,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Patients GET error:', error)
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
    const validated = createPatientSchema.parse(body)

    const patient = await db.patient.create({
      data: {
        doctorId: doctor.id,
        name: validated.name,
        age: validated.age ?? '',
        gender: validated.gender ?? '',
        phone: validated.phone ?? '',
        address: validated.address ?? '',
        bloodGroup: validated.bloodGroup ?? '',
        allergies: validated.allergies ?? '',
        chronicDiseases: validated.chronicDiseases ?? '',
        consentGiven: validated.consentGiven ?? false,
        consentDate: validated.consentGiven ? new Date() : null,
      },
    })

    // Log audit
    await db.auditLog.create({
      data: {
        doctorId: doctor.id,
        action: 'CREATE_PATIENT',
        entity: 'Patient',
        entityId: patient.id,
        details: `Created patient: ${patient.name}`,
      },
    })

    return NextResponse.json(
      { success: true, data: patient },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }
    console.error('Patients POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
