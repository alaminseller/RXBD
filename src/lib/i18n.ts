'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSettingsStore } from '@/store/settings-store'

// ─── In-memory locale cache ───
const localeCache: Record<string, Record<string, unknown>> = {}

/**
 * Load a locale JSON file and cache it in memory.
 * Returns the parsed locale object or an empty object on failure.
 */
async function loadLocale(lang: string): Promise<Record<string, unknown>> {
  if (localeCache[lang]) return localeCache[lang]

  try {
    const response = await fetch(`/locales/${lang}.json`)
    if (!response.ok) throw new Error(`Failed to load locale: ${lang}`)
    const data = await response.json()
    localeCache[lang] = data
    return data
  } catch {
    console.warn(`[i18n] Failed to load locale "${lang}", falling back to key display.`)
    return {}
  }
}

/**
 * Resolve a nested key like "composer.medications.title" from a flat/nested object.
 * Returns the key itself if not found (graceful fallback).
 */
function resolveKey(obj: Record<string, unknown>, key: string): string {
  const parts = key.split('.')
  let current: unknown = obj

  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return key // Key not found, return the key itself
    }
    current = (current as Record<string, unknown>)[part]
  }

  if (typeof current === 'string') return current
  return key // Not a string, return key
}

/**
 * Detect browser language preference.
 * Returns 'bn' if the browser language starts with 'bn', otherwise 'en'.
 */
export function detectBrowserLanguage(): 'en' | 'bn' {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
  return lang.startsWith('bn') ? 'bn' : 'en'
}

/**
 * Lightweight i18n hook for RxBD.
 *
 * - Reads locale from the settings store (language field)
 * - Falls back to browser language detection on first visit
 * - Caches loaded locale in memory
 * - Returns the key itself if translation is missing (graceful fallback)
 * - Supports nested keys like "composer.medications.title"
 */
export function useTranslation() {
  const language = useSettingsStore((s) => s.language)
  const [locale, setLocale] = useState<Record<string, unknown>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      const data = await loadLocale(language)
      if (!cancelled) {
        setLocale(data)
        setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [language])

  const t = useCallback((key: string): string => {
    return resolveKey(locale, key)
  }, [locale])

  return { t, language, isLoading }
}

/**
 * Non-hook utility for server-side or one-off translations.
 * Loads the locale on demand and caches it.
 */
export async function getTranslation(lang: string): Promise<(key: string) => string> {
  const data = await loadLocale(lang)
  return (key: string) => resolveKey(data, key)
}
