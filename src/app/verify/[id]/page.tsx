import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { ShieldCheck, AlertTriangle, User, Stethoscope, Calendar, Hash, Building2, Award } from 'lucide-react'

interface VerifyPageProps {
  params: Promise<{ id: string }>
}

export default async function VerifyPage({ params }: VerifyPageProps) {
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
          chamberPhone: true,
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Prescription Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            The prescription you are trying to verify does not exist or may have been deleted.
            Please check the link and try again.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-xs text-gray-400 mb-1">Prescription ID</p>
            <p className="text-sm font-mono font-medium text-gray-700">
              {id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const isCompleted = prescription.status === 'completed'
  const wasModified =
    prescription.createdAt.getTime() !== prescription.updatedAt.getTime()

  const formattedDate = prescription.date
    ? new Date(prescription.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : new Date(prescription.createdAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })

  const medications =
    typeof prescription.medications === 'string'
      ? JSON.parse(prescription.medications)
      : prescription.medications

  const medicationCount = Array.isArray(medications) ? medications.length : 0

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Main Verification Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Status Header */}
          <div
            className={`p-6 text-center ${
              isCompleted && !wasModified
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-amber-500 to-orange-500'
            }`}
          >
            <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
              {isCompleted && !wasModified ? (
                <ShieldCheck className="h-9 w-9 text-white" />
              ) : (
                <AlertTriangle className="h-9 w-9 text-white" />
              )}
            </div>
            <h1 className="text-xl font-bold text-white">
              {isCompleted && !wasModified
                ? 'Prescription Verified'
                : isCompleted && wasModified
                  ? 'Prescription Modified'
                  : 'Draft Prescription'}
            </h1>
            <p className="text-sm text-white/80 mt-1">
              {isCompleted && !wasModified
                ? 'This prescription has been verified and is authentic.'
                : isCompleted && wasModified
                  ? 'This prescription was modified after initial creation.'
                  : 'This prescription has not been finalized yet.'}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            {/* Prescription ID */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <span className="text-xs text-gray-500">Prescription ID</span>
              </div>
              <span className="font-mono font-bold text-sm text-gray-800">
                {prescription.id.slice(0, 8).toUpperCase()}
              </span>
            </div>

            {/* Doctor Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Stethoscope className="h-4 w-4 text-[#0d6b6e]" />
                <h2 className="text-sm font-semibold text-gray-700">
                  Prescribing Doctor
                </h2>
              </div>
              <div className="bg-teal-50/70 rounded-lg p-4 space-y-2 border border-teal-100">
                <p className="font-bold text-gray-900 text-base">
                  {prescription.doctor.name}
                </p>
                {prescription.doctor.degrees && (
                  <div className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-teal-600" />
                    <p className="text-sm text-gray-600">
                      {prescription.doctor.degrees}
                    </p>
                  </div>
                )}
                {prescription.doctor.specialty && (
                  <p className="text-sm font-medium text-[#0d6b6e]">
                    {prescription.doctor.specialty}
                  </p>
                )}
                {prescription.doctor.bmdcNumber && (
                  <div className="inline-flex items-center gap-1.5 bg-white rounded-md px-2.5 py-1 border border-teal-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                    <span className="text-xs font-semibold text-gray-700">
                      BMDC: {prescription.doctor.bmdcNumber}
                    </span>
                  </div>
                )}
                {prescription.doctor.chamberName && (
                  <div className="flex items-center gap-1.5 pt-1">
                    <Building2 className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-xs text-gray-500">
                      {prescription.doctor.chamberName}
                      {prescription.doctor.chamberAddress &&
                        ` - ${prescription.doctor.chamberAddress}`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Patient Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-[#0d6b6e]" />
                <h2 className="text-sm font-semibold text-gray-700">Patient</h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <p className="font-semibold text-gray-900">
                  {prescription.patient.name}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {prescription.patient.age && (
                    <span>Age: {prescription.patient.age}</span>
                  )}
                  {prescription.patient.gender && (
                    <span>Gender: {prescription.patient.gender}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Visit Information */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-[#0d6b6e]" />
                <h2 className="text-sm font-semibold text-gray-700">
                  Visit Details
                </h2>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Visit Date</span>
                  <span className="text-sm font-medium text-gray-800">
                    {formattedDate}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    Medications Prescribed
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    {medicationCount} item{medicationCount !== 1 ? 's' : ''}
                  </span>
                </div>
                {prescription.diagnosis && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-500">Diagnosis</span>
                    <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">
                      {prescription.diagnosis}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-2 flex-wrap">
              {isCompleted && !wasModified && (
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 rounded-full px-3 py-1.5 text-xs font-medium border border-green-200">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Verified Authentic
                </span>
              )}
              {isCompleted && wasModified && (
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 rounded-full px-3 py-1.5 text-xs font-medium border border-amber-200">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  Modified After Creation
                </span>
              )}
              {!isCompleted && (
                <span className="inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 rounded-full px-3 py-1.5 text-xs font-medium border border-yellow-200">
                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                  Draft - Not Finalized
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="h-5 w-5 bg-[#0d6b6e] rounded flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">Rx</span>
            </div>
            <span className="text-sm font-bold text-gray-700">
              Verified by RxBD
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Digital Prescription Verification System
          </p>
          <p className="text-xs text-gray-300">
            This verification confirms the prescription exists in the RxBD system.
            For full details, contact the prescribing doctor.
          </p>
        </div>
      </div>
    </div>
  )
}
