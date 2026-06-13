// RxBD Type Definitions

export interface Doctor {
  id: string
  email: string
  name: string
  password: string
  degrees: string
  specialty: string
  bmdcNumber: string
  phone: string
  avatarUrl: string
  chamberName: string
  chamberAddress: string
  chamberPhone: string
  chamberEmail: string
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  settings?: DoctorSettings
  subscription?: Subscription
}

export interface DoctorSettings {
  id: string
  doctorId: string
  letterheadLogoUrl: string
  letterheadColor: string
  signatureUrl: string
  includeQrCode: boolean
  defaultLanguage: string
  fontSize: 'small' | 'medium' | 'large'
  autoSaveInterval: number
}

export interface Patient {
  id: string
  doctorId: string
  name: string
  age: string
  gender: string
  phone: string
  address: string
  bloodGroup: string
  allergies: string
  chronicDiseases: string
  consentGiven: boolean
  consentDate: string | null
  createdAt: string
  updatedAt: string
  prescriptions?: Prescription[]
}

export interface Medication {
  id: string
  brand: string
  generic: string
  strength: string
  dosageForm: string
  frequency: string
  duration: string
  instructions: string
}

export interface Prescription {
  id: string
  doctorId: string
  patientId: string
  date: string
  bloodPressure: string
  pulse: string
  temperature: string
  weight: string
  spO2: string
  diagnosis: string
  clinicalNotes: string
  advice: string
  followUpDate: string
  medications: Medication[]
  qrCode: string
  pdfUrl: string
  status: 'draft' | 'completed'
  createdAt: string
  updatedAt: string
  doctor?: Doctor
  patient?: Patient
}

export interface Subscription {
  id: string
  doctorId: string
  plan: 'free' | 'premium'
  startDate: string
  endDate: string | null
  prescriptionsUsed: number
  prescriptionsLimit: number
  paymentMethod: string
  transactionId: string
  status: 'active' | 'expired' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Medicine {
  id: string
  brand: string
  generic: string
  dosageForm: string
  strength: string
  manufacturer: string
  category: string
  tags: string[]
}

export interface GenericInfo {
  name: string
  category: string
  sideEffects: string
  typicalDosage: string
}

export interface MedicineFeedback {
  id: string
  doctorId: string
  medicineId: string
  feedbackType: 'correction' | 'addition' | 'removal'
  comment: string
  status: 'pending' | 'reviewed' | 'applied'
  createdAt: string
}

export interface AuditLog {
  id: string
  doctorId: string
  action: string
  entity: string
  entityId: string
  details: string
  ipAddress: string
  createdAt: string
}

// Composer state types
export interface ComposerState {
  patientId: string | null
  patientName: string
  patientAge: string
  patientGender: string
  bloodPressure: string
  pulse: string
  temperature: string
  weight: string
  spO2: string
  diagnosis: string
  clinicalNotes: string
  advice: string
  followUpDate: string
  medications: Medication[]
  isDirty: boolean
  lastSavedAt: number | null
}
