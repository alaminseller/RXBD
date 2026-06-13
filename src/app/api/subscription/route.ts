import { db } from '@/lib/db'
import { getAuthDoctor } from '@/lib/auth-helpers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod/v4'

const upgradeSchema = z.object({
  plan: z.enum(['free', 'pro', 'premium']),
  paymentMethod: z.string().optional(),
})

const PLAN_LIMITS: Record<string, number> = {
  free: 50,
  pro: 500,
  premium: -1, // unlimited
}

export async function GET(request: NextRequest) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const subscription = doctor.subscription || await db.subscription.findUnique({
      where: { doctorId: doctor.id },
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'No subscription found' },
        { status: 404 }
      )
    }

    const plan = subscription.plan
    const limit = PLAN_LIMITS[plan] ?? 50

    return NextResponse.json({
      success: true,
      data: {
        ...subscription,
        isPremium: plan !== 'free',
        isFree: plan === 'free',
        prescriptionsRemaining: limit === -1 ? -1 : Math.max(0, limit - subscription.prescriptionsUsed),
        canCreatePrescription: limit === -1 || subscription.prescriptionsUsed < limit,
        planLimits: PLAN_LIMITS,
      },
    })
  } catch (error) {
    console.error('Subscription GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const doctor = await getAuthDoctor(request)
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validated = upgradeSchema.parse(body)

    // In production, this would call SSLCommerz payment gateway
    // For now, simulate the upgrade

    const newLimit = PLAN_LIMITS[validated.plan] ?? 50
    const now = new Date()
    const endDate = new Date(now)
    endDate.setFullYear(endDate.getFullYear() + 1)

    const subscription = await db.subscription.upsert({
      where: { doctorId: doctor.id },
      create: {
        doctorId: doctor.id,
        plan: validated.plan,
        prescriptionsUsed: 0,
        prescriptionsLimit: newLimit,
        startDate: now,
        endDate,
        paymentMethod: validated.paymentMethod ?? 'simulated',
        transactionId: `SIM-${Date.now()}`,
        status: 'active',
      },
      update: {
        plan: validated.plan,
        prescriptionsLimit: newLimit,
        startDate: now,
        endDate,
        paymentMethod: validated.paymentMethod ?? 'simulated',
        transactionId: `SIM-${Date.now()}`,
        status: 'active',
      },
    })

    // Log audit
    await db.auditLog.create({
      data: {
        doctorId: doctor.id,
        action: 'UPGRADE_SUBSCRIPTION',
        entity: 'Subscription',
        entityId: subscription.id,
        details: `Upgraded to ${validated.plan} plan`,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        ...subscription,
        isPremium: validated.plan !== 'free',
        isFree: validated.plan === 'free',
        prescriptionsRemaining: newLimit === -1 ? -1 : Math.max(0, newLimit - subscription.prescriptionsUsed),
        canCreatePrescription: newLimit === -1 || subscription.prescriptionsUsed < newLimit,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues.map((e) => e.message).join(', ') },
        { status: 400 }
      )
    }
    console.error('Subscription POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
