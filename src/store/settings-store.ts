import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'en' | 'bn'
type Theme = 'light' | 'dark' | 'system'

interface SettingsStore {
  language: Language
  theme: Theme
  sidebarCollapsed: boolean
  languageDetected: boolean

  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
  detectAndSetLanguage: () => void
}

/**
 * Detect browser language preference.
 * Returns 'bn' if the browser language starts with 'bn', otherwise 'en'.
 */
function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en'
  const lang = navigator.language || (navigator as { userLanguage?: string }).userLanguage || 'en'
  return lang.startsWith('bn') ? 'bn' : 'en'
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      theme: 'system',
      sidebarCollapsed: false,
      languageDetected: false,

      // ─── Language ─────────────────────────────────────────────────────
      setLanguage: (language) => set({ language, languageDetected: true }),

      // ─── Browser Language Auto-Detection ──────────────────────────────
      detectAndSetLanguage: () => {
        // Only detect if user hasn't explicitly chosen a language yet
        if (!get().languageDetected) {
          const detected = detectBrowserLanguage()
          set({ language: detected, languageDetected: true })
        }
      },

      // ─── Theme ────────────────────────────────────────────────────────
      setTheme: (theme) => set({ theme }),

      // ─── Sidebar ──────────────────────────────────────────────────────
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'rxbd-settings',
    }
  )
)
