import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Public verification endpoint - no authentication required.
 * Returns limited prescription data for verification purposes only.
 * Does NOT expose full medication details or clinical notes for privacy.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const prescription = await db.prescription.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            name: true,
            degrees: true,
            specialty: true,
            bmdcNumber: true,
            chamberName: true,
            chamberAddress: true,
          },
        },
        patient: {
          select: {
            name: true,
            age: true,
            gender: true,
          },
        },
      },
    })

    if (!prescription) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prescription not found',
          verified: false,
        },
        { status: 404 }
      )
    }

    // Determine tamper-evident status
    const isDraft = prescription.status === 'draft'
    const wasModified =
      prescription.createdAt.getTime() !== prescription.updatedAt.getTime()
    const tamperStatus =
      isDraft || wasModified ? 'modified' : 'verified'

    // Return only limited data for verification (privacy-preserving)
    const verificationData = {
      verified: true,
      tamperStatus,
      prescriptionId: prescription.id.slice(0, 8).toUpperCase(),
      status: prescription.status,
      date: prescription.date
        ? new Date(prescription.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })
        : null,
      createdAt: prescription.createdAt.toISOString(),
      doctor: {
        name: prescription.doctor.name,
        degrees: prescription.doctor.degrees,
        specialty: prescription.doctor.specialty,
        bmdcNumber: prescription.doctor.bmdcNumber,
        chamberName: prescription.doctor.chamberName,
      },
      patient: {
        name: prescription.patient.name,
        age: prescription.patient.age,
        gender: prescription.patient.gender,
      },
      medicationCount: Array.isArray(
        typeof prescription.medications === 'string'
          ? JSON.parse(prescription.medications)
          : prescription.medications
      )
        ? (
            typeof prescription.medications === 'string'
              ? JSON.parse(prescription.medications)
              : prescription.medications
          ).length
        : 0,
    }

    return NextResponse.json({
      success: true,
      data: verificationData,
    })
  } catch (error) {
    console.error('Verification GET error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        verified: false,
      },
      { status: 500 }
    )
  }
}
