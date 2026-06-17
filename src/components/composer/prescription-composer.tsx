'use client'

import { useState, useCallback } from 'react'
import { usePrescriptionStore } from '@/store/prescription-store'
import { useSubscription } from '@/hooks/use-subscription'
import { useAutoSave } from '@/hooks/use-auto-save'
import { useComposerBreakpoint } from '@/hooks/use-media-query'
import { useTranslation } from '@/lib/i18n'
import { MedicineSearch } from './medicine-search'
import { MedicationRow } from './medication-row'
import { PatientSelector } from './patient-selector'
import { VitalsInput } from './vitals-input'
import { ClinicalSection } from './clinical-sections'
import { DiagnosisPicker } from './diagnosis-picker'
import { PrescriptionTemplates } from './prescription-templates'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
  Eye,
  FlaskConical,
  BookTemplate,
  User,
  Search,
  FileText,
} from 'lucide-react'
import type { Medicine } from '@/types'
import { authHeaders } from '@/store/auth-store'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type MobileTab = 'patient' | 'rxpad' | 'search'

export function PrescriptionComposer() {
  const {
    medications,
    chiefComplaints,
    onExamination,
    investigations,
    diagnosis,
    diagnosisCode,
    clinicalNotes,
    advice,
    followUpDate,
    isDirty,
    lastSavedAt,
    setChiefComplaints,
    setOnExamination,
    setInvestigations,
    setDiagnosis,
    setDiagnosisCode,
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
  const breakpoint = useComposerBreakpoint()
  const { t } = useTranslation()

  const [isSaving, setIsSaving] = useState(false)
  const [showDraftDialog, setShowDraftDialog] = useState(hasDraft && !isDirty)
  const [activeTab, setActiveTab] = useState<MobileTab>('patient')
  const [accordionValue, setAccordionValue] = useState<string>('cc')

  const isDesktop = breakpoint === 'desktop'
  const isPhone = breakpoint === 'phone'

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
    markSaved()
    toast({
      title: t('composer.draftSaved'),
      description: t('composer.draftSavedDesc'),
    })
  }

  const handleSaveAndCreate = async () => {
    if (!canCreatePrescription) {
      toast({
        title: t('composer.prescriptionLimitReached'),
        description: t('composer.prescriptionLimitDesc'),
        variant: 'destructive',
      })
      return
    }

    const { patientId } = usePrescriptionStore.getState()
    if (!patientId) {
      toast({
        title: t('composer.patientRequired'),
        description: t('composer.patientRequiredDesc'),
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
          chiefComplaints: state.chiefComplaints,
          bloodPressure: state.bloodPressure,
          pulse: state.pulse,
          temperature: state.temperature,
          weight: state.weight,
          spO2: state.spO2,
          onExamination: state.onExamination,
          investigations: state.investigations,
          diagnosis: state.diagnosis,
          diagnosisCode: state.diagnosisCode,
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
        title: t('composer.prescriptionCreated'),
        description: t('composer.prescriptionCreatedDesc'),
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
    if (seconds < 60) return `${t('composer.saved')} ${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${t('composer.saved')} ${minutes}m ago`
    return `${t('composer.saved')} ${Math.floor(minutes / 60)}h ago`
  }

  // ─── Clinical Sections Content (shared between desktop & mobile) ───

  const chiefComplaintsSection = (
    <Textarea
      placeholder={t('composer.chiefComplaints')}
      value={chiefComplaints}
      onChange={(e) => setChiefComplaints(e.target.value)}
      className="min-h-[80px] text-sm resize-none"
    />
  )

  const onExaminationSection = (
    <Textarea
      placeholder={t('composer.onExamination')}
      value={onExamination}
      onChange={(e) => setOnExamination(e.target.value)}
      className="min-h-[80px] text-sm resize-none"
    />
  )

  const investigationsSection = (
    <Textarea
      placeholder={t('composer.investigations')}
      value={investigations}
      onChange={(e) => setInvestigations(e.target.value)}
      className="min-h-[80px] text-sm resize-none"
    />
  )

  const diagnosisSection = (
    <div className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('composer.icd10Code')}</Label>
        <DiagnosisPicker
          value={diagnosisCode}
          onCodeChange={setDiagnosisCode}
          onCodeSelect={(code, description) => {
            setDiagnosisCode(code)
            if (!diagnosis.trim()) {
              setDiagnosis(description)
            }
          }}
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t('composer.diagnosisDetails')}</Label>
        <Textarea
          placeholder={t('composer.diagnosisDetails')}
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="min-h-[60px] text-sm resize-none"
        />
      </div>
    </div>
  )

  const medicationsSection = (
    <div className="space-y-3">
      <MedicineSearch onSelect={handleAddMedicine} />

      {medications.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <FilePlus2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">{t('composer.noMedicationsYet')}</p>
          <p className="text-xs mt-1">{t('composer.searchMedicineAbove')}</p>
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
            const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search medicine"]')
            searchInput?.focus()
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          {t('composer.addAnotherMedicine')}
        </Button>
      )}
    </div>
  )

  // ─── Right Panel Sections ───

  const clinicalNotesSection = (
    <Textarea
      placeholder={t('composer.clinicalNotes')}
      value={clinicalNotes}
      onChange={(e) => setClinicalNotes(e.target.value)}
      className="min-h-[80px] text-sm resize-none"
    />
  )

  const adviceSection = (
    <Textarea
      placeholder={t('composer.advice')}
      value={advice}
      onChange={(e) => setAdvice(e.target.value)}
      className="min-h-[100px] text-sm resize-none"
    />
  )

  const followUpSection = (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{t('composer.followUp')}</Label>
      <Input
        type="date"
        value={followUpDate}
        onChange={(e) => setFollowUpDate(e.target.value)}
        className="text-sm"
      />
    </div>
  )

  // ─── Bottom Bar (shared) ───

  const bottomBar = (
    <div className="border-t bg-card px-4 lg:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isDirty ? (
              <>
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                <span>{t('composer.unsavedChanges')}</span>
              </>
            ) : lastSavedAt ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>{formatLastSaved()}</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                <span>{t('composer.noChanges')}</span>
              </>
            )}
          </div>
          {!isPremium && (
            <Badge variant="outline" className="text-[10px]">
              {prescriptionsRemaining} {t('composer.remaining')}
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
            <span className="hidden sm:inline">{t('composer.saveDraft')}</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSaveAndCreate}
            disabled={isSaving || !canCreatePrescription}
            className="gap-1"
            style={{ backgroundColor: '#0d6b6e' }}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span className="hidden sm:inline">{t('composer.saving')}</span>
              </>
            ) : (
              <>
                <FileDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t('composer.saveAndCreate')}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )

  // ─── Mobile Tab Bar ───

  const mobileTabBar = (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t shadow-lg safe-area-bottom">
      <div className="flex items-stretch">
        {([
          { id: 'patient' as MobileTab, label: 'Patient', icon: User },
          { id: 'rxpad' as MobileTab, label: 'Rx Pad', icon: FileText },
          { id: 'search' as MobileTab, label: 'Search', icon: Search },
        ] as const).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors',
              activeTab === tab.id
                ? 'text-[#0d6b6e] bg-[#0d6b6e]/5'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className={cn(
              'h-5 w-5',
              activeTab === tab.id && 'text-[#0d6b6e]'
            )} />
            <span className={cn(
              'text-[10px] font-medium',
              activeTab === tab.id && 'text-[#0d6b6e]'
            )}>
              {tab.label}
            </span>
            {tab.id === 'rxpad' && medications.length > 0 && (
              <span className="absolute top-1.5 ml-4 h-2 w-2 rounded-full bg-[#0d6b6e]" />
            )}
          </button>
        ))}
      </div>
    </div>
  )

  // ─── Render: Desktop 3-panel layout ───

  if (isDesktop) {
    return (
      <div className="h-full flex flex-col">
        {showDraftDialog && (
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-yellow-800">{t('composer.unsavedDraft')}</span>
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
                {t('composer.discard')}
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700"
                onClick={() => {
                  resumeDraft()
                  setShowDraftDialog(false)
                }}
              >
                {t('composer.resumeDraft')}
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              {/* Left Panel - Patient & Vitals */}
              <div className="lg:col-span-3 space-y-4">
                <PatientSelector />
                <VitalsInput />
              </div>

              {/* Center Panel - Clinical Workflow */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <PrescriptionTemplates />
                </div>

                <ClinicalSection title={t('composer.chiefComplaints')} icon={AlertCircle} defaultOpen={true}>
                  {chiefComplaintsSection}
                </ClinicalSection>

                <ClinicalSection title={t('composer.onExamination')} icon={Eye} defaultOpen={true}>
                  {onExaminationSection}
                </ClinicalSection>

                <ClinicalSection title={t('composer.investigations')} icon={FlaskConical} defaultOpen={true}>
                  {investigationsSection}
                </ClinicalSection>

                <ClinicalSection title={t('composer.diagnosis')} icon={Stethoscope} defaultOpen={true}>
                  {diagnosisSection}
                </ClinicalSection>

                <ClinicalSection
                  title={t('composer.medications')}
                  icon={BookTemplate}
                  defaultOpen={true}
                  badge={medications.length > 0 ? `${medications.length} ${medications.length === 1 ? t('composer.item') : t('composer.items')}` : undefined}
                >
                  {medicationsSection}
                </ClinicalSection>
              </div>

              {/* Right Panel - Advice & Follow-up */}
              <div className="lg:col-span-4 space-y-3">
                <ClinicalSection title={t('composer.clinicalNotes')} icon={ClipboardList} defaultOpen={true}>
                  {clinicalNotesSection}
                </ClinicalSection>

                <ClinicalSection title={t('composer.advice')} icon={MessageSquare} defaultOpen={true}>
                  {adviceSection}
                </ClinicalSection>

                <ClinicalSection title={t('composer.followUp')} icon={CalendarClock} defaultOpen={true}>
                  {followUpSection}
                </ClinicalSection>
              </div>
            </div>
          </div>
        </div>

        {bottomBar}
      </div>
    )
  }

  // ─── Render: Mobile/Tablet Tabbed layout ───

  return (
    <div className="h-full flex flex-col">
      {showDraftDialog && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-800">{t('composer.unsavedDraft')}</span>
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
              {t('composer.discard')}
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs bg-yellow-600 hover:bg-yellow-700"
              onClick={() => {
                resumeDraft()
                setShowDraftDialog(false)
              }}
            >
              {t('composer.resumeDraft')}
            </Button>
          </div>
        </div>
      )}

      {/* Tab Content - takes remaining space above bottom bar + tab bar */}
      <div className="flex-1 overflow-auto pb-[120px]">
        {/* ─── Patient Tab ─── */}
        {activeTab === 'patient' && (
          <div className="p-4 space-y-4">
            <PatientSelector />
            <VitalsInput />
          </div>
        )}

        {/* ─── Rx Pad Tab ─── */}
        {activeTab === 'rxpad' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <PrescriptionTemplates />
            </div>

            {isPhone ? (
              /* Phone: Accordion - only one section open at a time */
              <Accordion
                type="single"
                value={accordionValue}
                onValueChange={setAccordionValue}
                className="space-y-2"
              >
                <AccordionItem value="cc" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className={cn(
                    'px-4 py-3 hover:no-underline hover:bg-muted/50',
                    accordionValue === 'cc' && 'bg-muted/30'
                  )}>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-[#0d6b6e]/10 text-[#14919b]">
                        <AlertCircle className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-semibold">{t('composer.chiefComplaints')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {chiefComplaintsSection}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="exam" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className={cn(
                    'px-4 py-3 hover:no-underline hover:bg-muted/50',
                    accordionValue === 'exam' && 'bg-muted/30'
                  )}>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-[#0d6b6e]/10 text-[#14919b]">
                        <Eye className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-semibold">{t('composer.onExamination')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {onExaminationSection}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="investigations" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className={cn(
                    'px-4 py-3 hover:no-underline hover:bg-muted/50',
                    accordionValue === 'investigations' && 'bg-muted/30'
                  )}>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-[#0d6b6e]/10 text-[#14919b]">
                        <FlaskConical className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-semibold">{t('composer.investigations')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {investigationsSection}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="diagnosis" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className={cn(
                    'px-4 py-3 hover:no-underline hover:bg-muted/50',
                    accordionValue === 'diagnosis' && 'bg-muted/30'
                  )}>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-[#0d6b6e]/10 text-[#14919b]">
                        <Stethoscope className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-semibold">{t('composer.diagnosis')}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {diagnosisSection}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="medications" className="border rounded-lg overflow-hidden">
                  <AccordionTrigger className={cn(
                    'px-4 py-3 hover:no-underline hover:bg-muted/50',
                    accordionValue === 'medications' && 'bg-muted/30'
                  )}>
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center h-6 w-6 rounded-md bg-[#0d6b6e]/10 text-[#14919b]">
                        <BookTemplate className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-semibold">{t('composer.medications')}</span>
                      {medications.length > 0 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-[#0d6b6e]/10 text-[#14919b]">
                          {medications.length} {medications.length === 1 ? t('composer.item') : t('composer.items')}
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {medicationsSection}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              /* Tablet: Collapsible sections (all can be open) */
              <>
                <ClinicalSection title={t('composer.chiefComplaints')} icon={AlertCircle} defaultOpen={true}>
                  {chiefComplaintsSection}
                </ClinicalSection>

                <ClinicalSection title={t('composer.onExamination')} icon={Eye} defaultOpen={true}>
                  {onExaminationSection}
                </ClinicalSection>

                <ClinicalSection title={t('composer.investigations')} icon={FlaskConical} defaultOpen={true}>
                  {investigationsSection}
                </ClinicalSection>

                <ClinicalSection title={t('composer.diagnosis')} icon={Stethoscope} defaultOpen={true}>
                  {diagnosisSection}
                </ClinicalSection>

                <ClinicalSection
                  title={t('composer.medications')}
                  icon={BookTemplate}
                  defaultOpen={true}
                  badge={medications.length > 0 ? `${medications.length} ${medications.length === 1 ? t('composer.item') : t('composer.items')}` : undefined}
                >
                  {medicationsSection}
                </ClinicalSection>
              </>
            )}
          </div>
        )}

        {/* ─── Search Tab (Clinical Notes, Advice, Follow-up) ─── */}
        {activeTab === 'search' && (
          <div className="p-4 space-y-3">
            <ClinicalSection title={t('composer.clinicalNotes')} icon={ClipboardList} defaultOpen={true}>
              {clinicalNotesSection}
            </ClinicalSection>

            <ClinicalSection title={t('composer.advice')} icon={MessageSquare} defaultOpen={true}>
              {adviceSection}
            </ClinicalSection>

            <ClinicalSection title={t('composer.followUp')} icon={CalendarClock} defaultOpen={true}>
              {followUpSection}
            </ClinicalSection>
          </div>
        )}
      </div>

      {/* Fixed bottom: save bar + tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40">
        {/* Compact save bar */}
        <div className="bg-card border-t px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {isDirty ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                <span>{t('composer.unsavedChanges')}</span>
              </>
            ) : lastSavedAt ? (
              <>
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>{formatLastSaved()}</span>
              </>
            ) : null}
            {!isPremium && (
              <Badge variant="outline" className="text-[9px] ml-1">
                {prescriptionsRemaining}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              disabled={!isDirty}
              className="h-7 text-xs gap-1"
            >
              <Save className="h-3 w-3" />
              {t('composer.saveDraft')}
            </Button>
            <Button
              size="sm"
              onClick={handleSaveAndCreate}
              disabled={isSaving || !canCreatePrescription}
              className="h-7 text-xs gap-1"
              style={{ backgroundColor: '#0d6b6e' }}
            >
              {isSaving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <FileDown className="h-3 w-3" />
              )}
              {t('composer.saveAndCreate')}
            </Button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="bg-card border-t flex items-stretch safe-area-bottom">
          {([
            { id: 'patient' as MobileTab, label: 'Patient', icon: User },
            { id: 'rxpad' as MobileTab, label: 'Rx Pad', icon: FileText },
            { id: 'search' as MobileTab, label: 'Search', icon: Search },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors relative',
                activeTab === tab.id
                  ? 'text-[#0d6b6e] bg-[#0d6b6e]/5'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className={cn(
                'h-5 w-5',
                activeTab === tab.id && 'text-[#0d6b6e]'
              )} />
              <span className={cn(
                'text-[10px] font-medium',
                activeTab === tab.id && 'text-[#0d6b6e]'
              )}>
                {tab.label}
              </span>
              {tab.id === 'rxpad' && medications.length > 0 && (
                <span className="absolute top-1.5 right-1/4 h-2 w-2 rounded-full bg-[#0d6b6e]" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
