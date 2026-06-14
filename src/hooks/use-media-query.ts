'use client'

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react'

/**
 * Custom hook for responsive breakpoint detection.
 *
 * Usage:
 *   const isTablet = useMediaQuery('(min-width: 640px)')
 *   const isDesktop = useMediaQuery('(min-width: 1024px)')
 *
 * Returns `false` during SSR and initial hydration to avoid mismatches.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', callback)
      return () => mql.removeEventListener('change', callback)
    },
    [query],
  )

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = useCallback(() => false, [])

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/**
 * Pre-built breakpoint hooks matching Tailwind CSS defaults.
 * All return false during SSR.
 */
export function useIsSm() {
  return useMediaQuery('(min-width: 640px)')
}

export function useIsMd() {
  return useMediaQuery('(min-width: 768px)')
}

export function useIsLg() {
  return useMediaQuery('(min-width: 1024px)')
}

export function useIsXl() {
  return useMediaQuery('(min-width: 1280px)')
}

/**
 * Returns the current breakpoint name for the composer layout.
 * - 'desktop'  : >= 1024px (3-panel layout)
 * - 'tablet'   : 640px–1023px (tabbed interface)
 * - 'phone'    : < 640px (tabbed + accordion)
 */
export function useComposerBreakpoint(): 'desktop' | 'tablet' | 'phone' {
  const isLg = useIsLg()
  const isSm = useIsSm()

  if (isLg) return 'desktop'
  if (isSm) return 'tablet'
  return 'phone'
}

/**
 * Returns a memoized callback for checking a media query match.
 * Useful for one-time checks rather than reactive state.
 */
export function useMediaQueryCallback() {
  return useCallback((query: string) => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  }, [])
}
