'use client'

import { useState, useSyncExternalStore, useCallback } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { AppShell, type NavItem } from '@/components/layout/app-shell'
import { DashboardHome } from '@/components/dashboard/dashboard-home'
import { PrescriptionComposer } from '@/components/composer/prescription-composer'
import { PatientList } from '@/components/patients/patient-list'
import { PrescriptionList } from '@/components/prescriptions/prescription-list'
import { SettingsPage } from '@/components/settings/settings-page'
import { SubscriptionPage } from '@/components/subscription/subscription-page'

type AuthView = 'login' | 'register'

// Hydration check: returns false on server, true on client after mount
const emptySubscribe = () => () => {}
function useHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const [authView, setAuthView] = useState<AuthView>('login')
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard')
  const hydrated = useHydrated()

  const navigateTo = useCallback((page: NavItem) => {
    setActiveNav(page)
  }, [])

  // Show nothing while hydrating to avoid flash
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground mt-3">Loading RxBD...</p>
        </div>
      </div>
    )
  }

  // Auth screens
  if (!isAuthenticated) {
    if (authView === 'register') {
      return <RegisterForm onSwitchToLogin={() => setAuthView('login')} />
    }
    return <LoginForm onSwitchToRegister={() => setAuthView('register')} />
  }

  // Dashboard layout
  return (
    <AppShell activeNav={activeNav} onNavigate={navigateTo}>
      {(nav: NavItem) => {
        switch (nav) {
          case 'dashboard':
            return <DashboardHome onNavigate={navigateTo} />
          case 'composer':
            return <PrescriptionComposer />
          case 'patients':
            return <PatientList onNavigateToComposer={() => navigateTo('composer')} />
          case 'prescriptions':
            return <PrescriptionList />
          case 'settings':
            return <SettingsPage />
          case 'subscription':
            return <SubscriptionPage />
          default:
            return <DashboardHome onNavigate={navigateTo} />
        }
      }}
    </AppShell>
  )
}
