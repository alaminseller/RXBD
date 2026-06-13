'use client'

import { useState, useCallback } from 'react'
import { usePrescriptionStore } from '@/store/prescription-store'
import { useSubscription } from '@/hooks/use-subscription'
import { useAutoSave } from '@/hooks/use-auto-save'
import { MedicineSearch } from './medicine-search'
import { MedicationRow } from './medication-row'
import { PatientSelector } from './patient-selector'
import { VitalsInput } from './vitals-input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  FilePlus2,
  Save,
  FileDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  ClipboardList,
  MessageSquare,
  CalendarClock,
  Plus,
} from 'lucide-react'
import type { Medicine } from '@/types'
import { authHeaders } from '@/store/auth-store'
import { useToast } from '@/hooks/use-toast'

export function PrescriptionComposer() {
  const {
    medications,
    diagnosis,
    clinicalNotes,
    advice,
    followUpDate,
    isDirty,
    lastSavedAt,
    setDiagnosis,
    setClinicalNotes,
    setAdvice,
    setFollowUpDate,
    addMedication,
    resetComposer,
    markSaved,
  } = usePrescriptionStore()

  const { canCreatePrescription, prescriptionsRemaining, isPremium } = useSubscription()
  const { hasDraft, resumeDraft, discardDraft } = useAutoSave()
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [showDraftDialog, setShowDraftDialog] = useState(hasDraft && !isDirty)

  const handleAddMedicine = useCallback((medicine: Medicine) => {
    addMedication({
      id: crypto.randomUUID(),
      brand: medicine.brand,
      generic: medicine.generic,
      strength: medicine.strength,
      dosageForm: medicine.dosageForm,
      frequency: '',
      duration: '',
      instructions: '',
    })
  }, [addMedication])

  const handleSaveDraft = async () => {
    // The persist middleware already saves to localStorage
    markSaved()
    toast({
      title: 'Draft saved',
      description: 'Your prescription draft has been saved.',
    })
  }

  const handleSaveAndCreate = async () => {
    if (!canCreatePrescription) {
      toast({
        title: 'Prescription limit reached',
        description: 'You have used all your free prescriptions. Upgrade to Premium for unlimited prescriptions.',
        variant: 'destructive',
      })
      return
    }

    const { patientId } = usePrescriptionStore.getState()
    if (!patientId) {
      toast({
        title: 'Patient required',
        description: 'Please select a patient before creating a prescription.',
        variant: 'destructive',
      })
      return
    }

    setIsSaving(true)
    try {
      const state = usePrescriptionStore.getState()
      const response = await fetch('/api/prescriptions', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          patientId: state.patientId,
          bloodPressure: state.bloodPressure,
          pulse: state.pulse,
          temperature: state.temperature,
          weight: state.weight,
          spO2: state.spO2,
          diagnosis: state.diagnosis,
          clinicalNotes: state.clinicalNotes,
          advice: state.advice,
          followUpDate: state.followUpDate,
          medications: state.medications,
          status: 'completed',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error((errorData as { error?: string }).error || 'Failed to create prescription.')
      }

      toast({
        title: 'Prescription created!',
        description: 'Your prescription has been saved successfully.',
      })

      resetComposer()
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create prescription.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const formatLastSaved = () => {
    if (!lastSavedAt) return null
    const seconds = Math.floor((Date.now() - lastSavedAt) / 1000)
    if (seconds < 60) return `Saved ${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `Saved ${minutes}m ago`
    return `Saved ${Math.floor(minutes / 60)}h ago`
  }

  return (
    <div className="h-full flex flex-col">
      {/* Draft Recovery Dialog */}
      {showDraftDialog && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-800">You have an unsaved draft.</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-yellow-300"
              onClick={() => {
                discardDraft()
                setShowDraftDialog(false)
              }}
            >
              Discard
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700"
              onClick={() => {
                resumeDraft()
                setShowDraftDialog(false)
              }}
            >
              Resume Draft
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Left Panel - Patient & Vitals */}
            <div className="lg:col-span-3 space-y-4">
              <PatientSelector />
              <VitalsInput />
            </div>

            {/* Center Panel - Medications */}
            <div className="lg:col-span-5 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-primary" />
                    Medications
                    {medications.length > 0 && (
                      <Badge variant="secondary" className="ml-auto text-[10px]">
                        {medications.length} {medications.length === 1 ? 'item' : 'items'}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <MedicineSearch onSelect={handleAddMedicine} />

                  {medications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FilePlus2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No medications added yet.</p>
                      <p className="text-xs mt-1">Search for a medicine above to add it.</p>
                    </div>
                  ) : (
                    <ScrollArea className="max-h-96">
                      <div className="space-y-2 pr-1">
                        {medications.map((med, idx) => (
                          <MedicationRow key={med.id} medication={med} index={idx} />
                        ))}
                      </div>
                    </ScrollArea>
                  )}

                  {medications.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1"
                      onClick={() => {
                        // Focus the search input
                        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search medicine"]')
                        searchInput?.focus()
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Another Medicine
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Clinical Notes */}
            <div className="lg:col-span-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-primary" />
                    Clinical Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Diagnosis</Label>
                    <Textarea
                      placeholder="Enter diagnosis..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      className="min-h-[80px] text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Clinical Notes</Label>
                    <Textarea
                      placeholder="Additional clinical observations..."
                      value={clinicalNotes}
                      onChange={(e) => setClinicalNotes(e.target.value)}
                      className="min-h-[80px] text-sm resize-none"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Advice
                    </Label>
                    <Textarea
                      placeholder="Advice for the patient..."
                      value={advice}
                      onChange={(e) => setAdvice(e.target.value)}
                      className="min-h-[80px] text-sm resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" /> Follow-up Date
                    </Label>
                    <Input
                      type="date"
                      value={followUpDate}
                      onChange={(e) => setFollowUpDate(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-card px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              {isDirty ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                  <span>Unsaved changes</span>
                </>
              ) : lastSavedAt ? (
                <>
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>{formatLastSaved()}</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  <span>No changes</span>
                </>
              )}
            </div>

            {/* Prescription Count */}
            {!isPremium && (
              <Badge variant="outline" className="text-[10px]">
                {prescriptionsRemaining} remaining
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={!isDirty}
              className="gap-1"
            >
              <Save className="h-3.5 w-3.5" />
              Save Draft
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAndCreate}
              disabled={isSaving || !canCreatePrescription}
              className="gap-1"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FileDown className="h-3.5 w-3.5" />
                  Save & Create
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
