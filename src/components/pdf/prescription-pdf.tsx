'use client'

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
  Link,
} from '@react-pdf/renderer'
import type {
  Prescription,
  Doctor,
  Patient,
  DoctorSettings,
  Medication,
} from '@/types'

// Register a clean font for the PDF
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
    { src: 'Helvetica-Oblique', fontStyle: 'italic' },
  ],
})

// A4 dimensions in points
const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const CONTENT_MARGIN = 40
const CONTENT_WIDTH = PAGE_WIDTH - CONTENT_MARGIN * 2

// Colors
const TEAL_DARK = '#0d6b6e'
const TEAL_MEDIUM = '#14919b'
const TEXT_PRIMARY = '#1a1a2e'
const TEXT_SECONDARY = '#4a4a68'
const TEXT_MUTED = '#7a7a8e'
const BORDER_COLOR = '#d1d5db'
const SECTION_BG = '#f8fafb'
const RX_SYMBOL_COLOR = '#0d6b6e'
const DIVIDER_COLOR = '#c8d0d8'

interface PrescriptionPDFProps {
  prescription: Prescription
  doctor: Doctor
  patient: Patient
  settings?: DoctorSettings
}

// Create styles
const createStyles = (fontSize: 'small' | 'medium' | 'large' = 'medium') => {
  const scale =
    fontSize === 'small' ? 0.88 : fontSize === 'large' ? 1.15 : 1

  return StyleSheet.create({
    page: {
      fontFamily: 'Helvetica',
      fontSize: 10 * scale,
      padding: CONTENT_MARGIN,
      color: TEXT_PRIMARY,
      lineHeight: 1.4,
    },
    // Header section
    headerContainer: {
      marginBottom: 12,
      paddingBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: TEAL_DARK,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    headerLeft: {
      flex: 1,
    },
    doctorName: {
      fontSize: 18 * scale,
      fontFamily: 'Helvetica',
      fontWeight: 'bold',
      color: TEAL_DARK,
      marginBottom: 2,
    },
    doctorDegrees: {
      fontSize: 9 * scale,
      color: TEXT_SECONDARY,
      marginBottom: 2,
    },
    doctorSpecialty: {
      fontSize: 10 * scale,
      color: TEAL_DARK,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    chamberName: {
      fontSize: 10 * scale,
      fontWeight: 'bold',
      color: TEXT_PRIMARY,
      marginBottom: 1,
    },
    chamberAddress: {
      fontSize: 8.5 * scale,
      color: TEXT_SECONDARY,
      marginBottom: 1,
    },
    chamberPhone: {
      fontSize: 8.5 * scale,
      color: TEXT_SECONDARY,
    },
    headerRight: {
      alignItems: 'flex-end',
    },
    logoPlaceholder: {
      width: 60,
      height: 60,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: BORDER_COLOR,
      backgroundColor: SECTION_BG,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoText: {
      fontSize: 7,
      color: TEXT_MUTED,
    },

    // Patient info section
    patientSection: {
      marginTop: 10,
      marginBottom: 8,
      padding: 8,
      backgroundColor: SECTION_BG,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: BORDER_COLOR,
    },
    patientRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    patientLabel: {
      fontSize: 8.5 * scale,
      color: TEXT_MUTED,
      width: 70,
    },
    patientValue: {
      fontSize: 9.5 * scale,
      color: TEXT_PRIMARY,
      fontWeight: 'bold',
      flex: 1,
    },
    patientRight: {
      alignItems: 'flex-end',
    },
    dateText: {
      fontSize: 8.5 * scale,
      color: TEXT_SECONDARY,
    },
    prescriptionId: {
      fontSize: 7.5 * scale,
      color: TEXT_MUTED,
      marginTop: 2,
    },

    // Vitals section
    vitalsSection: {
      marginTop: 6,
      marginBottom: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    vitalChip: {
      backgroundColor: SECTION_BG,
      borderWidth: 1,
      borderColor: BORDER_COLOR,
      borderRadius: 3,
      paddingHorizontal: 8,
      paddingVertical: 3,
      marginRight: 4,
      marginBottom: 4,
    },
    vitalLabel: {
      fontSize: 7 * scale,
      color: TEXT_MUTED,
      textTransform: 'uppercase',
    },
    vitalValue: {
      fontSize: 9 * scale,
      color: TEXT_PRIMARY,
      fontWeight: 'bold',
    },

    // Divider
    divider: {
      borderBottomWidth: 1,
      borderBottomColor: DIVIDER_COLOR,
      marginVertical: 6,
    },

    // Rx symbol
    rxSymbol: {
      fontSize: 28 * scale,
      color: RX_SYMBOL_COLOR,
      fontWeight: 'bold',
      fontFamily: 'Helvetica',
      marginBottom: 6,
      marginTop: 2,
    },

    // Medications section
    medicationsSection: {
      marginBottom: 8,
    },
    medicationItem: {
      marginBottom: 8,
      paddingLeft: 20,
      position: 'relative',
    },
    medicationNumber: {
      position: 'absolute',
      left: 0,
      top: 0,
      fontSize: 10 * scale,
      fontWeight: 'bold',
      color: TEAL_DARK,
      width: 16,
      textAlign: 'right',
    },
    medicationBrand: {
      fontSize: 11 * scale,
      fontWeight: 'bold',
      color: TEXT_PRIMARY,
    },
    medicationGeneric: {
      fontSize: 9 * scale,
      color: TEXT_SECONDARY,
      fontStyle: 'italic',
    },
    medicationStrength: {
      fontSize: 9.5 * scale,
      color: TEXT_PRIMARY,
      fontWeight: 'bold',
    },
    medicationDetails: {
      flexDirection: 'row',
      marginTop: 2,
      gap: 4,
    },
    medicationDetailChip: {
      fontSize: 8.5 * scale,
      color: TEAL_DARK,
      backgroundColor: '#e8f5f5',
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 2,
      marginRight: 4,
    },
    medicationInstruction: {
      fontSize: 8.5 * scale,
      color: TEXT_SECONDARY,
      marginTop: 1,
      fontStyle: 'italic',
    },

    // Clinical sections
    clinicalSection: {
      marginBottom: 6,
    },
    sectionLabel: {
      fontSize: 9.5 * scale,
      fontWeight: 'bold',
      color: TEAL_DARK,
      marginBottom: 3,
    },
    sectionContent: {
      fontSize: 9.5 * scale,
      color: TEXT_PRIMARY,
      paddingLeft: 8,
      lineHeight: 1.5,
    },

    // Follow-up
    followUpSection: {
      marginTop: 6,
      marginBottom: 8,
      padding: 6,
      backgroundColor: '#fef9e7',
      borderRadius: 3,
      borderWidth: 1,
      borderColor: '#f0d96b',
      flexDirection: 'row',
      alignItems: 'center',
    },
    followUpLabel: {
      fontSize: 9.5 * scale,
      fontWeight: 'bold',
      color: '#8a6d0b',
    },
    followUpValue: {
      fontSize: 9.5 * scale,
      fontWeight: 'bold',
      color: '#8a6d0b',
      marginLeft: 6,
    },

    // Signature area
    signatureArea: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    signatureBlock: {
      alignItems: 'center',
      width: 180,
    },
    signatureLine: {
      borderBottomWidth: 1,
      borderBottomColor: TEXT_PRIMARY,
      width: '100%',
      marginBottom: 3,
    },
    signatureName: {
      fontSize: 9 * scale,
      fontWeight: 'bold',
      color: TEXT_PRIMARY,
      textAlign: 'center',
    },
    signatureDegree: {
      fontSize: 7.5 * scale,
      color: TEXT_SECONDARY,
      textAlign: 'center',
    },

    // Footer
    footerContainer: {
      position: 'absolute',
      bottom: 20,
      left: CONTENT_MARGIN,
      right: CONTENT_MARGIN,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: DIVIDER_COLOR,
    },
    footerLeft: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    qrCodePlaceholder: {
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: BORDER_COLOR,
      backgroundColor: '#ffffff',
      marginRight: 8,
      padding: 3,
    },
    qrCodeInner: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    qrPixel: {
      width: 3.5,
      height: 3.5,
    },
    qrPixelBlack: {
      backgroundColor: TEXT_PRIMARY,
    },
    qrPixelWhite: {
      backgroundColor: '#ffffff',
    },
    footerText: {
      flexDirection: 'column',
    },
    verifiedText: {
      fontSize: 7.5 * scale,
      color: TEAL_DARK,
      fontWeight: 'bold',
    },
    verifyUrl: {
      fontSize: 7 * scale,
      color: TEXT_MUTED,
    },
    footerRight: {
      alignItems: 'flex-end',
    },
    bmdcText: {
      fontSize: 7.5 * scale,
      color: TEXT_MUTED,
    },
    generatedText: {
      fontSize: 6.5 * scale,
      color: TEXT_MUTED,
    },
  })
}

// Generate a deterministic QR-like pattern from a string
function generateQRPattern(id: string): boolean[][] {
  // Create a simple 12x12 deterministic pattern based on the ID
  const size = 12
  const pattern: boolean[][] = []

  // Simple hash function
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }

  // Create finder patterns (3 corners) + data area
  for (let row = 0; row < size; row++) {
    pattern[row] = []
    for (let col = 0; col < size; col++) {
      // Top-left finder pattern
      if (row < 3 && col < 3) {
        pattern[row][col] = !(row === 1 && col === 1) || true
        continue
      }
      // Top-right finder pattern
      if (row < 3 && col >= size - 3) {
        pattern[row][col] = !(row === 1 && col === size - 2) || true
        continue
      }
      // Bottom-left finder pattern
      if (row >= size - 3 && col < 3) {
        pattern[row][col] = !(row === size - 2 && col === 1) || true
        continue
      }
      // Data area - deterministic based on hash
      const seed = (hash + row * 31 + col * 17) & 0xffff
      pattern[row][col] = seed % 3 !== 0
    }
  }

  return pattern
}

// QR Code Placeholder Component
function QRCodePlaceholder({ prescriptionId }: { prescriptionId: string }) {
  const pattern = generateQRPattern(prescriptionId)
  const pixels: { black: boolean }[] = []

  for (let row = 0; row < pattern.length; row++) {
    for (let col = 0; col < pattern[row].length; col++) {
      pixels.push({ black: pattern[row][col] })
    }
  }

  return (
    <View style={styles.qrCodePlaceholder}>
      <View style={styles.qrCodeInner}>
        {pixels.map((pixel, i) => (
          <View
            key={i}
            style={[
              styles.qrPixel,
              pixel.black ? styles.qrPixelBlack : styles.qrPixelWhite,
            ]}
          />
        ))}
      </View>
    </View>
  )
}

// Vitals display component
function VitalsDisplay({
  prescription,
}: {
  prescription: Prescription
}) {
  const vitals = [
    { label: 'BP', value: prescription.bloodPressure },
    { label: 'Pulse', value: prescription.pulse },
    { label: 'Temp', value: prescription.temperature },
    { label: 'Weight', value: prescription.weight },
    { label: 'SpO2', value: prescription.spO2 },
  ].filter((v) => v.value && v.value.trim() !== '')

  if (vitals.length === 0) return null

  return (
    <View style={styles.vitalsSection}>
      {vitals.map((vital) => (
        <View key={vital.label} style={styles.vitalChip}>
          <Text style={styles.vitalLabel}>{vital.label}</Text>
          <Text style={styles.vitalValue}>{vital.value}</Text>
        </View>
      ))}
    </View>
  )
}

// Single medication display component
function MedicationDisplay({
  medication,
  index,
  scale,
}: {
  medication: Medication
  index: number
  scale: number
}) {
  return (
    <View style={styles.medicationItem}>
      <Text style={styles.medicationNumber}>{index + 1}.</Text>
      <View>
        <Text>
          <Text style={styles.medicationBrand}>{medication.brand}</Text>
          {medication.generic ? (
            <Text style={styles.medicationGeneric}>
              {' '}
              ({medication.generic})
            </Text>
          ) : null}
          {medication.strength ? (
            <Text style={styles.medicationStrength}>
              {' '}
              – {medication.strength}
            </Text>
          ) : null}
        </Text>
        <View style={styles.medicationDetails}>
          {medication.dosageForm ? (
            <Text style={styles.medicationDetailChip}>
              {medication.dosageForm}
            </Text>
          ) : null}
          {medication.frequency ? (
            <Text style={styles.medicationDetailChip}>
              {medication.frequency}
            </Text>
          ) : null}
          {medication.duration ? (
            <Text style={styles.medicationDetailChip}>
              {medication.duration}
            </Text>
          ) : null}
        </View>
        {medication.instructions ? (
          <Text style={styles.medicationInstruction}>
            {medication.instructions}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

// Format date for display
function formatDate(dateString: string): string {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

// Main Prescription PDF Document
export function PrescriptionPDF({
  prescription,
  doctor,
  patient,
  settings,
}: PrescriptionPDFProps) {
  const fontSize = settings?.fontSize || 'medium'
  const styles = createStyles(fontSize)

  const hasVitals =
    prescription.bloodPressure ||
    prescription.pulse ||
    prescription.temperature ||
    prescription.weight ||
    prescription.spO2

  const verifyUrl = `https://rxbd.com.bd/verify/${prescription.qrCode || prescription.id}`

  return (
    <Document
      title={`Prescription-${prescription.id}`}
      author={doctor.name}
      subject="Medical Prescription"
      creator="RxBD - Digital Prescription Platform"
    >
      <Page size="A4" style={styles.page}>
        {/* ===== HEADER SECTION ===== */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              {doctor.degrees && (
                <Text style={styles.doctorDegrees}>{doctor.degrees}</Text>
              )}
              {doctor.specialty && (
                <Text style={styles.doctorSpecialty}>
                  {doctor.specialty}
                </Text>
              )}
              {doctor.chamberName && (
                <Text style={styles.chamberName}>{doctor.chamberName}</Text>
              )}
              {doctor.chamberAddress && (
                <Text style={styles.chamberAddress}>
                  {doctor.chamberAddress}
                </Text>
              )}
              {doctor.chamberPhone && (
                <Text style={styles.chamberPhone}>
                  Ph: {doctor.chamberPhone}
                </Text>
              )}
            </View>
            <View style={styles.headerRight}>
              {settings?.letterheadLogoUrl ? (
                <View style={styles.logoPlaceholder}>
                  <Text style={styles.logoText}>LOGO</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* ===== PATIENT INFO SECTION ===== */}
        <View style={styles.patientSection}>
          <View style={styles.patientRow}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={styles.patientLabel}>Patient:</Text>
              <Text style={styles.patientValue}>{patient.name}</Text>
            </View>
            <View style={styles.patientRight}>
              <Text style={styles.dateText}>
                Date: {formatDate(prescription.date || prescription.createdAt)}
              </Text>
              <Text style={styles.prescriptionId}>
                ID: {prescription.id.slice(0, 8).toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.patientRow}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {patient.age && (
                <View style={{ flexDirection: 'row', marginRight: 16 }}>
                  <Text style={styles.patientLabel}>Age:</Text>
                  <Text style={styles.patientValue}>{patient.age}</Text>
                </View>
              )}
              {patient.gender && (
                <View style={{ flexDirection: 'row', marginRight: 16 }}>
                  <Text style={styles.patientLabel}>Gender:</Text>
                  <Text style={styles.patientValue}>{patient.gender}</Text>
                </View>
              )}
              {patient.phone && (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.patientLabel}>Phone:</Text>
                  <Text style={styles.patientValue}>{patient.phone}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ===== VITALS SECTION ===== */}
        {hasVitals && <VitalsDisplay prescription={prescription} />}

        <View style={styles.divider} />

        {/* ===== Rx SYMBOL & MEDICATIONS ===== */}
        <Text style={styles.rxSymbol}>℞</Text>

        {prescription.medications && prescription.medications.length > 0 && (
          <View style={styles.medicationsSection}>
            {prescription.medications.map((med, idx) => (
              <MedicationDisplay
                key={med.id || idx}
                medication={med}
                index={idx}
                scale={
                  fontSize === 'small'
                    ? 0.88
                    : fontSize === 'large'
                      ? 1.15
                      : 1
                }
              />
            ))}
          </View>
        )}

        <View style={styles.divider} />

        {/* ===== DIAGNOSIS SECTION ===== */}
        {prescription.diagnosis && (
          <View style={styles.clinicalSection}>
            <Text style={styles.sectionLabel}>Diagnosis:</Text>
            <Text style={styles.sectionContent}>{prescription.diagnosis}</Text>
          </View>
        )}

        {/* ===== CLINICAL NOTES SECTION ===== */}
        {prescription.clinicalNotes && (
          <View style={styles.clinicalSection}>
            <Text style={styles.sectionLabel}>Notes:</Text>
            <Text style={styles.sectionContent}>
              {prescription.clinicalNotes}
            </Text>
          </View>
        )}

        {/* ===== ADVICE SECTION ===== */}
        {prescription.advice && (
          <View style={styles.clinicalSection}>
            <Text style={styles.sectionLabel}>Advice:</Text>
            <Text style={styles.sectionContent}>{prescription.advice}</Text>
          </View>
        )}

        {/* ===== FOLLOW-UP SECTION ===== */}
        {prescription.followUpDate && (
          <View style={styles.followUpSection}>
            <Text style={styles.followUpLabel}>Next Visit:</Text>
            <Text style={styles.followUpValue}>
              {formatDate(prescription.followUpDate)}
            </Text>
          </View>
        )}

        {/* ===== SIGNATURE AREA ===== */}
        <View style={styles.signatureArea}>
          <View style={styles.signatureBlock}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>{doctor.name}</Text>
            {doctor.degrees && (
              <Text style={styles.signatureDegree}>{doctor.degrees}</Text>
            )}
            {doctor.specialty && (
              <Text style={styles.signatureDegree}>{doctor.specialty}</Text>
            )}
            {doctor.bmdcNumber && (
              <Text style={styles.signatureDegree}>
                BMDC: {doctor.bmdcNumber}
              </Text>
            )}
          </View>
        </View>

        {/* ===== FOOTER ===== */}
        <View style={styles.footerContainer} fixed>
          <View style={styles.footerLeft}>
            {settings?.includeQrCode !== false && (
              <QRCodePlaceholder prescriptionId={prescription.id} />
            )}
            <View style={styles.footerText}>
              <Text style={styles.verifiedText}>Verified via RxBD</Text>
              <Link src={verifyUrl} style={styles.verifyUrl}>
                {verifyUrl}
              </Link>
            </View>
          </View>
          <View style={styles.footerRight}>
            {doctor.bmdcNumber && (
              <Text style={styles.bmdcText}>
                BMDC Reg: {doctor.bmdcNumber}
              </Text>
            )}
            <Text style={styles.generatedText}>
              Generated: {new Date().toLocaleDateString('en-GB')}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default PrescriptionPDF
