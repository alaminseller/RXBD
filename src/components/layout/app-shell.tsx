'use client'

import { useState, type ReactNode } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useSettingsStore } from '@/store/settings-store'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  FilePlus2,
  Users,
  FileText,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Stethoscope,
  ChevronLeft,
  Languages,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavItem = 'dashboard' | 'composer' | 'patients' | 'prescriptions' | 'settings' | 'subscription'

interface NavConfig {
  id: NavItem
  label: string
  icon: ReactNode
}

const NAV_ITEMS: NavConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'composer', label: 'New Prescription', icon: <FilePlus2 className="h-5 w-5" /> },
  { id: 'patients', label: 'Patients', icon: <Users className="h-5 w-5" /> },
  { id: 'prescriptions', label: 'Prescriptions', icon: <FileText className="h-5 w-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
  { id: 'subscription', label: 'Subscription', icon: <CreditCard className="h-5 w-5" /> },
]

interface AppShellProps {
  activeNav: NavItem
  onNavigate: (nav: NavItem) => void
  children: (activeNav: NavItem) => ReactNode
}

export function AppShell({ activeNav, onNavigate, children }: AppShellProps) {
  const doctor = useAuthStore((s) => s.doctor)
  const logout = useAuthStore((s) => s.logout)
  const subscription = useAuthStore((s) => s.subscription)
  const sidebarCollapsed = useSettingsStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useSettingsStore((s) => s.toggleSidebar)
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)

  const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active'

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (id: NavItem) => {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out border-r border-sidebar-border',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
            <Stethoscope className="h-4 w-4" />
          </div>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h2 className="text-lg font-bold text-sidebar-foreground">RxBD</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent h-7 w-7"
            onClick={toggleSidebar}
          >
            <ChevronLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
          </Button>
        </div>

        {/* Nav Items */}
        <ScrollArea className="flex-1 py-2">
          <nav className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  activeNav === item.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-3">
          {!sidebarCollapsed && (
            <div className="mb-2 px-2">
              <div className="text-xs text-sidebar-foreground/50">
                {doctor?.name || 'Doctor'}
              </div>
              <div className="text-xs text-sidebar-foreground/40">
                {doctor?.specialty || 'Physician'}
              </div>
              {isPremium && (
                <Badge className="mt-1 bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-[10px]">
                  Premium
                </Badge>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size={sidebarCollapsed ? 'icon' : 'default'}
            className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!sidebarCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="hidden sm:block">
              <h1 className="text-sm font-medium">
                {NAV_ITEMS.find((n) => n.id === activeNav)?.label || 'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              className="gap-1 text-xs"
            >
              <Languages className="h-3.5 w-3.5" />
              {language === 'en' ? 'বাং' : 'EN'}
            </Button>

            {/* Doctor Name */}
            <div className="hidden sm:flex items-center gap-2">
              <Separator orientation="vertical" className="h-6" />
              <span className="text-sm text-muted-foreground">
                Dr. {doctor?.name?.split(' ').pop() || 'Doctor'}
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div
              className="w-64 h-full bg-sidebar text-sidebar-foreground flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
                <div className="w-8 h-8 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <h2 className="text-lg font-bold">RxBD</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto text-sidebar-foreground/70"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <nav className="flex-1 py-2 space-y-1 px-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      activeNav === item.id
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="border-t border-sidebar-border p-3">
                <Button
                  variant="ghost"
                  className="w-full text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children(activeNav)}
        </main>
      </div>
    </div>
  )
}
