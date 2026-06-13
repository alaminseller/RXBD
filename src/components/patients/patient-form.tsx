'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Patient } from '@/types'

interface PatientFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient?: Patient | null
  onSave: (patient: Partial<Patient>) => void
}

export function PatientForm({ open, onOpenChange, patient, onSave }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    age: patient?.age || '',
    gender: patient?.gender || '',
    phone: patient?.phone || '',
    address: patient?.address || '',
    bloodGroup: patient?.bloodGroup || '',
    allergies: patient?.allergies || '',
    chronicDiseases: patient?.chronicDiseases || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{patient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input
              placeholder="Patient full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                placeholder="e.g. 35"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) => setFormData({ ...formData, gender: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                placeholder="01XXXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Blood Group</Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(v) => setFormData({ ...formData, bloodGroup: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              placeholder="Patient address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Allergies</Label>
            <Input
              placeholder="Known allergies"
              value={formData.allergies}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Chronic Diseases</Label>
            <Input
              placeholder="e.g. Diabetes, Hypertension"
              value={formData.chronicDiseases}
              onChange={(e) => setFormData({ ...formData, chronicDiseases: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full">
            {patient ? 'Update Patient' : 'Add Patient'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
