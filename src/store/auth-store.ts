import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Doctor, Subscription } from '@/types'

/**
 * Session token key used for legacy API authentication headers.
 * Supabase auth uses cookies instead, so this is a fallback.
 */
const SESSION_TOKEN_KEY = 'rxbd-session-token'

interface AuthStore {
  doctor: Doctor | null
  subscription: Subscription | null
  isAuthenticated: boolean
  isLoading: boolean
  onboardingCompleted: boolean

  setDoctor: (doctor: Doctor | null) => void
  setSubscription: (subscription: Subscription | null) => void
  setLoading: (loading: boolean) => void
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, specialty?: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<Doctor>) => Promise<void>
  completeOnboarding: () => void
  resetOnboarding: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      doctor: null,
      subscription: null,
      isAuthenticated: false,
      isLoading: false,
      onboardingCompleted: false,

      // ─── Setters ──────────────────────────────────────────────────────
      setDoctor: (doctor) =>
        set({
          doctor,
          isAuthenticated: !!doctor,
        }),

      setSubscription: (subscription) => set({ subscription }),

      setLoading: (isLoading) => set({ isLoading }),

      // ─── Login (Supabase + API) ──────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          // Step 1: Authenticate with Supabase
          const { createClient: createSupabaseClient } = await import('@/utils/supabase/client')
          const supabase = createSupabaseClient()
          const { error: supabaseError } = await supabase.auth.signInWithPassword({
            email,
            password,
          })

          if (supabaseError) {
            // If Supabase auth fails, try legacy login as fallback
            console.warn('Supabase login failed, trying legacy:', supabaseError.message)
          }

          // Step 2: Call our login API to get doctor data
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

          const result = await response.json() as {
            success: boolean
            data: {
              id: string
              email: string
              name: string
              specialty: string
              degrees: string
              bmdcNumber: string
              phone: string
              avatarUrl: string
              chamberName: string
              chamberAddress: string
              chamberPhone: string
              chamberEmail: string
              emailVerified: boolean
              supabaseUid: string
              createdAt: string
              updatedAt: string
              settings?: Doctor['settings']
              subscription?: Subscription | null
              token: string
            }
          }

          const doctorData = result.data

          // Store session token for legacy API authentication
          if (typeof window !== 'undefined') {
            localStorage.setItem(SESSION_TOKEN_KEY, doctorData.token)
          }

          set({
            doctor: doctorData as unknown as Doctor,
            subscription: doctorData.subscription ?? null,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // ─── Signup (Supabase + API) ─────────────────────────────────────
      signup: async (email, password, name, specialty) => {
        set({ isLoading: true })
        try {
          // Step 1: Create Supabase auth user
          let supabaseUid = ''
          try {
            const { createClient: createSupabaseClient } = await import('@/utils/supabase/client')
            const supabase = createSupabaseClient()
            const { data, error: supabaseError } = await supabase.auth.signUp({
              email,
              password,
            })

            if (supabaseError) {
              console.warn('Supabase signup failed, continuing with local:', supabaseError.message)
            } else if (data.user) {
              supabaseUid = data.user.id
            }
          } catch (err) {
            console.warn('Supabase client not available for signup:', err)
          }

          // Step 2: Create Doctor record in our DB
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              password,
              name,
              specialty,
              supabaseUid,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(
              (errorData as { error?: string }).error || 'Registration failed.'
            )
          }

          set({ isLoading: false })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      // ─── Logout ───────────────────────────────────────────────────────
      logout: () => {
        // Sign out from Supabase
        ;(async () => {
          try {
            const { createClient: createSupabaseClient } = await import('@/utils/supabase/client')
            const supabase = createSupabaseClient()
            await supabase.auth.signOut()
          } catch {
            // Ignore Supabase sign-out errors
          }
        })()

        // Notify server (fire-and-forget)
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
          }).catch(() => {})
        } else {
          fetch('/api/auth/logout', {
            method: 'POST',
          }).catch(() => {})
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
          onboardingCompleted: false,
        })
      },

      // ─── Onboarding ────────────────────────────────────────────────────
      completeOnboarding: () => set({ onboardingCompleted: true }),

      resetOnboarding: () => set({ onboardingCompleted: false }),

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
        onboardingCompleted: state.onboardingCompleted,
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
