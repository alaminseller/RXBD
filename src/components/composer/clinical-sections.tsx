'use client'

import { useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import type { LucideIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClinicalSectionProps {
  /** Section title displayed in the header */
  title: string
  /** Lucide icon component for the section */
  icon: LucideIcon
  /** Section content */
  children: React.ReactNode
  /** Whether the section is open by default */
  defaultOpen?: boolean
  /** Optional badge text to display in the header */
  badge?: string
  /** Optional className for the outer wrapper */
  className?: string
}

/**
 * A reusable collapsible clinical section component for the RxBD Prescription Composer.
 *
 * Features:
 * - Collapsible sections using shadcn/ui Collapsible
 * - Teal accent color matching the RxBD theme (#0d6b6e, #14919b)
 * - Icon and title in the header with collapse/expand toggle
 * - Optional badge for showing counts
 */
export function ClinicalSection({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  badge,
  className,
}: ClinicalSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        'rounded-lg border bg-card shadow-sm overflow-hidden',
        className
      )}
    >
      <CollapsibleTrigger asChild>
        <button
          className={cn(
            'w-full flex items-center gap-2.5 px-4 py-3 text-left',
            'hover:bg-muted/50 transition-colors',
            'border-b border-border/50',
            isOpen && 'bg-muted/30'
          )}
        >
          <div
            className={cn(
              'flex items-center justify-center h-6 w-6 rounded-md',
              'bg-[#0d6b6e]/10 text-[#14919b]'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold text-foreground flex-1">
            {title}
          </span>
          {badge && (
            <span
              className={cn(
                'text-[10px] font-medium px-1.5 py-0.5 rounded-full',
                'bg-[#0d6b6e]/10 text-[#14919b]'
              )}
            >
              {badge}
            </span>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="p-4 space-y-3">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
