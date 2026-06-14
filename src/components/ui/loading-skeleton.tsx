import { Skeleton } from '@/components/ui/skeleton'

/**
 * CardSkeleton - Loading skeleton for stat cards
 * Matches the layout of dashboard stat cards
 */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

/**
 * TableRowSkeleton - Loading skeleton for table rows
 * Matches the layout of patient/prescription table rows
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr className="border-b transition-colors">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-4">
          <Skeleton className="h-4 w-full max-w-[120px]" />
        </td>
      ))}
    </tr>
  )
}

/**
 * TableSkeleton - Full table skeleton with header and rows
 */
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      <div className="border-b">
        <div className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full max-w-[100px]" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  )
}

/**
 * ComposerSkeleton - Loading skeleton for the prescription composer
 * Matches the 3-panel clinical layout
 */
export function ComposerSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 lg:p-6">
      {/* Left panel - Patient selector */}
      <div className="lg:col-span-3 space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-20 w-full rounded-lg" />
        </div>
      </div>

      {/* Center panel - Clinical sections */}
      <div className="lg:col-span-6 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>

      {/* Right panel - Medication list */}
      <div className="lg:col-span-3 space-y-3">
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}

/**
 * DashboardSkeleton - Loading skeleton for the dashboard
 */
export function DashboardSkeleton() {
  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome section */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Recent prescriptions card */}
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="text-center py-8 space-y-3">
            <Skeleton className="h-12 w-12 rounded mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
