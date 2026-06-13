'use client'

import { useAuthStore } from '@/store/auth-store'
import { useSubscription } from '@/hooks/use-subscription'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, FileText, TrendingUp, FilePlus2, UserPlus, Clock } from 'lucide-react'
import type { NavItem } from '@/components/layout/app-shell'

interface DashboardHomeProps {
  onNavigate: (page: NavItem) => void
}

export function DashboardHome({ onNavigate }: DashboardHomeProps) {
  const doctor = useAuthStore((s) => s.doctor)
  const { isPremium, prescriptionsUsed, prescriptionsLimit, prescriptionsRemaining } = useSubscription()

  // Mock stats for display - in production these would come from API
  const stats = {
    totalPatients: 0,
    prescriptionsThisMonth: prescriptionsUsed,
    prescriptionsRemaining: isPremium ? '∞' : prescriptionsRemaining,
  }

  const recentPrescriptions = [
    // Mock data - empty in production until prescriptions are created
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome, {doctor?.name || 'Doctor'} 👋
          </h2>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your practice today.
          </p>
        </div>
        {isPremium && (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 self-start sm:self-auto">
            ✨ Premium Plan
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered patients
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prescriptions This Month</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prescriptionsThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">
              of {isPremium ? '∞' : prescriptionsLimit} allowed
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Prescriptions Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.prescriptionsRemaining}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {isPremium ? 'Unlimited' : 'Free plan limit'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => onNavigate('composer')} className="gap-2">
          <FilePlus2 className="h-4 w-4" />
          New Prescription
        </Button>
        <Button variant="outline" onClick={() => onNavigate('patients')} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Patient
        </Button>
      </div>

      {/* Recent Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentPrescriptions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No prescriptions yet.</p>
              <p className="text-xs mt-1">Create your first prescription to get started.</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => onNavigate('composer')}
              >
                <FilePlus2 className="h-4 w-4 mr-1" />
                New Prescription
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* List would render here from API data */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
