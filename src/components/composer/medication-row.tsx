'use client'

import { usePrescriptionStore } from '@/store/prescription-store'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Trash2, GripVertical, Pill } from 'lucide-react'
import type { Medication } from '@/types'

interface MedicationRowProps {
  medication: Medication
  index: number
}

const FREQUENCY_OPTIONS = [
  { value: '1+0+0', label: '1+0+0 (Morning only)' },
  { value: '0+1+0', label: '0+1+0 (Afternoon only)' },
  { value: '0+0+1', label: '0+0+1 (Night only)' },
  { value: '1+0+1', label: '1+0+1 (Morning + Night)' },
  { value: '1+1+0', label: '1+1+0 (Morning + Afternoon)' },
  { value: '0+1+1', label: '0+1+1 (Afternoon + Night)' },
  { value: '1+1+1', label: '1+1+1 (Three times daily)' },
  { value: '1+1+1+1', label: '1+1+1+1 (Four times daily)' },
  { value: 'SOS', label: 'SOS (As needed)' },
  { value: 'STAT', label: 'STAT (Immediately)' },
  { value: 'HS', label: 'HS (At bedtime)' },
]

const INSTRUCTION_OPTIONS = [
  'After meal',
  'Before meal',
  'With meal',
  'Empty stomach',
  'At bedtime',
  'With plenty of water',
  'As needed',
]

export function MedicationRow({ medication, index }: MedicationRowProps) {
  const { updateMedication, removeMedication, reorderMedications } = usePrescriptionStore()
  const medications = usePrescriptionStore((s) => s.medications)

  const handleMoveUp = () => {
    if (index > 0) {
      reorderMedications(index, index - 1)
    }
  }

  const handleMoveDown = () => {
    if (index < medications.length - 1) {
      reorderMedications(index, index + 1)
    }
  }

  return (
    <div className="border rounded-lg p-3 bg-card hover:shadow-sm transition-shadow">
      {/* Header Row */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={handleMoveUp}
            disabled={index === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-xs"
            aria-label="Move up"
          >
            ▲
          </button>
          <button
            onClick={handleMoveDown}
            disabled={index === medications.length - 1}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-xs"
            aria-label="Move down"
          >
            ▼
          </button>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground/40" />
        <Pill className="h-4 w-4 text-primary flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm">{medication.brand}</span>
          <span className="text-xs text-muted-foreground ml-2">({medication.generic})</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => removeMedication(index)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Details Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 ml-8">
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Strength</label>
          <Input
            value={medication.strength}
            onChange={(e) => updateMedication(index, { strength: e.target.value })}
            className="h-7 text-xs"
            placeholder="500mg"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Form</label>
          <Input
            value={medication.dosageForm}
            onChange={(e) => updateMedication(index, { dosageForm: e.target.value })}
            className="h-7 text-xs"
            placeholder="Tablet"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Frequency</label>
          <Select
            value={medication.frequency}
            onValueChange={(v) => updateMedication(index, { frequency: v })}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Duration</label>
          <Input
            value={medication.duration}
            onChange={(e) => updateMedication(index, { duration: e.target.value })}
            className="h-7 text-xs"
            placeholder="7 days"
          />
        </div>
      </div>

      {/* Instructions Row */}
      <div className="mt-2 ml-8">
        <div className="space-y-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wide">Instructions</label>
          <div className="flex gap-2 flex-wrap">
            {INSTRUCTION_OPTIONS.map((instruction) => (
              <button
                key={instruction}
                onClick={() => updateMedication(index, { instructions: instruction })}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                  medication.instructions === instruction
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {instruction}
              </button>
            ))}
            <Input
              value={medication.instructions}
              onChange={(e) => updateMedication(index, { instructions: e.target.value })}
              className="h-6 text-[10px] w-32 inline-flex"
              placeholder="Custom..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
