'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, UserPlus, Phone, Calendar, MoreHorizontal, Eye, Trash2 } from 'lucide-react'
import { TableSkeleton } from '@/components/ui/loading-skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Patient, Prescription } from '@/types'
import { authHeaders } from '@/store/auth-store'

interface PatientListProps {
  onNavigateToComposer: () => void
}

export function PatientList({ onNavigateToComposer }: PatientListProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [patientPrescriptions, setPatientPrescriptions] = useState<Prescription[]>([])
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    bloodGroup: '',
    allergies: '',
  })

  const fetchPatients = useCallback(async (query = '') => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ search: query, page: '1', limit: '50' })
      const response = await fetch(`/api/patients?${params}`, { headers: authHeaders() })
      if (response.ok) {
        const data = await response.json()
        const result = (data as { data?: { patients?: Patient[] } }).data?.patients || []
        setPatients(Array.isArray(result) ? result : [])
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchPatients(query)
  }

  const handleViewPatient = async (patient: Patient) => {
    setSelectedPatient(patient)
    setShowDetailDialog(true)
    try {
      const response = await fetch(`/api/patients/${patient.id}`, { headers: authHeaders() })
      if (response.ok) {
        const data = await response.json()
        const p = (data as { data?: Patient }).data || (data as Patient)
        setPatientPrescriptions(p.prescriptions || [])
      }
    } catch {
      setPatientPrescriptions([])
    }
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
        setShowAddDialog(false)
        setNewPatient({ name: '', age: '', gender: '', phone: '', address: '', bloodGroup: '', allergies: '' })
        fetchPatients(searchQuery)
      }
    } catch {
      // Silently fail
    }
  }

  const handleDeletePatient = async (patientId: string) => {
    try {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (response.ok) {
        setPatients((prev) => prev.filter((p) => p.id !== patientId))
      }
    } catch {
      // Silently fail
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Patients</h2>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Patient</span>
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
                    placeholder="Patient full name"
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      placeholder="01XXXXXXXXX"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select
                      value={newPatient.bloodGroup}
                      onValueChange={(v) => setNewPatient({ ...newPatient, bloodGroup: v })}
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
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Input
                    placeholder="Known allergies (comma separated)"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddPatient} className="w-full">
                  Add Patient
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4">
              <TableSkeleton rows={5} columns={6} />
            </div>
          ) : patients.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="No patients yet"
              description="Add your first patient to start creating prescriptions."
              actionLabel="Add Patient"
              onAction={() => setShowAddDialog(true)}
            />
          ) : (
            <ScrollArea className="max-h-[calc(100vh-280px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Age</TableHead>
                    <TableHead className="hidden md:table-cell">Gender</TableHead>
                    <TableHead className="hidden sm:table-cell">Phone</TableHead>
                    <TableHead className="hidden lg:table-cell">Last Visit</TableHead>
                    <TableHead className="w-10">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell className="hidden sm:table-cell">{patient.age || '-'}</TableCell>
                      <TableCell className="hidden md:table-cell">{patient.gender || '-'}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {patient.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {patient.phone}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {patient.createdAt ? (
                          <span className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" />
                            {new Date(patient.createdAt).toLocaleDateString()}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewPatient(patient)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onNavigateToComposer}>
                              <UserPlus className="h-4 w-4 mr-2" /> New Prescription
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeletePatient(patient.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Patient Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Name</Label>
                  <p className="text-sm font-medium">{selectedPatient.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Age</Label>
                  <p className="text-sm">{selectedPatient.age || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Gender</Label>
                  <p className="text-sm">{selectedPatient.gender || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="text-sm">{selectedPatient.phone || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Blood Group</Label>
                  <p className="text-sm">{selectedPatient.bloodGroup || '-'}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Allergies</Label>
                  <p className="text-sm">{selectedPatient.allergies || 'None known'}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Prescription History</Label>
                {patientPrescriptions.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-1">No prescriptions yet.</p>
                ) : (
                  <div className="space-y-2 mt-2">
                    {patientPrescriptions.map((rx) => (
                      <div key={rx.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                        <div>
                          <span className="font-medium">{rx.diagnosis || 'No diagnosis'}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(rx.date || rx.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-[10px]">{rx.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
