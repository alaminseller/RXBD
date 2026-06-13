import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Doctor, Subscription } from '@/types'

/**
 * Session token key used for API authentication headers.
 */
const SESSION_TOKEN_KEY = 'rxbd-session-token'

interface AuthStore {
  doctor: Doctor | null
  subscription: Subscription | null
  isAuthenticated: boolean
  isLoading: boolean

  setDoctor: (doctor: Doctor | null) => void
  setSubscription: (subscription: Subscription | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<Doctor>) => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      doctor: null,
      subscription: null,
      isAuthenticated: false,
      isLoading: false,

      // ─── Setters ──────────────────────────────────────────────────────
      setDoctor: (doctor) =>
        set({
          doctor,
          isAuthenticated: !!doctor,
        }),

      setSubscription: (subscription) => set({ subscription }),

      setLoading: (isLoading) => set({ isLoading }),

      // ─── Login ────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(
              (errorData as { error?: string }).error ||
                'Login failed. Please check your credentials.'
            )
          }

          const data = (await response.json()) as {
            doctor: Doctor
            subscription: Subscription | null
            token: string
          }

          // Store session token for API authentication
          if (typeof window !== 'undefined') {
            localStorage.setItem(SESSION_TOKEN_KEY, data.token)
          }

          set({
            doctor: data.doctor,
            subscription: data.subscription,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // ─── Logout ───────────────────────────────────────────────────────
      logout: () => {
        // Attempt to notify the server (fire-and-forget)
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem(SESSION_TOKEN_KEY)
            : null

        if (token) {
          fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }).catch(() => {
            // Silently ignore logout API failures
          })
        }

        // Clear session token
        if (typeof window !== 'undefined') {
          localStorage.removeItem(SESSION_TOKEN_KEY)
        }

        set({
          doctor: null,
          subscription: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },

      // ─── Update Profile ───────────────────────────────────────────────
      updateProfile: async (data) => {
        const { doctor } = get()
        if (!doctor) {
          throw new Error('Not authenticated')
        }

        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem(SESSION_TOKEN_KEY)
            : null

        const response = await fetch('/api/auth/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            (errorData as { error?: string }).error ||
              'Failed to update profile.'
          )
        }

        const updatedDoctor = (await response.json()) as Doctor
        set({ doctor: updatedDoctor })
      },
    }),
    {
      name: 'rxbd-auth',
      partialize: (state) => ({
        doctor: state.doctor,
        subscription: state.subscription,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

/**
 * Helper to retrieve the current session token for use in API calls.
 * Should be called client-side only.
 */
export function getSessionToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(SESSION_TOKEN_KEY)
}

/**
 * Helper to build authenticated fetch headers.
 */
export function authHeaders(): Record<string, string> {
  const token = getSessionToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}
