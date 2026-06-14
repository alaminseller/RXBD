'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePrescriptionStore } from '@/store/prescription-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, UserPlus, UserCheck, AlertTriangle, Heart, FileText, ChevronRight } from 'lucide-react'
import type { Patient, Prescription } from '@/types'
import { authHeaders } from '@/store/auth-store'
import { PrescriptionDetailDialog } from '@/components/prescriptions/prescription-detail-dialog'

interface PatientWithHistory extends Patient {
  recentPrescriptions?: Prescription[]
}

export function PatientSelector() {
  const { patientId, patientName, patientAge, patientGender, setPatient, clearPatient } = usePrescriptionStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Patient[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: '', phone: '' })

  // Returning patient state
  const [selectedPatientData, setSelectedPatientData] = useState<PatientWithHistory | null>(null)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [showHistoryDetail, setShowHistoryDetail] = useState(false)
  const [detailPrescription, setDetailPrescription] = useState<Prescription | null>(null)

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

  const fetchPatientHistory = useCallback(async (patientId: string) => {
    setIsLoadingHistory(true)
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        headers: authHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        const patientData = (data as { data?: PatientWithHistory }).data
        if (patientData) {
          setSelectedPatientData(patientData)
        }
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoadingHistory(false)
    }
  }, [])

  // Fetch patient data when patient is selected
  useEffect(() => {
    if (patientId) {
      fetchPatientHistory(patientId)
    } else {
      setSelectedPatientData(null)
    }
  }, [patientId, fetchPatientHistory])

  const handleSelectPatient = (patient: Patient) => {
    setPatient(patient.id, patient.name, patient.age, patient.gender)
    setSearchQuery('')
    setSearchResults([])
  }

  const handleClearPatient = () => {
    clearPatient()
    setSearchQuery('')
    setSearchResults([])
    setSelectedPatientData(null)
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

  // Parse allergies and chronic diseases for display
  const allergies = selectedPatientData?.allergies
    ? selectedPatientData.allergies.split(',').map((a) => a.trim()).filter(Boolean)
    : []
  const chronicDiseases = selectedPatientData?.chronicDiseases
    ? selectedPatientData.chronicDiseases.split(',').map((d) => d.trim()).filter(Boolean)
    : []
  const recentPrescriptions = selectedPatientData?.recentPrescriptions?.slice(0, 5) || []

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      })
    } catch {
      return dateString
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
          <div className="space-y-3">
            {/* Patient Info */}
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
              <div className="font-medium text-sm">{patientName}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {patientAge && `Age: ${patientAge}`}
                {patientAge && patientGender && ' • '}
                {patientGender && `Gender: ${patientGender}`}
              </div>
            </div>

            {/* Loading indicator */}
            {isLoadingHistory && (
              <div className="text-xs text-muted-foreground text-center py-1">
                Loading patient history...
              </div>
            )}

            {/* Allergies Alert */}
            {allergies.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-red-500" />
                  <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">
                    Allergies
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {allergies.map((allergy, idx) => (
                    <Badge
                      key={idx}
                      className="bg-red-50 text-red-700 border-red-200 text-[10px] py-0 px-1.5"
                    >
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Chronic Diseases Alert */}
            {chronicDiseases.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-amber-500" />
                  <span className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                    Chronic Conditions
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {chronicDiseases.map((disease, idx) => (
                    <Badge
                      key={idx}
                      className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] py-0 px-1.5"
                    >
                      {disease}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Prescriptions Quick Summary */}
            {recentPrescriptions.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-[#0d6b6e]" />
                  <span className="text-[10px] font-semibold text-[#0d6b6e] uppercase tracking-wider">
                    Recent Prescriptions
                  </span>
                </div>
                <ScrollArea className="max-h-32 overflow-y-auto custom-scrollbar">
                  <div className="space-y-1">
                    {recentPrescriptions.map((rx) => (
                      <button
                        key={rx.id}
                        onClick={() => {
                          setDetailPrescription(rx)
                          setShowHistoryDetail(true)
                        }}
                        className="w-full text-left flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-[#0d6b6e]/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {formatDate(rx.date || rx.createdAt)}
                          </span>
                          <span className="text-xs text-gray-700 truncate">
                            {rx.diagnosis || 'No diagnosis'}
                          </span>
                        </div>
                        <ChevronRight className="h-3 w-3 text-gray-300 group-hover:text-[#0d6b6e] flex-shrink-0 ml-1" />
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* No history message for returning patients */}
            {!isLoadingHistory && selectedPatientData && allergies.length === 0 && chronicDiseases.length === 0 && recentPrescriptions.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-1">
                No medical history on file
              </div>
            )}
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
              <ScrollArea className="max-h-40 overflow-y-auto custom-scrollbar border rounded-lg">
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
                    {/* Show allergy/chronic indicators in search results */}
                    {(patient.allergies || patient.chronicDiseases) && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {patient.allergies && (
                          <Badge className="bg-red-50 text-red-600 border-red-200 text-[9px] py-0 px-1">
                            ⚠ Allergies
                          </Badge>
                        )}
                        {patient.chronicDiseases && (
                          <Badge className="bg-amber-50 text-amber-600 border-amber-200 text-[9px] py-0 px-1">
                            ♥ Chronic
                          </Badge>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </ScrollArea>
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

      {/* Prescription Detail Dialog for history view */}
      <PrescriptionDetailDialog
        prescription={detailPrescription}
        open={showHistoryDetail}
        onOpenChange={setShowHistoryDetail}
      />
    </Card>
  )
}
