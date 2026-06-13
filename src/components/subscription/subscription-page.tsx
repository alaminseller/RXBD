'use client'

import { useAuthStore } from '@/store/auth-store'
import { useSubscription } from '@/hooks/use-subscription'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle2,
  X,
  Crown,
  Zap,
  CreditCard,
  Shield,
  FileText,
  BarChart3,
} from 'lucide-react'

export function SubscriptionPage() {
  const { isPremium, prescriptionsUsed, prescriptionsLimit, prescriptionsRemaining } = useSubscription()
  const subscription = useAuthStore((s) => s.subscription)

  const usagePercentage = isPremium ? 0 : (prescriptionsUsed / prescriptionsLimit) * 100

  const features = [
    { name: 'Monthly Prescriptions', free: '50', premium: 'Unlimited' },
    { name: 'Medicine Database', free: 'Full Access', premium: 'Full Access' },
    { name: 'Patient Management', free: 'Basic', premium: 'Advanced' },
    { name: 'Custom Letterhead', free: false, premium: true },
    { name: 'QR Code on Rx', free: true, premium: true },
    { name: 'PDF Export', free: true, premium: true },
    { name: 'Bengali Language', free: true, premium: true },
    { name: 'Priority Support', free: false, premium: true },
    { name: 'API Access', free: false, premium: true },
    { name: 'Analytics Dashboard', free: false, premium: true },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold">Subscription</h2>

      {/* Current Plan */}
      <Card className={isPremium ? 'border-yellow-300 bg-yellow-50/50' : 'border-primary/30 bg-primary/5'}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isPremium ? (
                  <>
                    <Crown className="h-5 w-5 text-yellow-600" />
                    Premium Plan
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 text-primary" />
                    Free Plan
                  </>
                )}
              </CardTitle>
              <CardDescription className="mt-1">
                {isPremium
                  ? 'You have access to all premium features.'
                  : 'Upgrade to unlock unlimited prescriptions and advanced features.'}
              </CardDescription>
            </div>
            {isPremium && (
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Active</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Usage Stats */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Prescriptions Used</span>
              <span className="font-medium">
                {prescriptionsUsed} / {isPremium ? '∞' : prescriptionsLimit}
              </span>
            </div>
            {!isPremium && (
              <Progress value={usagePercentage} className="h-2" />
            )}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Prescriptions Remaining</span>
              <span className="font-medium text-primary">
                {isPremium ? 'Unlimited' : prescriptionsRemaining}
              </span>
            </div>
          </div>

          {!isPremium && (
            <>
              <Separator className="my-4" />
              <Button className="w-full gap-2" size="lg">
                <CreditCard className="h-4 w-4" />
                Upgrade to Premium
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-2">
                Secure payment via SSLCommerz &bull; ৳499/month
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Feature Comparison</CardTitle>
          <CardDescription>See what&apos;s included in each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {/* Header Row */}
            <div className="grid grid-cols-3 gap-4 py-3 border-b font-medium text-sm">
              <div>Feature</div>
              <div className="text-center">Free</div>
              <div className="text-center">Premium</div>
            </div>

            {features.map((feature) => (
              <div key={feature.name} className="grid grid-cols-3 gap-4 py-3 border-b border-border/50 last:border-0">
                <div className="text-sm text-muted-foreground">{feature.name}</div>
                <div className="text-center">
                  {typeof feature.free === 'boolean' ? (
                    feature.free ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-sm">{feature.free}</span>
                  )}
                </div>
                <div className="text-center">
                  {typeof feature.premium === 'boolean' ? (
                    feature.premium ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-400 mx-auto" />
                    )
                  ) : (
                    <span className="text-sm font-medium text-primary">{feature.premium}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="text-center p-4">
          <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold text-sm">Secure Payments</h3>
          <p className="text-xs text-muted-foreground mt-1">SSLCommerz verified gateway</p>
        </Card>
        <Card className="text-center p-4">
          <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold text-sm">Unlimited Rx</h3>
          <p className="text-xs text-muted-foreground mt-1">No monthly prescription limits</p>
        </Card>
        <Card className="text-center p-4">
          <BarChart3 className="h-8 w-8 mx-auto mb-2 text-primary" />
          <h3 className="font-semibold text-sm">Analytics</h3>
          <p className="text-xs text-muted-foreground mt-1">Track your practice growth</p>
        </Card>
      </div>

      {/* Payment History */}
      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground text-sm">
              {isPremium ? (
                <p>Payment history will appear here.</p>
              ) : (
                <p>No payment history yet. Upgrade to see transactions.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
