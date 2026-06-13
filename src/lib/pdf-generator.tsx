import { pdf } from '@react-pdf/renderer'
import { PrescriptionPDF } from '@/components/pdf/prescription-pdf'
import type { Prescription, Doctor, Patient, DoctorSettings } from '@/types'

/**
 * Generate a prescription PDF as a Blob using @react-pdf/renderer's pdf() function.
 * This can be used for programmatic PDF generation.
 */
export async function generatePrescriptionPDF(
  prescription: Prescription,
  doctor: Doctor,
  patient: Patient,
  settings?: DoctorSettings
): Promise<Blob> {
  const document = (
    <PrescriptionPDF
      prescription={prescription}
      doctor={doctor}
      patient={patient}
      settings={settings}
    />
  )

  const blob = await pdf(document).toBlob()
  return blob
}

/**
 * Generate the QR verification URL for a prescription.
 * This URL allows patients and pharmacists to verify the prescription authenticity.
 */
export function generateQRCodeUrl(prescriptionId: string): string {
  return `https://rxbd.com.bd/verify/${prescriptionId}`
}

/**
 * Generate a prescription PDF and trigger a download in the browser.
 * Returns the Blob for potential further processing.
 */
export async function downloadPrescriptionPDF(
  prescription: Prescription,
  doctor: Doctor,
  patient: Patient,
  settings?: DoctorSettings
): Promise<Blob> {
  const blob = await generatePrescriptionPDF(
    prescription,
    doctor,
    patient,
    settings
  )

  // Create download link
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = `prescription-${prescription.id.slice(0, 8)}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up after a short delay
  setTimeout(() => URL.revokeObjectURL(blobUrl), 5000)

  return blob
}

/**
 * Generate a prescription PDF and open it in a new tab for printing.
 */
export async function printPrescriptionPDF(
  prescription: Prescription,
  doctor: Doctor,
  patient: Patient,
  settings?: DoctorSettings
): Promise<void> {
  const blob = await generatePrescriptionPDF(
    prescription,
    doctor,
    patient,
    settings
  )

  const blobUrl = URL.createObjectURL(blob)
  const printWindow = window.open(blobUrl, '_blank')

  if (printWindow) {
    printWindow.addEventListener('load', () => {
      printWindow.print()
    })
  }

  // Clean up after a delay
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
}
