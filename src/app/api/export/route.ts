import { db } from '@/lib/db'
import { getAuthDoctor } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export async function GET(request: NextRequest) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Determine if premium user
    const subscription = doctor.subscription
    const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active'

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'patients' // 'patients' or 'prescriptions'

    if (type === 'patients') {
      const patients = await db.patient.findMany({
        where: { doctorId: doctor.id },
        orderBy: { createdAt: 'desc' },
      })

      // Both free and premium get full patient CSV (patient data is basic)
      const headers = [
        'ID', 'Name', 'Age', 'Gender', 'Phone', 'Address',
        'Blood Group', 'Allergies', 'Chronic Diseases',
        'Consent Given', 'Consent Date', 'Created At',
      ]

      const rows = patients.map((p) => [
        p.id, p.name, p.age, p.gender, p.phone, p.address,
        p.bloodGroup, p.allergies, p.chronicDiseases,
        p.consentGiven ? 'Yes' : 'No',
        p.consentDate ? new Date(p.consentDate).toISOString() : '',
        new Date(p.createdAt).toISOString(),
      ].map(escapeCSV).join(','))

      const csv = [headers.join(','), ...rows].join('\n')

      // Audit log
      await db.auditLog.create({
        data: {
          doctorId: doctor.id,
          action: 'DATA_EXPORT',
          entity: 'Patient',
          details: `Exported ${patients.length} patients as CSV (${isPremium ? 'Premium' : 'Free'} plan)`,
        },
      })

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="patients-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    if (type === 'prescriptions') {
      const prescriptions = await db.prescription.findMany({
        where: { doctorId: doctor.id },
        include: {
          patient: {
            select: { name: true, phone: true, age: true, gender: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      if (isPremium) {
        // Premium: Extended CSV with all clinical fields
        const headers = [
          'ID', 'Patient Name', 'Patient Phone', 'Patient Age', 'Patient Gender',
          'Date',
          'Chief Complaints',
          'Blood Pressure', 'Pulse', 'Temperature', 'Weight', 'SpO2',
          'On Examination', 'Investigations',
          'Diagnosis', 'Diagnosis Code',
          'Clinical Notes', 'Advice', 'Follow Up Date',
          'Medications', 'Status', 'QR Code', 'Created At',
        ]

        const rows = prescriptions.map((p) => [
          p.id,
          p.patient.name, p.patient.phone, p.patient.age, p.patient.gender,
          new Date(p.date).toISOString().split('T')[0],
          p.chiefComplaints,
          p.bloodPressure, p.pulse, p.temperature, p.weight, p.spO2,
          p.onExamination, p.investigations,
          p.diagnosis, p.diagnosisCode,
          p.clinicalNotes, p.advice, p.followUpDate,
          p.medications, p.status, p.qrCode,
          new Date(p.createdAt).toISOString(),
        ].map(escapeCSV).join(','))

        const csv = [headers.join(','), ...rows].join('\n')

        // Audit log
        await db.auditLog.create({
          data: {
            doctorId: doctor.id,
            action: 'DATA_EXPORT',
            entity: 'Prescription',
            details: `Exported ${prescriptions.length} prescriptions as extended CSV (Premium plan)`,
          },
        })

        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="prescriptions-extended-${new Date().toISOString().split('T')[0]}.csv"`,
          },
        })
      } else {
        // Free: Basic CSV with patient list + prescription summaries
        const headers = [
          'ID', 'Patient Name', 'Patient Phone', 'Patient Age', 'Patient Gender',
          'Date',
          'Blood Pressure', 'Pulse', 'Temperature', 'Weight', 'SpO2',
          'Diagnosis', 'Advice', 'Follow Up Date',
          'Medications', 'Status', 'Created At',
        ]

        const rows = prescriptions.map((p) => [
          p.id,
          p.patient.name, p.patient.phone, p.patient.age, p.patient.gender,
          new Date(p.date).toISOString().split('T')[0],
          p.bloodPressure, p.pulse, p.temperature, p.weight, p.spO2,
          p.diagnosis, p.advice, p.followUpDate,
          p.medications, p.status,
          new Date(p.createdAt).toISOString(),
        ].map(escapeCSV).join(','))

        const csv = [headers.join(','), ...rows].join('\n')

        // Audit log
        await db.auditLog.create({
          data: {
            doctorId: doctor.id,
            action: 'DATA_EXPORT',
            entity: 'Prescription',
            details: `Exported ${prescriptions.length} prescriptions as basic CSV (Free plan)`,
          },
        })

        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="prescriptions-${new Date().toISOString().split('T')[0]}.csv"`,
          },
        })
      }
    }

    return NextResponse.json(
      { success: false, error: 'Invalid export type. Use "patients" or "prescriptions"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Export GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
