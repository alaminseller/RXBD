'use client'

import React, { useState, useCallback, useRef } from 'react'
import { BlobProvider } from '@react-pdf/renderer'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, Download, Printer, FileText } from 'lucide-react'
import { PrescriptionPDF } from './prescription-pdf'
import type { Prescription, Doctor, Patient, DoctorSettings } from '@/types'

interface PDFViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  prescription: Prescription
  doctor: Doctor
  patient: Patient
  settings?: DoctorSettings
}

export function PDFViewerDialog({
  open,
  onOpenChange,
  prescription,
  doctor,
  patient,
  settings,
}: PDFViewerDialogProps) {
  const blobUrlRef = useRef<string | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  const handleDownload = useCallback(() => {
    if (!blobUrl) return

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `prescription-${prescription.id.slice(0, 8)}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [blobUrl, prescription.id])

  const handlePrint = useCallback(() => {
    if (!blobUrl) return

    const printWindow = window.open(blobUrl, '_blank')
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print()
      })
    }
  }, [blobUrl])

  const handleBlobReady = useCallback((url: string | null) => {
    if (url && url !== blobUrlRef.current) {
      // Revoke the old blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
      }
      blobUrlRef.current = url
      setBlobUrl(url)
    }
  }, [])

  const prescriptionDoc = (
    <PrescriptionPDF
      prescription={prescription}
      doctor={doctor}
      patient={patient}
      settings={settings}
    />
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[95vw] max-h-[95vh] p-0 gap-0 overflow-hidden"
        showCloseButton
      >
        <DialogHeader className="px-6 pt-6 pb-3">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Prescription Preview
          </DialogTitle>
          <DialogDescription>
            Preview, download, or print the prescription PDF for{' '}
            {patient.name}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 pb-2 flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            disabled={!blobUrl}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Download className="h-4 w-4 mr-1" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            disabled={!blobUrl}
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>

        <div className="px-6 pb-6 flex-1 overflow-hidden">
          <BlobProvider document={prescriptionDoc}>
            {({ url, loading: blobLoading, error: blobError }) => {
              // Track the blob URL via ref
              if (url && url !== blobUrlRef.current) {
                handleBlobReady(url)
              }

              if (blobLoading || !url) {
                return (
                  <div className="flex flex-col items-center justify-center h-[70vh] bg-gray-50 rounded-lg border">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
                    <p className="text-muted-foreground text-sm">
                      Generating PDF preview...
                    </p>
                  </div>
                )
              }

              if (blobError) {
                return (
                  <div className="flex flex-col items-center justify-center h-[70vh] bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-600 text-sm font-medium">
                      Error generating PDF
                    </p>
                    <p className="text-red-500 text-xs mt-1">
                      {blobError.message || 'Unknown error occurred'}
                    </p>
                  </div>
                )
              }

              return (
                <div className="border rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={`${url}#toolbar=0&navpanes=0`}
                    className="w-full border-0"
                    style={{ height: '70vh' }}
                    title="Prescription PDF Preview"
                  />
                </div>
              )
            }}
          </BlobProvider>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PDFViewerDialog
