'use client'

import { Button } from '@/components/ui/button'
import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  /** Icon component to display */
  icon: LucideIcon
  /** Main title */
  title: string
  /** Description text */
  description: string
  /** Optional action button label */
  actionLabel?: string
  /** Optional action button click handler */
  onAction?: () => void
}

/**
 * Reusable empty state component with icon, title, description, and optional action button.
 * Clean centered layout with teal color scheme.
 * Used in patient list, prescription list, and other data views.
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="h-14 w-14 rounded-full bg-[#0d6b6e]/10 flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-[#0d6b6e] opacity-60" />
      </div>
      <h3 className="text-sm font-medium text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 gap-1 text-[#0d6b6e] border-[#0d6b6e]/30 hover:bg-[#0d6b6e]/5"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
