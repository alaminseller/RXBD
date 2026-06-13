'use client'

import { useState, useCallback, useRef } from 'react'
import { searchMedicines } from '@/lib/medicine-search'
import type { Medicine } from '@/types'

/**
 * Custom hook for searching medicines with debounced input.
 *
 * Uses the Fuse.js-powered search engine in `@/lib/medicine-search`
 * and debounces user input by 200ms before triggering a search.
 *
 * @returns Search state and control functions
 */
export function useMedicineSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Debounced search handler ─────────────────────────────────────────
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)
    setSelectedMedicine(null)

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // If query is too short, clear results immediately
    if (newQuery.length < 2) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // Debounce search by 200ms
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const searchResults = await searchMedicines(newQuery)
        setResults(searchResults)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 200)
  }, [])

  // ─── Select a medicine from search results ────────────────────────────
  const selectMedicine = useCallback((medicine: Medicine) => {
    setSelectedMedicine(medicine)
    setQuery(medicine.brand)
    setResults([])
  }, [])

  // ─── Clear the entire search state ────────────────────────────────────
  const clearSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    setQuery('')
    setResults([])
    setIsLoading(false)
    setSelectedMedicine(null)
  }, [])

  return {
    /** Current search query string */
    query,
    /** Update the search query (debounced automatically) */
    setQuery: handleQueryChange,
    /** Array of medicine search results */
    results,
    /** Whether a search is currently in progress */
    isLoading,
    /** The currently selected medicine (null if none selected) */
    selectedMedicine,
    /** Select a medicine from the results list */
    selectMedicine,
    /** Clear all search state */
    clearSearch,
  }
}
