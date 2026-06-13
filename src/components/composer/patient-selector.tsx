'use client'

import { useState, useCallback } from 'react'
import { usePrescriptionStore } from '@/store/prescription-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, UserPlus, UserCheck } from 'lucide-react'
import type { Patient } from '@/types'
import { authHeaders } from '@/store/auth-store'

export function PatientSelector() {
  const { patientId, patientName, patientAge, patientGender, setPatient, clearPatient } = usePrescriptionStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', phone: '' })

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setIsSearching(true)
    try {
      const params = new URLSearchParams({ search: query, page: '1', limit: '10' })
      const response = await fetch(`/api/patients?${params}`, {
        headers: authHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        const patients = (data as { data?: { patients?: Patient[] } }).data?.patients || []
        setSearchResults(Array.isArray(patients) ? patients : [])
      }
    } catch {
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleSelectPatient = (patient: Patient) => {
    setPatient(patient.id, patient.name, patient.age, patient.gender)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleClearPatient = () => {
    clearPatient()
    setSearchQuery('')
    setSearchResults([])
  }

  const handleAddPatient = async () => {
    if (!newPatient.name.trim()) return
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(newPatient),
      })
      if (response.ok) {
        const data = await response.json()
        const patient = (data as { data?: Patient }).data || (data as Patient)
        handleSelectPatient(patient)
        setShowAddDialog(false)
        setNewPatient({ name: '', age: '', gender: '', phone: '' })
      }
    } catch {
      // Silently fail
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-primary" />
            Patient
          </span>
          {patientId && (
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={handleClearPatient}>
              Change
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {patientId ? (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="font-medium text-sm">{patientName}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {patientAge && `Age: ${patientAge}`}
              {patientAge && patientGender && ' • '}
              {patientGender && `Gender: ${patientGender}`}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>

            {isSearching && (
              <div className="text-xs text-muted-foreground text-center py-2">Searching...</div>
            )}

            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto custom-scrollbar border rounded-lg">
                {searchResults.map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="w-full text-left px-3 py-2 hover:bg-accent text-sm border-b last:border-0"
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {patient.age && `Age: ${patient.age}`}
                      {patient.phone && ` • Phone: ${patient.phone}`}
                    </div>
                  </button>
                ))}
              </div>
            )}

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                  <UserPlus className="h-3.5 w-3.5" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Patient</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      placeholder="Patient name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input
                        placeholder="e.g. 35"
                        value={newPatient.age}
                        onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={newPatient.gender}
                        onValueChange={(v) => setNewPatient({ ...newPatient, gender: v })}
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
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="01XXXXXXXXX"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAddPatient} className="w-full">
                    Add Patient
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
