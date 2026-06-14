'use client'

import { useState, useCallback, useRef } from 'react'
import type { Patient } from '@/types'

/**
 * Custom hook for looking up patients by name or phone number.
 *
 * Searches the local database via the `/api/patients/search` endpoint
 * with a debounced query to avoid excessive API calls.
 *
 * @returns Patient search state and control functions
 */
export function usePatientLookup() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Debounced search handler ─────────────────────────────────────────
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)
    setSelectedPatient(null)

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // If query is empty, clear results immediately
    if (!newQuery.trim()) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // Debounce search by 300ms (slightly longer for API calls)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ q: newQuery.trim() })
        const response = await fetch(`/api/patients/search?${params}`)

        if (!response.ok) {
          setResults([])
          return
        }

        const data = (await response.json()) as Patient[]
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }, [])

  // ─── Select a patient from search results ─────────────────────────────
  const selectPatient = useCallback((patient: Patient) => {
    setSelectedPatient(patient)
    setQuery(patient.name)
    setResults([])
  }, [])

  // ─── Clear the entire search/selection state ──────────────────────────
  const clearSelection = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    setQuery('')
    setResults([])
    setIsLoading(false)
    setSelectedPatient(null)
  }, [])

  return {
    /** Current search query string */
    query,
    /** Update the search query (debounced automatically) */
    setQuery: handleQueryChange,
    /** Array of patient search results */
    results,
    /** Whether a search is currently in progress */
    isLoading,
    /** The currently selected patient (null if none selected) */
    selectedPatient,
    /** Select a patient from the results list */
    selectPatient,
    /** Clear all search state and selection */
    clearSelection,
  }
}
