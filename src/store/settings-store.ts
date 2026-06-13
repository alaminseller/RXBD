import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Language = 'en' | 'bn'
type Theme = 'light' | 'dark' | 'system'

interface SettingsStore {
  language: Language
  theme: Theme
  sidebarCollapsed: boolean

  setLanguage: (lang: Language) => void
  setTheme: (theme: Theme) => void
  toggleSidebar: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      language: 'en',
      theme: 'system',
      sidebarCollapsed: false,

      // ─── Language ─────────────────────────────────────────────────────
      setLanguage: (language) => set({ language }),

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
