import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Medication, ComposerState } from '@/types'

/**
 * Initial empty state for the prescription composer.
 * Used when resetting or initializing a fresh composer session.
 */
const initialComposerState: ComposerState = {
  patientId: null,
  patientName: '',
  patientAge: '',
  patientGender: '',
  chiefComplaints: '',
  bloodPressure: '',
  pulse: '',
  temperature: '',
  weight: '',
  spO2: '',
  onExamination: '',
  investigations: '',
  diagnosis: '',
  diagnosisCode: '',
  clinicalNotes: '',
  advice: '',
  followUpDate: '',
  medications: [],
  isDirty: false,
  lastSavedAt: null,
}

interface PrescriptionStore extends ComposerState {
  // Patient actions
  setPatient: (id: string, name: string, age: string, gender: string) => void
  clearPatient: () => void

  // Vitals actions
  setVitals: (vitals: Partial<Pick<ComposerState, 'bloodPressure' | 'pulse' | 'temperature' | 'weight' | 'spO2'>>) => void

  // Clinical actions
  setChiefComplaints: (cc: string) => void
  setOnExamination: (findings: string) => void
  setInvestigations: (investigations: string) => void
  setDiagnosis: (diagnosis: string) => void
  setDiagnosisCode: (code: string) => void
  setClinicalNotes: (notes: string) => void
  setAdvice: (advice: string) => void
  setFollowUpDate: (date: string) => void

  // Medication actions
  addMedication: (medication: Medication) => void
  updateMedication: (index: number, medication: Partial<Medication>) => void
  removeMedication: (index: number) => void
  reorderMedications: (fromIndex: number, toIndex: number) => void

  // Template actions
  loadTemplate: (template: Partial<ComposerState>) => void

  // Draft management
  markDirty: () => void
  markSaved: () => void
  resetComposer: () => void
  loadDraft: (draft: Partial<ComposerState>) => void
}

export const usePrescriptionStore = create<PrescriptionStore>()(
  persist(
    (set) => ({
      ...initialComposerState,

      // ─── Patient Actions ──────────────────────────────────────────────
      setPatient: (id, name, age, gender) =>
        set((state) => ({
          ...state,
          patientId: id,
          patientName: name,
          patientAge: age,
          patientGender: gender,
          isDirty: true,
        })),

      clearPatient: () =>
        set((state) => ({
          ...state,
          patientId: null,
          patientName: '',
          patientAge: '',
          patientGender: '',
          isDirty: true,
        })),

      // ─── Vitals Actions ───────────────────────────────────────────────
      setVitals: (vitals) =>
        set((state) => ({
          ...state,
          ...vitals,
          isDirty: true,
        })),

      // ─── Clinical Actions ─────────────────────────────────────────────
      setChiefComplaints: (cc) =>
        set((state) => ({ ...state, chiefComplaints: cc, isDirty: true })),

      setOnExamination: (findings) =>
        set((state) => ({ ...state, onExamination: findings, isDirty: true })),

      setInvestigations: (investigations) =>
        set((state) => ({ ...state, investigations, isDirty: true })),

      setDiagnosis: (diagnosis) =>
        set((state) => ({ ...state, diagnosis, isDirty: true })),

      setDiagnosisCode: (code) =>
        set((state) => ({ ...state, diagnosisCode: code, isDirty: true })),

      setClinicalNotes: (notes) =>
        set((state) => ({ ...state, clinicalNotes: notes, isDirty: true })),

      setAdvice: (advice) =>
        set((state) => ({ ...state, advice, isDirty: true })),

      setFollowUpDate: (date) =>
        set((state) => ({ ...state, followUpDate: date, isDirty: true })),

      // ─── Medication Actions ───────────────────────────────────────────
      addMedication: (medication) =>
        set((state) => ({
          ...state,
          medications: [...state.medications, medication],
          isDirty: true,
        })),

      updateMedication: (index, partial) =>
        set((state) => {
          if (index < 0 || index >= state.medications.length) return state
          const updated = [...state.medications]
          updated[index] = { ...updated[index], ...partial }
          return { ...state, medications: updated, isDirty: true }
        }),

      removeMedication: (index) =>
        set((state) => {
          if (index < 0 || index >= state.medications.length) return state
          const updated = state.medications.filter((_, i) => i !== index)
          return { ...state, medications: updated, isDirty: true }
        }),

      reorderMedications: (fromIndex, toIndex) =>
        set((state) => {
          const meds = [...state.medications]
          if (
            fromIndex < 0 ||
            fromIndex >= meds.length ||
            toIndex < 0 ||
            toIndex >= meds.length
          ) {
            return state
          }
          const [moved] = meds.splice(fromIndex, 1)
          meds.splice(toIndex, 0, moved)
          return { ...state, medications: meds, isDirty: true }
        }),

      // ─── Template Actions ─────────────────────────────────────────────
      loadTemplate: (template) =>
        set((state) => ({
          ...state,
          ...template,
          isDirty: true,
        })),

      // ─── Draft Management ─────────────────────────────────────────────
      markDirty: () => set((state) => ({ ...state, isDirty: true })),

      markSaved: () =>
        set((state) => ({
          ...state,
          isDirty: false,
          lastSavedAt: Date.now(),
        })),

      resetComposer: () => set({ ...initialComposerState }),

      loadDraft: (draft) =>
        set((state) => ({
          ...state,
          ...draft,
          isDirty: false,
          lastSavedAt: Date.now(),
        })),
    }),
    {
      name: 'rxbd-draft',
      partialize: (state) => {
        // Only persist composer data, not transient UI flags like isDirty.
        const { isDirty, ...persistable } = state
        return persistable
      },
    }
  )
)
