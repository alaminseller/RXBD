'use client'

import { useState, useRef } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useSubscription } from '@/hooks/use-subscription'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  FileImage,
  PenTool,
  Save,
  Loader2,
  Crown,
  Lock,
  Upload,
  X,
} from 'lucide-react'
import { authHeaders } from '@/store/auth-store'
import { useToast } from '@/hooks/use-toast'

const COLOR_PRESETS = [
  { name: 'Dark Teal', value: '#0d6b6e' },
  { name: 'Navy', value: '#1a1a4e' },
  { name: 'Maroon', value: '#800020' },
  { name: 'Dark Green', value: '#1b5e20' },
  { name: 'Charcoal', value: '#36454f' },
  { name: 'Burgundy', value: '#800040' },
]

export function LetterheadSettings() {
  const doctor = useAuthStore((s) => s.doctor)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const { isPremium } = useSubscription()
  const { toast } = useToast()

  const logoInputRef = useRef<HTMLInputElement>(null)
  const signatureInputRef = useRef<HTMLInputElement>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(
    doctor?.settings?.letterheadLogoUrl || null
  )
  const [signaturePreview, setSignaturePreview] = useState<string | null>(
    doctor?.settings?.signatureUrl || null
  )
  const [form, setForm] = useState({
    letterheadLogoUrl: doctor?.settings?.letterheadLogoUrl || '',
    letterheadColor: doctor?.settings?.letterheadColor || '#0d6b6e',
    signatureUrl: doctor?.settings?.signatureUrl || '',
    includeQrCode: doctor?.settings?.includeQrCode ?? true,
  })
  const [customHex, setCustomHex] = useState(form.letterheadColor)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Logo must be under 2MB.', variant: 'destructive' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setLogoPreview(dataUrl)
      setForm((prev) => ({ ...prev, letterheadLogoUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Signature must be under 2MB.', variant: 'destructive' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      setSignaturePreview(dataUrl)
      setForm((prev) => ({ ...prev, signatureUrl: dataUrl }))
    }
    reader.readAsDataURL(file)
  }

  const handleColorSelect = (color: string) => {
    setForm((prev) => ({ ...prev, letterheadColor: color }))
    setCustomHex(color)
  }

  const handleCustomHexChange = (value: string) => {
    setCustomHex(value)
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setForm((prev) => ({ ...prev, letterheadColor: value }))
    }
  }

  const handleClearLogo = () => {
    setLogoPreview(null)
    setForm((prev) => ({ ...prev, letterheadLogoUrl: '' }))
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const handleClearSignature = () => {
    setSignaturePreview(null)
    setForm((prev) => ({ ...prev, signatureUrl: '' }))
    if (signatureInputRef.current) signatureInputRef.current.value = ''
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateProfile({
        letterheadLogoUrl: form.letterheadLogoUrl,
        letterheadColor: form.letterheadColor,
        signatureUrl: form.signatureUrl,
        includeQrCode: form.includeQrCode,
      })
      toast({ title: 'Letterhead saved', description: 'Your letterhead settings have been updated.' })
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to save letterhead settings.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Premium gate: show upgrade prompt for free users
  if (!isPremium) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Letterhead Settings
          </CardTitle>
          <CardDescription>Customize your prescription letterhead</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#0d6b6e]/10 to-[#14919b]/10 flex items-center justify-center mb-4">
              <Crown className="h-7 w-7 text-[#0d6b6e]" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Premium Feature</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Custom letterhead, logo, and signature are available on the Premium plan.
              Upgrade to personalize your prescriptions.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Upgrade to Premium to unlock</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Letterhead Settings
            <span className="ml-auto text-xs font-normal text-yellow-600 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="h-3 w-3" /> Premium
            </span>
          </CardTitle>
          <CardDescription>Customize your prescription letterhead</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Logo Upload</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative group">
              {logoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-20 max-w-[200px] object-contain mx-auto"
                  />
                  <button
                    onClick={handleClearLogo}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <>
                  <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click or drag to upload logo</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 2MB</p>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1"
                onClick={() => logoInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                {logoPreview ? 'Change Logo' : 'Choose File'}
              </Button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>

          <Separator />

          {/* Header Color Picker */}
          <div className="space-y-3">
            <Label>Brand Color</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleColorSelect(preset.value)}
                  className={`h-9 w-9 rounded-lg border-2 transition-all hover:scale-110 ${
                    form.letterheadColor === preset.value
                      ? 'border-foreground ring-2 ring-primary/30 scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: preset.value }}
                  title={preset.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.letterheadColor}
                onChange={(e) => handleColorSelect(e.target.value)}
                className="h-10 w-10 rounded border cursor-pointer"
              />
              <Input
                value={customHex}
                onChange={(e) => handleCustomHexChange(e.target.value)}
                placeholder="#000000"
                className="w-32"
              />
            </div>
          </div>

          <Separator />

          {/* Signature Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <PenTool className="h-3.5 w-3.5" />
              Signature Upload
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative group">
              {signaturePreview ? (
                <div className="relative inline-block">
                  <img
                    src={signaturePreview}
                    alt="Signature preview"
                    className="h-16 max-w-[200px] object-contain mx-auto"
                  />
                  <button
                    onClick={handleClearSignature}
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <>
                  <PenTool className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload your signature image</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PNG with transparent background recommended</p>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="mt-3 gap-1"
                onClick={() => signatureInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5" />
                {signaturePreview ? 'Change Signature' : 'Choose File'}
              </Button>
              <input
                ref={signatureInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleSignatureUpload}
                className="hidden"
              />
            </div>
          </div>

          <Separator />

          {/* QR Code Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Include QR Code</Label>
              <p className="text-xs text-muted-foreground">Add verification QR on prescriptions</p>
            </div>
            <Switch
              checked={form.includeQrCode}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, includeQrCode: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden shadow-sm">
            {/* Prescription Header Preview */}
            <div
              className="p-4 text-white"
              style={{ backgroundColor: form.letterheadColor }}
            >
              <div className="flex items-center gap-3">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="h-12 w-12 object-contain rounded bg-white/20"
                  />
                ) : (
                  <div className="h-12 w-12 rounded bg-white/20 flex items-center justify-center text-white/50 text-xs">
                    Logo
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg leading-tight">
                    {doctor?.name || 'Dr. Name'}
                  </h3>
                  {doctor?.degrees && (
                    <p className="text-xs text-white/80">{doctor.degrees}</p>
                  )}
                  <p className="text-xs text-white/70 mt-0.5">
                    {doctor?.specialty || 'Specialty'}
                    {doctor?.bmdcNumber ? ` • BMDC: ${doctor.bmdcNumber}` : ''}
                  </p>
                </div>
              </div>
              {doctor?.chamberName && (
                <div className="mt-2 pt-2 border-t border-white/20 text-xs text-white/80">
                  {doctor.chamberName}
                  {doctor.chamberAddress ? ` • ${doctor.chamberAddress}` : ''}
                  {doctor.chamberPhone ? ` • ${doctor.chamberPhone}` : ''}
                </div>
              )}
            </div>
            {/* Simulated prescription body */}
            <div className="p-4 space-y-3">
              <div className="flex gap-8 text-sm">
                <span className="text-muted-foreground">Patient: <span className="text-foreground">John Doe</span></span>
                <span className="text-muted-foreground">Age: <span className="text-foreground">35</span></span>
                <span className="text-muted-foreground">Date: <span className="text-foreground">{new Date().toLocaleDateString()}</span></span>
              </div>
              <div className="border-t border-dashed pt-3 space-y-2">
                <div className="h-2.5 bg-muted/40 rounded w-3/4" />
                <div className="h-2.5 bg-muted/40 rounded w-1/2" />
                <div className="h-2.5 bg-muted/40 rounded w-2/3" />
              </div>
              {/* Signature area */}
              <div className="flex items-end justify-between pt-4 border-t border-dashed">
                <div className="text-xs text-muted-foreground">
                  {form.includeQrCode && (
                    <span className="flex items-center gap-1">
                      <span className="h-8 w-8 bg-muted/50 rounded grid place-items-center text-[8px]">QR</span>
                      Verified by RxBD
                    </span>
                  )}
                </div>
                <div className="text-right">
                  {signaturePreview ? (
                    <img
                      src={signaturePreview}
                      alt="Signature"
                      className="h-10 object-contain"
                    />
                  ) : (
                    <div className="h-10 flex items-end">
                      <span className="text-xs text-muted-foreground italic">Signature</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full gap-2 bg-gradient-to-r from-[#0d6b6e] to-[#14919b] hover:from-[#0a5759] hover:to-[#117a84]"
      >
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Letterhead Settings
      </Button>
    </div>
  )
}
