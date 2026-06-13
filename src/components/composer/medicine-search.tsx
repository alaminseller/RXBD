'use client'

import { useState } from 'react'
import { useMedicineSearch } from '@/hooks/use-medicine-search'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Search, Pill } from 'lucide-react'
import type { Medicine } from '@/types'
import { cn } from '@/lib/utils'

interface MedicineSearchProps {
  onSelect: (medicine: Medicine) => void
}

export function MedicineSearch({ onSelect }: MedicineSearchProps) {
  const { query, setQuery, results, isLoading, clearSearch } = useMedicineSearch()
  const [isFocused, setIsFocused] = useState(false)

  const handleSelect = (medicine: Medicine) => {
    onSelect(medicine)
    clearSearch()
    setIsFocused(false)
  }

  const showDropdown = isFocused && (results.length > 0 || isLoading)

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search medicine by brand or generic name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-9"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <ScrollArea className="max-h-64">
            {results.map((medicine) => (
              <button
                key={medicine.id}
                onClick={() => handleSelect(medicine)}
                className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-0"
              >
                <Pill className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{medicine.brand}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {medicine.strength}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {medicine.generic} &bull; {medicine.dosageForm}
                  </div>
                  <div className="text-xs text-muted-foreground/60 mt-0.5">
                    {medicine.manufacturer} &bull; {medicine.category}
                  </div>
                </div>
              </button>
            ))}
            {!isLoading && results.length === 0 && query.length >= 2 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No medicines found for &quot;{query}&quot;
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {isFocused && !showDropdown && query.length < 2 && (
        <div className={cn(
          "absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground"
        )}>
          Type at least 2 characters to search
        </div>
      )}
    </div>
  )
}
