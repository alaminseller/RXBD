'use client'

import { useAuthStore } from '@/store/auth-store'

/** Free plan monthly prescription limit */
const FREE_PLAN_LIMIT = 30

/**
 * Custom hook for accessing subscription information and permissions.
 *
 * Reads from the auth store's subscription data and derives
 * useful computed values for UI gating (e.g., can the user
 * create another prescription?).
 *
 * @returns Subscription info and permission flags
 */
export function useSubscription() {
  const subscription = useAuthStore((state) => state.subscription)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const isPremium = subscription?.plan === 'premium' && subscription?.status === 'active'
  const isFree = !isPremium

  const prescriptionsUsed = subscription?.prescriptionsUsed ?? 0
  const prescriptionsLimit = subscription?.prescriptionsLimit ?? FREE_PLAN_LIMIT

  const prescriptionsRemaining = isPremium
    ? Infinity
    : Math.max(0, prescriptionsLimit - prescriptionsUsed)

  const canCreatePrescription = isPremium || prescriptionsRemaining > 0

  const upgradeUrl = '/pricing'

  return {
    /** The raw subscription object from the auth store */
    subscription,
    /** Whether the user is on the premium plan */
    isPremium,
    /** Whether the user is on the free plan */
    isFree,
    /** Number of prescriptions used in the current billing period */
    prescriptionsUsed,
    /** Maximum prescriptions allowed (Infinity for premium) */
    prescriptionsLimit,
    /** Remaining prescriptions the user can create */
    prescriptionsRemaining,
    /** Whether the user can create a new prescription */
    canCreatePrescription,
    /** Whether the user is authenticated */
    isAuthenticated,
    /** URL to the upgrade/pricing page */
    upgradeUrl,
  }
}
