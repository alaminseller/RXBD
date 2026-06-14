'use client'

import { useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar, FileText, ChevronRight, Pill, Clock } from 'lucide-react'
import type { Prescription } from '@/types'
import { authHeaders } from '@/store/auth-store'
import { PrescriptionDetailDialog } from '@/components/prescriptions/prescription-detail-dialog'

interface PatientHistoryProps {
  patientId: string
  patientName: string
  onBack?: () => void
}

export function PatientHistory({
  patientId,
  patientName,
  onBack,
}: PatientHistoryProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        patientId,
        page: '1',
        limit: '50',
      })
      const response = await fetch(`/api/prescriptions?${params}`, {
        headers: authHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        const result =
          (data as { data?: { prescriptions?: Prescription[] } }).data
            ?.prescriptions || []
        setPrescriptions(Array.isArray(result) ? result : [])
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    if (patientId) {
      fetchHistory()
    }
  }, [patientId, fetchHistory])

  const handleViewDetail = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setShowDetailDialog(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 text-[10px]">
            Completed
          </Badge>
        )
      case 'draft':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-[10px]">
            Draft
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-[10px]">
            {status}
          </Badge>
        )
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

  const getMedicationCount = (rx: Prescription): number => {
    const meds =
      typeof rx.medications === 'string'
        ? JSON.parse(rx.medications)
        : rx.medications
    return Array.isArray(meds) ? meds.length : 0
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mr-1">
              ← Back
            </Button>
          )}
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Patient History
            </h3>
            <p className="text-sm text-muted-foreground">{patientName}</p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="text-[#0d6b6e] border-[#0d6b6e]/30 bg-[#0d6b6e]/5"
        >
          {prescriptions.length} prescription
          {prescriptions.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Prescription List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : prescriptions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p className="text-sm text-muted-foreground">
              No prescription history found for this patient.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="max-h-96 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {prescriptions.map((rx) => {
              const medCount = getMedicationCount(rx)
              return (
                <Card
                  key={rx.id}
                  className="cursor-pointer hover:border-[#0d6b6e]/40 hover:bg-[#0d6b6e]/[0.02] transition-colors"
                  onClick={() => handleViewDetail(rx)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3.5 w-3.5 text-[#0d6b6e] flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(rx.date || rx.createdAt)}
                          </span>
                          {getStatusBadge(rx.status)}
                        </div>
                        {rx.diagnosis && (
                          <p className="text-sm text-gray-600 truncate ml-5.5">
                            {rx.diagnosis}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1 ml-5.5">
                          <div className="flex items-center gap-1">
                            <Pill className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-muted-foreground">
                              {medCount} med{medCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                          {rx.followUpDate && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-muted-foreground">
                                Follow-up: {rx.followUpDate}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ScrollArea>
      )}

      {/* Prescription Detail Dialog */}
      <PrescriptionDetailDialog
        prescription={selectedPrescription}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />
    </div>
  )
}
