'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Palette, Loader2, Upload, QrCode, Image as ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const PRESET_COLORS = [
  { name: 'Dark Teal', value: '#0d6b6e' },
  { name: 'Navy', value: '#1a1a4e' },
  { name: 'Maroon', value: '#800020' },
  { name: 'Dark Green', value: '#1b5e20' },
  { name: 'Charcoal', value: '#36454f' },
  { name: 'Burgundy', value: '#800040' },
]

interface BrandingStepProps {
  onNext: () => void
  onBack: () => void
}

export function BrandingStep({ onNext, onBack }: BrandingStepProps) {
  const doctor = useAuthStore((s) => s.doctor)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [headerColor, setHeaderColor] = useState(
    doctor?.settings?.letterheadColor || '#0d6b6e'
  )
  const [includeQrCode, setIncludeQrCode] = useState(
    doctor?.settings?.includeQrCode ?? true
  )
  const [logoPlaceholder, setLogoPlaceholder] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile({
        letterheadColor: headerColor,
        includeQrCode,
      } as Record<string, unknown>)
      toast({ title: 'Branding saved!', description: 'Your prescription header has been customized.' })
      onNext()
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save branding.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const doctorName = doctor?.name || 'Dr. Your Name'
  const doctorDegrees = doctor?.degrees || 'MBBS'
  const doctorSpecialty = doctor?.specialty || 'Medicine'
  const chamberName = doctor?.chamberName || 'Your Chamber'

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0d6b6e] to-[#14919b] text-white mb-2">
          <Palette className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold">Customize Your Prescription</h2>
        <p className="text-sm text-muted-foreground">
          Make your prescriptions look professional with your personal branding.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-5">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Upload Logo</Label>
            <button
              onClick={() => setLogoPlaceholder(!logoPlaceholder)}
              className="w-full border-2 border-dashed border-border rounded-xl p-5 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group"
            >
              {logoPlaceholder ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs text-primary font-medium">Logo added</span>
                  <span className="text-[10px] text-muted-foreground">Click to remove</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm text-muted-foreground">Click to upload logo</span>
                  <span className="text-[10px] text-muted-foreground/60">PNG, JPG up to 2MB</span>
                </div>
              )}
            </button>
          </div>

          {/* Header Color */}
          <div className="space-y-3">
            <Label>Header Color</Label>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setHeaderColor(color.value)}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border-2 transition-all text-left ${
                    headerColor === color.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div
                    className="h-6 w-6 rounded-md shrink-0"
                    style={{ backgroundColor: color.value }}
                  />
                  <span className="text-xs font-medium truncate">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* QR Code Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Include QR Code</p>
                <p className="text-xs text-muted-foreground">Verification QR on prescriptions</p>
              </div>
            </div>
            <Switch checked={includeQrCode} onCheckedChange={setIncludeQrCode} />
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Live Preview</Label>
          <div className="border rounded-xl overflow-hidden shadow-sm">
            {/* Prescription Header Preview */}
            <div
              className="p-4 text-white"
              style={{ backgroundColor: headerColor }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-bold leading-tight">{doctorName}</h3>
                  <p className="text-xs opacity-90 mt-0.5">{doctorDegrees}</p>
                  <p className="text-xs opacity-75">{doctorSpecialty} Specialist</p>
                  <div className="mt-2 space-y-0.5">
                    <p className="text-[10px] opacity-70">{chamberName}</p>
                  </div>
                </div>
                {logoPlaceholder && (
                  <div className="h-10 w-10 rounded-md bg-white/20 flex items-center justify-center shrink-0 ml-3">
                    <ImageIcon className="h-5 w-5 text-white/70" />
                  </div>
                )}
              </div>
            </div>
            {/* Simulated prescription body */}
            <div className="p-4 bg-white space-y-3">
              <div className="border-b border-dashed border-gray-300 pb-2">
                <div className="flex gap-4 text-[10px] text-gray-500">
                  <span>Patient: ___________</span>
                  <span>Age: ____</span>
                  <span>Date: ___________</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-semibold text-gray-700 uppercase tracking-wide">Rx</div>
                <div className="h-2 bg-gray-100 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-2/3" />
                <div className="h-2 bg-gray-100 rounded w-1/2" />
              </div>
              {includeQrCode && (
                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-[8px] text-gray-400">
                    <QrCode className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center">
            This is a preview of how your prescription header will look
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
          Back
        </Button>
        <div className="flex items-center gap-3">
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
                <Palette className="h-4 w-4" />
                Save & Continue
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
