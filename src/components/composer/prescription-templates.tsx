'use client'

import { useState, useCallback } from 'react'
import { usePrescriptionStore } from '@/store/prescription-store'
import { useSubscription } from '@/hooks/use-subscription'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  BookTemplate,
  Plus,
  Trash2,
  Lock,
  ChevronDown,
  FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Medication } from '@/types'

/** localStorage key for prescription templates */
const TEMPLATES_KEY = 'rxbd-templates'

/** Template structure */
export interface PrescriptionTemplate {
  id: string
  name: string
  diagnosis: string
  diagnosisCode: string
  chiefComplaints: string
  onExamination: string
  investigations: string
  medications: Medication[]
  advice: string
  createdAt: number
}

/** Load templates from localStorage */
function loadTemplates(): PrescriptionTemplate[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/** Save templates to localStorage */
function saveTemplates(templates: PrescriptionTemplate[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates))
}

interface PrescriptionTemplatesProps {
  /** Optional className */
  className?: string
}

/**
 * Prescription Templates (Macros) component.
 *
 * Features:
 * - Free users see a locked "Premium Feature" indicator
 * - Premium users can create, load, and delete templates
 * - Templates are stored in localStorage under key `rxbd-templates`
 * - When a template is loaded, it fills the composer store fields via `loadTemplate()`
 */
export function PrescriptionTemplates({ className }: PrescriptionTemplatesProps) {
  const { isPremium } = useSubscription()
  const { loadTemplate } = usePrescriptionStore()

  const [templates, setTemplates] = useState<PrescriptionTemplate[]>(() => loadTemplates())
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    diagnosis: '',
    diagnosisCode: '',
    chiefComplaints: '',
    onExamination: '',
    investigations: '',
    advice: '',
  })

  const handleCreateTemplate = useCallback(() => {
    if (!newTemplate.name.trim()) return

    const template: PrescriptionTemplate = {
      id: crypto.randomUUID(),
      name: newTemplate.name.trim(),
      diagnosis: newTemplate.diagnosis,
      diagnosisCode: newTemplate.diagnosisCode,
      chiefComplaints: newTemplate.chiefComplaints,
      onExamination: newTemplate.onExamination,
      investigations: newTemplate.investigations,
      medications: [],
      advice: newTemplate.advice,
      createdAt: Date.now(),
    }

    const updated = [...templates, template]
    setTemplates(updated)
    saveTemplates(updated)

    setNewTemplate({
      name: '',
      diagnosis: '',
      diagnosisCode: '',
      chiefComplaints: '',
      onExamination: '',
      investigations: '',
      advice: '',
    })
    setShowCreateDialog(false)
  }, [newTemplate, templates])

  const handleLoadTemplate = useCallback(
    (template: PrescriptionTemplate) => {
      loadTemplate({
        diagnosis: template.diagnosis,
        diagnosisCode: template.diagnosisCode,
        chiefComplaints: template.chiefComplaints,
        onExamination: template.onExamination,
        investigations: template.investigations,
        advice: template.advice,
        medications: template.medications,
      })
    },
    [loadTemplate]
  )

  const handleDeleteTemplate = useCallback(
    (templateId: string) => {
      const updated = templates.filter((t) => t.id !== templateId)
      setTemplates(updated)
      saveTemplates(updated)
    },
    [templates]
  )

  // Free user: show locked indicator
  if (!isPremium) {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed',
          'border-muted-foreground/30 bg-muted/30 text-muted-foreground',
          className
        )}
      >
        <Lock className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">Templates — Premium Feature</span>
      </div>
    )
  }

  // Premium user: full templates interface
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-8"
            disabled={templates.length === 0}
          >
            <BookTemplate className="h-3.5 w-3.5" />
            Templates
            <Badge variant="secondary" className="text-[9px] h-4 px-1 ml-1">
              {templates.length}
            </Badge>
            <ChevronDown className="h-3 w-3 ml-0.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-72">
          {templates.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-muted-foreground">
              No templates saved yet
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id}>
                <DropdownMenuItem
                  className="flex items-start gap-2 py-2 cursor-pointer"
                  onClick={() => handleLoadTemplate(template)}
                >
                  <FileText className="h-4 w-4 mt-0.5 text-[#14919b] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {template.name}
                    </div>
                    {template.diagnosis && (
                      <div className="text-xs text-muted-foreground truncate">
                        {template.diagnosisCode && (
                          <span className="font-mono text-[#14919b] mr-1">
                            {template.diagnosisCode}
                          </span>
                        )}
                        {template.diagnosis}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteTemplate(template.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 text-xs h-8">
            <Plus className="h-3.5 w-3.5" />
            New Template
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookTemplate className="h-5 w-5 text-[#14919b]" />
              Create Prescription Template
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs">Template Name *</Label>
              <Input
                placeholder="e.g., Diabetes Follow-up"
                value={newTemplate.name}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, name: e.target.value })
                }
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Chief Complaints</Label>
              <Textarea
                placeholder="e.g., Increased thirst, frequent urination..."
                value={newTemplate.chiefComplaints}
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    chiefComplaints: e.target.value,
                  })
                }
                className="min-h-[60px] text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">ICD-10 Code</Label>
                <Input
                  placeholder="E11.9"
                  value={newTemplate.diagnosisCode}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      diagnosisCode: e.target.value,
                    })
                  }
                  className="h-8 text-xs font-mono"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label className="text-xs">Diagnosis</Label>
                <Input
                  placeholder="Type 2 Diabetes Mellitus"
                  value={newTemplate.diagnosis}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      diagnosis: e.target.value,
                    })
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">On Examination</Label>
              <Textarea
                placeholder="Clinical findings..."
                value={newTemplate.onExamination}
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    onExamination: e.target.value,
                  })
                }
                className="min-h-[50px] text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Investigations</Label>
              <Textarea
                placeholder="CBC, FBS, HbA1c..."
                value={newTemplate.investigations}
                onChange={(e) =>
                  setNewTemplate({
                    ...newTemplate,
                    investigations: e.target.value,
                  })
                }
                className="min-h-[50px] text-sm resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Advice</Label>
              <Textarea
                placeholder="Dietary advice, lifestyle modifications..."
                value={newTemplate.advice}
                onChange={(e) =>
                  setNewTemplate({ ...newTemplate, advice: e.target.value })
                }
                className="min-h-[60px] text-sm resize-none"
              />
            </div>

            <Button
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name.trim()}
              className="w-full gap-1.5"
              style={{ backgroundColor: '#0d6b6e' }}
            >
              <Plus className="h-4 w-4" />
              Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
