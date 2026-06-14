'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { UserCheck, Loader2, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const SPECIALTIES = [
  'General Practice',
  'Internal Medicine',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Nephrology',
  'Neurology',
  'Obstetrics & Gynecology',
  'Oncology',
  'Ophthalmology',
  'Orthopedics',
  'Otolaryngology (ENT)',
  'Pediatrics',
  'Psychiatry',
  'Pulmonology',
  'Radiology',
  'Surgery (General)',
  'Urology',
  'Other',
]

interface ProfileStepProps {
  onNext: () => void
}

export function ProfileStep({ onNext }: ProfileStepProps) {
  const doctor = useAuthStore((s) => s.doctor)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [showBadge, setShowBadge] = useState(false)
  const [form, setForm] = useState({
    name: doctor?.name || '',
    degrees: doctor?.degrees || '',
    specialty: doctor?.specialty || '',
    bmdcNumber: doctor?.bmdcNumber || '',
    chamberName: doctor?.chamberName || '',
    chamberAddress: doctor?.chamberAddress || '',
    chamberPhone: doctor?.chamberPhone || '',
  })

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: 'Name required', description: 'Please enter your full name.', variant: 'destructive' })
      return
    }

    setIsSaving(true)
    try {
      await updateProfile({
        name: form.name,
        degrees: form.degrees,
        specialty: form.specialty,
        bmdcNumber: form.bmdcNumber,
        chamberName: form.chamberName,
        chamberAddress: form.chamberAddress,
        chamberPhone: form.chamberPhone,
      })
      setShowBadge(true)
      toast({ title: 'Profile saved!', description: 'Your professional profile is now complete.' })
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save profile.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0d6b6e] to-[#14919b] text-white mb-2">
          <UserCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold">Complete Your Profile</h2>
        <p className="text-sm text-muted-foreground">
          Let&apos;s set up your professional details so your prescriptions look great.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
        <div className="space-y-2">
          <Label htmlFor="onb-name">Full Name</Label>
          <Input
            id="onb-name"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Dr. Mohammad Rahman"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onb-degrees">Degrees</Label>
          <Input
            id="onb-degrees"
            value={form.degrees}
            onChange={(e) => updateField('degrees', e.target.value)}
            placeholder="MBBS, MD, FCPS..."
          />
          <p className="text-xs text-muted-foreground">Comma-separated, e.g. MBBS, MD, FCPS</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="onb-specialty">Specialty</Label>
            <Select value={form.specialty} onValueChange={(v) => updateField('specialty', v)}>
              <SelectTrigger id="onb-specialty">
                <SelectValue placeholder="Select specialty" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="onb-bmdc">BMDC Registration No.</Label>
            <Input
              id="onb-bmdc"
              value={form.bmdcNumber}
              onChange={(e) => updateField('bmdcNumber', e.target.value)}
              placeholder="A-XXXXX"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="onb-chamber">Chamber Name</Label>
          <Input
            id="onb-chamber"
            value={form.chamberName}
            onChange={(e) => updateField('chamberName', e.target.value)}
            placeholder="Your chamber/clinic name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onb-address">Chamber Address</Label>
          <Input
            id="onb-address"
            value={form.chamberAddress}
            onChange={(e) => updateField('chamberAddress', e.target.value)}
            placeholder="Full address of your chamber"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onb-phone">Chamber Phone</Label>
          <Input
            id="onb-phone"
            value={form.chamberPhone}
            onChange={(e) => updateField('chamberPhone', e.target.value)}
            placeholder="01XXXXXXXXX"
          />
        </div>
      </div>

      {/* Verified Doctor Badge Preview */}
      {showBadge && (
        <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <ShieldCheck className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">Verified Doctor</span>
          <Badge className="bg-green-600 text-white text-[10px] px-1.5">BMDC</Badge>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onNext} className="text-muted-foreground">
          Skip for now
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="gap-2 bg-gradient-to-r from-[#0d6b6e] to-[#14919b] hover:from-[#0a5759] hover:to-[#117a84]"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <UserCheck className="h-4 w-4" />
              Save & Continue
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
