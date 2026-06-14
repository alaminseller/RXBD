'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Download, Printer, Pill, Activity, FileText, Stethoscope, ClipboardList, MessageSquare, CalendarClock } from 'lucide-react'
import type { Prescription, Medication } from '@/types'
import { downloadPrescriptionPDF, printPrescriptionPDF } from '@/lib/pdf-generator'
import { useState, useCallback } from 'react'
import { useAuthStore } from '@/store/auth-store'

interface PrescriptionDetailDialogProps {
  prescription: Prescription | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrescriptionDetailDialog({
  prescription,
  open,
  onOpenChange,
}: PrescriptionDetailDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const doctor = useAuthStore((s) => s.doctor)

  const getMedications = useCallback((): Medication[] => {
    if (!prescription) return []
    const meds =
      typeof prescription.medications === 'string'
        ? JSON.parse(prescription.medications)
        : prescription.medications
    return Array.isArray(meds) ? meds : []
  }, [prescription])

  const handleDownloadPDF = async () => {
    if (!prescription || !doctor) return
    setIsDownloading(true)
    try {
      const patient: import('@/types').Patient = {
        id: prescription.patientId,
        doctorId: prescription.doctorId,
        name: prescription.patient?.name || '',
        age: prescription.patient?.age || '',
        gender: prescription.patient?.gender || '',
        phone: prescription.patient?.phone || '',
        address: '',
        bloodGroup: '',
        allergies: '',
        chronicDiseases: '',
        consentGiven: false,
        consentDate: null,
        createdAt: '',
        updatedAt: '',
      }
      await downloadPrescriptionPDF(prescription, doctor, patient)
    } catch (error) {
      console.error('PDF download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrintPDF = async () => {
    if (!prescription || !doctor) return
    setIsPrinting(true)
    try {
      const patient: import('@/types').Patient = {
        id: prescription.patientId,
        doctorId: prescription.doctorId,
        name: prescription.patient?.name || '',
        age: prescription.patient?.age || '',
        gender: prescription.patient?.gender || '',
        phone: prescription.patient?.phone || '',
        address: '',
        bloodGroup: '',
        allergies: '',
        chronicDiseases: '',
        consentGiven: false,
        consentDate: null,
        createdAt: '',
        updatedAt: '',
      }
      await printPrescriptionPDF(prescription, doctor, patient)
    } catch (error) {
      console.error('PDF print error:', error)
    } finally {
      setIsPrinting(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  if (!prescription) return null

  const medications = getMedications()
  const patient = prescription.patient
  const hasVitals =
    prescription.bloodPressure ||
    prescription.pulse ||
    prescription.temperature ||
    prescription.weight ||
    prescription.spO2

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#0d6b6e]" />
            Prescription Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-1">
          <div className="space-y-5">
            {/* Header Info */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-[#0d6b6e] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">Rx</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    ID: {prescription.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(prescription.date || prescription.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                {prescription.status === 'completed' ? (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Completed
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Draft
                  </Badge>
                )}
              </div>
            </div>

            {/* Patient Info */}
            {patient && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Stethoscope className="h-3.5 w-3.5 text-[#0d6b6e]" />
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patient Information
                  </Label>
                </div>
                <div className="bg-teal-50/50 rounded-lg p-3 border border-teal-100">
                  <div className="flex flex-wrap gap-x-6 gap-y-1">
                    <div>
                      <span className="text-xs text-gray-500">Name</span>
                      <p className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </p>
                    </div>
                    {patient.age && (
                      <div>
                        <span className="text-xs text-gray-500">Age</span>
                        <p className="text-sm font-medium text-gray-900">
                          {patient.age}
                        </p>
                      </div>
                    )}
                    {patient.gender && (
                      <div>
                        <span className="text-xs text-gray-500">Gender</span>
                        <p className="text-sm font-medium text-gray-900">
                          {patient.gender}
                        </p>
                      </div>
                    )}
                    {patient.phone && (
                      <div>
                        <span className="text-xs text-gray-500">Phone</span>
                        <p className="text-sm font-medium text-gray-900">
                          {patient.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Vitals */}
            {hasVitals && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Activity className="h-3.5 w-3.5 text-[#0d6b6e]" />
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Vitals
                  </Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prescription.bloodPressure && (
                    <Badge
                      variant="outline"
                      className="text-xs py-1 px-2.5 bg-gray-50"
                    >
                      BP: {prescription.bloodPressure}
                    </Badge>
                  )}
                  {prescription.pulse && (
                    <Badge
                      variant="outline"
                      className="text-xs py-1 px-2.5 bg-gray-50"
                    >
                      Pulse: {prescription.pulse}
                    </Badge>
                  )}
                  {prescription.temperature && (
                    <Badge
                      variant="outline"
                      className="text-xs py-1 px-2.5 bg-gray-50"
                    >
                      Temp: {prescription.temperature}
                    </Badge>
                  )}
                  {prescription.weight && (
                    <Badge
                      variant="outline"
                      className="text-xs py-1 px-2.5 bg-gray-50"
                    >
                      Wt: {prescription.weight}
                    </Badge>
                  )}
                  {prescription.spO2 && (
                    <Badge
                      variant="outline"
                      className="text-xs py-1 px-2.5 bg-gray-50"
                    >
                      SpO2: {prescription.spO2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Chief Complaints */}
            {prescription.chiefComplaints && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ClipboardList className="h-3.5 w-3.5 text-[#0d6b6e]" />
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Chief Complaints
                  </Label>
                </div>
                <p className="text-sm text-gray-700 pl-5">
                  {prescription.chiefComplaints}
                </p>
              </div>
            )}

            {/* Diagnosis */}
            {prescription.diagnosis && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Stethoscope className="h-3.5 w-3.5 text-[#0d6b6e]" />
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Diagnosis
                  </Label>
                </div>
                <div className="pl-5">
                  <p className="text-sm text-gray-700 font-medium">
                    {prescription.diagnosis}
                  </p>
                  {prescription.diagnosisCode && (
                    <Badge
                      variant="outline"
                      className="text-[10px] mt-1 bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {prescription.diagnosisCode}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Medications */}
            {medications.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Pill className="h-3.5 w-3.5 text-[#0d6b6e]" />
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Medications ({medications.length})
                  </Label>
                </div>
                <div className="space-y-2 pl-1">
                  {medications.map((med, idx) => (
                    <div
                      key={med.id || idx}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-sm font-bold text-[#0d6b6e] mt-0.5">
                          {idx + 1}.
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {med.brand}
                            {med.strength && (
                              <span className="font-normal text-gray-600">
                                {' '}
                                – {med.strength}
                              </span>
                            )}
                          </p>
                          {med.generic && (
                            <p className="text-xs text-gray-500 italic">
                              {med.generic}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {med.dosageForm && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-teal-50 text-teal-700 border-teal-200"
                              >
                                {med.dosageForm}
                              </Badge>
                            )}
                            {med.frequency && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-teal-50 text-teal-700 border-teal-200"
                              >
                                {med.frequency}
                              </Badge>
                            )}
                            {med.duration && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-teal-50 text-teal-700 border-teal-200"
                              >
                                {med.duration}
                              </Badge>
                            )}
                          </div>
                          {med.instructions && (
                            <p className="text-xs text-gray-500 mt-1 italic">
                              {med.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advice */}
            {prescription.advice && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <MessageSquare className="h-3.5 w-3.5 text-[#0d6b6e]" />
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Advice
                  </Label>
                </div>
                <p className="text-sm text-gray-700 pl-5 whitespace-pre-line">
                  {prescription.advice}
                </p>
              </div>
            )}

            {/* Follow Up */}
            {prescription.followUpDate && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <CalendarClock className="h-3.5 w-3.5 text-[#0d6b6e]" />
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Follow-up
                  </Label>
                </div>
                <div className="pl-5">
                  <Badge className="bg-amber-50 text-amber-800 border-amber-200">
                    Next visit: {prescription.followUpDate}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 flex-1"
            onClick={handleDownloadPDF}
            disabled={isDownloading || !doctor}
          >
            <Download className="h-3.5 w-3.5" />
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 flex-1"
            onClick={handlePrintPDF}
            disabled={isPrinting || !doctor}
          >
            <Printer className="h-3.5 w-3.5" />
            {isPrinting ? 'Preparing...' : 'Print'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
