import { db } from '@/lib/db'
import { getAuthDoctor } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/export/json
 *
 * Premium-only endpoint that returns all prescription data as JSON.
 * Streams the response for large datasets.
 * Creates an audit log entry for the data export.
 */
export async function GET(request: NextRequest) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check premium subscription
    const subscription = doctor.subscription
    if (!subscription || subscription.plan !== 'premium' || subscription.status !== 'active') {
      return NextResponse.json(
        {
          success: false,
          error: 'Premium subscription required for JSON export',
          upgradeUrl: '/subscription',
        },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'prescriptions' // 'patients' or 'prescriptions'

    if (type === 'patients') {
      const patients = await db.patient.findMany({
        where: { doctorId: doctor.id },
        orderBy: { createdAt: 'desc' },
        include: {
          prescriptions: {
            select: {
              id: true,
              date: true,
              diagnosis: true,
              status: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      })

      // Audit log
      await db.auditLog.create({
        data: {
          doctorId: doctor.id,
          action: 'DATA_EXPORT',
          entity: 'Patient',
          details: `Exported ${patients.length} patients as JSON`,
        },
      })

      const payload = {
        exportedAt: new Date().toISOString(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        type: 'patients',
        count: patients.length,
        data: patients,
      }

      // Use streaming for large datasets
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(JSON.stringify(payload, null, 2)))
          controller.close()
        },
      })

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="patients-${new Date().toISOString().split('T')[0]}.json"`,
        },
      })
    }

    if (type === 'prescriptions') {
      const prescriptions = await db.prescription.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              age: true,
              gender: true,
              phone: true,
              bloodGroup: true,
              allergies: true,
              chronicDiseases: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      // Parse medications JSONB for each prescription
      const prescriptionsWithParsedMeds = prescriptions.map((rx) => ({
        ...rx,
        medications: typeof rx.medications === 'string'
          ? (() => { try { return JSON.parse(rx.medications) } catch { return [] } })()
          : rx.medications,
      }))

      // Audit log
      await db.auditLog.create({
        data: {
          doctorId: doctor.id,
          action: 'DATA_EXPORT',
          entity: 'Prescription',
          details: `Exported ${prescriptions.length} prescriptions as JSON`,
        },
      })

      const payload = {
        exportedAt: new Date().toISOString(),
        doctorId: doctor.id,
        doctorName: doctor.name,
        type: 'prescriptions',
        count: prescriptions.length,
        data: prescriptionsWithParsedMeds,
      }

      // Use streaming for large datasets
      const encoder = new TextEncoder()
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(JSON.stringify(payload, null, 2)))
          controller.close()
        },
      })

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="prescriptions-${new Date().toISOString().split('T')[0]}.json"`,
        },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid export type. Use "patients" or "prescriptions"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('JSON Export GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
