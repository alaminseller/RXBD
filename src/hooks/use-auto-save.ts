'use client'

import { useEffect, useRef, useCallback } from 'react'
import { usePrescriptionStore } from '@/store/prescription-store'

/**
 * Custom hook for auto-saving prescription composer state.
 *
 * Watches the prescription store's `isDirty` flag and periodically
 * persists the draft to localStorage via the store's `markSaved` action.
 * On mount, it checks for existing drafts and provides utilities to
 * resume or discard them.
 *
 * @param intervalMs - Auto-save interval in milliseconds (default: 10000)
 * @returns Object containing draft state and control functions
 */
export function useAutoSave(intervalMs: number = 10000) {
  const {
    isDirty,
    lastSavedAt,
    patientId,
    medications,
    markSaved,
    resetComposer,
    loadDraft,
  } = usePrescriptionStore()

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasPromptedRef = useRef(false)

  // ─── Check for existing draft on mount ────────────────────────────────
  const hasDraft = !!(patientId || medications.length > 0)

  // ─── Auto-save timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return

    timerRef.current = setInterval(() => {
      const currentState = usePrescriptionStore.getState()
      if (currentState.isDirty) {
        // The persist middleware already syncs to localStorage.
        // We just need to update the saved timestamp and clear the dirty flag.
        currentState.markSaved()
      }
    }, intervalMs)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isDirty, intervalMs])

  // ─── Prompt user to resume draft (only once per mount) ────────────────
  useEffect(() => {
    if (hasPromptedRef.current) return
    hasPromptedRef.current = true

    // We delay the check slightly so the store has time to hydrate from localStorage
    const timeout = setTimeout(() => {
      const state = usePrescriptionStore.getState()
      const hasExistingDraft = !!(state.patientId || state.medications.length > 0)

      if (hasExistingDraft && !state.isDirty) {
        // Draft exists from a previous session — signal to UI layer
        // The UI component using this hook can check `hasDraft` and show a dialog
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [])

  // ─── Resume draft from localStorage ───────────────────────────────────
  const resumeDraft = useCallback(() => {
    // The persisted store already has the draft data hydrated.
    // We just need to mark it as loaded with a fresh timestamp.
    const state = usePrescriptionStore.getState()
    loadDraft({
      patientId: state.patientId,
      patientName: state.patientName,
      patientAge: state.patientAge,
      patientGender: state.patientGender,
      bloodPressure: state.bloodPressure,
      pulse: state.pulse,
      temperature: state.temperature,
      weight: state.weight,
      spO2: state.spO2,
      diagnosis: state.diagnosis,
      clinicalNotes: state.clinicalNotes,
      advice: state.advice,
      followUpDate: state.followUpDate,
      medications: state.medications,
    })
  }, [loadDraft])

  // ─── Discard the current draft ────────────────────────────────────────
  const discardDraft = useCallback(() => {
    resetComposer()
  }, [resetComposer])

  return {
    /** Timestamp (ms) when the draft was last auto-saved */
    lastSavedAt,
    /** Whether there is a draft that can be resumed */
    hasDraft,
    /** Resume editing the existing draft */
    resumeDraft,
    /** Discard the current draft and start fresh */
    discardDraft,
  }
}
