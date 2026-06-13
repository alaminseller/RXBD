'use client'

import { useState, useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Search, FileText, Download, Trash2, Eye, Calendar, Filter } from 'lucide-react'
import type { Prescription } from '@/types'
import { authHeaders } from '@/store/auth-store'

export function PrescriptionList() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null)
  const [showDetailDialog, setShowDetailDialog] = useState(false)

  const fetchPrescriptions = useCallback(async (query = '', status = 'all') => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ search: query, page: '1', limit: '50' })
      if (status && status !== 'all') {
        params.set('status', status)
      }
      const response = await fetch(`/api/prescriptions?${params}`, { headers: authHeaders() })
      if (response.ok) {
        const data = await response.json()
        const result = (data as { data?: { prescriptions?: Prescription[] } }).data?.prescriptions || []
        setPrescriptions(Array.isArray(result) ? result : [])
      }
    } catch {
      // Silently fail
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPrescriptions()
  }, [fetchPrescriptions])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    fetchPrescriptions(query, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    fetchPrescriptions(searchQuery, status)
  }

  const handleViewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription)
    setShowDetailDialog(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/prescriptions/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })
      if (response.ok) {
        setPrescriptions((prev) => prev.filter((p) => p.id !== id))
      }
    } catch {
      // Silently fail
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">{status}</Badge>
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Prescriptions</h2>
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient or diagnosis..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading prescriptions...</div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No prescriptions found.</p>
              <p className="text-xs mt-1">Create your first prescription from the composer.</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[calc(100vh-280px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead className="hidden md:table-cell">Diagnosis</TableHead>
                    <TableHead className="hidden sm:table-cell">Medications</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prescriptions.map((rx) => (
                    <TableRow key={rx.id}>
                      <TableCell className="text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(rx.date || rx.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {(rx as Prescription & { patientName?: string }).patientName || rx.patient?.name || '-'}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {rx.diagnosis || '-'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="text-[10px]">
                          {Array.isArray(rx.medications) ? rx.medications.length : 0} meds
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(rx.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleViewDetails(rx)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Prescription</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the prescription
                                  for {(rx as Prescription & { patientName?: string }).patientName || rx.patient?.name || 'this patient'}.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(rx.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Prescription Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
          </DialogHeader>
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Date</Label>
                  <p className="text-sm font-medium">
                    {new Date(selectedPrescription.date || selectedPrescription.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Patient</Label>
                  <p className="text-sm font-medium">
                    {(selectedPrescription as Prescription & { patientName?: string }).patientName || selectedPrescription.patient?.name || '-'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedPrescription.status)}</div>
                </div>
              </div>

              {/* Vitals */}
              {(selectedPrescription.bloodPressure || selectedPrescription.pulse || selectedPrescription.temperature) && (
                <div>
                  <Label className="text-xs text-muted-foreground">Vitals</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedPrescription.bloodPressure && <Badge variant="outline">BP: {selectedPrescription.bloodPressure}</Badge>}
                    {selectedPrescription.pulse && <Badge variant="outline">Pulse: {selectedPrescription.pulse}</Badge>}
                    {selectedPrescription.temperature && <Badge variant="outline">Temp: {selectedPrescription.temperature}</Badge>}
                    {selectedPrescription.weight && <Badge variant="outline">Wt: {selectedPrescription.weight}</Badge>}
                    {selectedPrescription.spO2 && <Badge variant="outline">SpO2: {selectedPrescription.spO2}</Badge>}
                  </div>
                </div>
              )}

              {/* Diagnosis */}
              {selectedPrescription.diagnosis && (
                <div>
                  <Label className="text-xs text-muted-foreground">Diagnosis</Label>
                  <p className="text-sm mt-1">{selectedPrescription.diagnosis}</p>
                </div>
              )}

              {/* Medications */}
              {Array.isArray(selectedPrescription.medications) && selectedPrescription.medications.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground">Medications</Label>
                  <div className="space-y-2 mt-2">
                    {selectedPrescription.medications.map((med, idx) => (
                      <div key={idx} className="p-2 bg-muted/50 rounded text-sm">
                        <div className="font-medium">{med.brand} <span className="text-muted-foreground">({med.generic})</span></div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {med.strength} &bull; {med.dosageForm} &bull; {med.frequency} &bull; {med.duration}
                          {med.instructions && ` • ${med.instructions}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advice */}
              {selectedPrescription.advice && (
                <div>
                  <Label className="text-xs text-muted-foreground">Advice</Label>
                  <p className="text-sm mt-1">{selectedPrescription.advice}</p>
                </div>
              )}

              {/* Follow Up */}
              {selectedPrescription.followUpDate && (
                <div>
                  <Label className="text-xs text-muted-foreground">Follow-up Date</Label>
                  <p className="text-sm mt-1">{selectedPrescription.followUpDate}</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


