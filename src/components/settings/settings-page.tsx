'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useSettingsStore } from '@/store/settings-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, User, Building2, FileImage, Palette, Loader2 } from 'lucide-react'
import { authHeaders } from '@/store/auth-store'
import { useToast } from '@/hooks/use-toast'

export function SettingsPage() {
  const doctor = useAuthStore((s) => s.doctor)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const { language, setLanguage, theme, setTheme } = useSettingsStore()
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: doctor?.name || '',
    degrees: doctor?.degrees || '',
    specialty: doctor?.specialty || '',
    bmdcNumber: doctor?.bmdcNumber || '',
    phone: doctor?.phone || '',
  })
  const [chamberForm, setChamberForm] = useState({
    chamberName: doctor?.chamberName || '',
    chamberAddress: doctor?.chamberAddress || '',
    chamberPhone: doctor?.chamberPhone || '',
    chamberEmail: doctor?.chamberEmail || '',
  })
  const [letterheadSettings, setLetterheadSettings] = useState({
    letterheadColor: doctor?.settings?.letterheadColor || '#1a1a2e',
    includeQrCode: doctor?.settings?.includeQrCode ?? true,
    fontSize: doctor?.settings?.fontSize || 'medium',
  })

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      await updateProfile({
        name: profileForm.name,
        degrees: profileForm.degrees,
        specialty: profileForm.specialty,
        bmdcNumber: profileForm.bmdcNumber,
        phone: profileForm.phone,
        ...chamberForm,
      })
      toast({ title: 'Profile updated', description: 'Your profile has been saved successfully.' })
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update profile.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Settings</h2>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
          <TabsTrigger value="profile" className="gap-1 text-xs sm:text-sm">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="chamber" className="gap-1 text-xs sm:text-sm">
            <Building2 className="h-3.5 w-3.5" /> Chamber
          </TabsTrigger>
          <TabsTrigger value="letterhead" className="gap-1 text-xs sm:text-sm">
            <FileImage className="h-3.5 w-3.5" /> Letterhead
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1 text-xs sm:text-sm">
            <Palette className="h-3.5 w-3.5" /> Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Profile</CardTitle>
              <CardDescription>Update your professional information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Dr. Full Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Degrees</Label>
                <Input
                  value={profileForm.degrees}
                  onChange={(e) => setProfileForm({ ...profileForm, degrees: e.target.value })}
                  placeholder="MBBS, MD, FCPS..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Specialty</Label>
                  <Input
                    value={profileForm.specialty}
                    onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                    placeholder="Cardiology, Medicine..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>BMDC Number</Label>
                  <Input
                    value={profileForm.bmdcNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, bmdcNumber: e.target.value })}
                    placeholder="A-XXXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <Separator />

              <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chamber Tab */}
        <TabsContent value="chamber">
          <Card>
            <CardHeader>
              <CardTitle>Chamber Information</CardTitle>
              <CardDescription>Your practice location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chamber Name</Label>
                <Input
                  value={chamberForm.chamberName}
                  onChange={(e) => setChamberForm({ ...chamberForm, chamberName: e.target.value })}
                  placeholder="Chamber/clinic name"
                />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={chamberForm.chamberAddress}
                  onChange={(e) => setChamberForm({ ...chamberForm, chamberAddress: e.target.value })}
                  placeholder="Full address"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={chamberForm.chamberPhone}
                    onChange={(e) => setChamberForm({ ...chamberForm, chamberPhone: e.target.value })}
                    placeholder="Chamber phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={chamberForm.chamberEmail}
                    onChange={(e) => setChamberForm({ ...chamberForm, chamberEmail: e.target.value })}
                    placeholder="chamber@example.com"
                  />
                </div>
              </div>

              <Separator />

              <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Chamber Info
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Letterhead Tab */}
        <TabsContent value="letterhead">
          <Card>
            <CardHeader>
              <CardTitle>Letterhead Settings</CardTitle>
              <CardDescription>Customize your prescription letterhead</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo Upload</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <FileImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click or drag to upload logo</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PNG, JPG up to 2MB</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Brand Color</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={letterheadSettings.letterheadColor}
                    onChange={(e) => setLetterheadSettings({ ...letterheadSettings, letterheadColor: e.target.value })}
                    className="h-10 w-10 rounded border cursor-pointer"
                  />
                  <Input
                    value={letterheadSettings.letterheadColor}
                    onChange={(e) => setLetterheadSettings({ ...letterheadSettings, letterheadColor: e.target.value })}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Signature Upload</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground">Upload your signature image</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Choose File
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Include QR Code</Label>
                  <p className="text-xs text-muted-foreground">Add verification QR on prescriptions</p>
                </div>
                <Switch
                  checked={letterheadSettings.includeQrCode}
                  onCheckedChange={(checked) => setLetterheadSettings({ ...letterheadSettings, includeQrCode: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Language, font size, and appearance settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={(v) => setLanguage(v as 'en' | 'bn')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'system')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Prescription Font Size</Label>
                <Select
                  value={letterheadSettings.fontSize}
                  onValueChange={(v) => setLetterheadSettings({ ...letterheadSettings, fontSize: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
