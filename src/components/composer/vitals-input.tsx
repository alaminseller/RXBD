'use client'

import { usePrescriptionStore } from '@/store/prescription-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, Heart, Thermometer, Weight, Droplets } from 'lucide-react'

export function VitalsInput() {
  const { bloodPressure, pulse, temperature, weight, spO2, setVitals } = usePrescriptionStore()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Vitals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Heart className="h-3 w-3" /> Blood Pressure
          </Label>
          <Input
            placeholder="120/80"
            value={bloodPressure}
            onChange={(e) => setVitals({ bloodPressure: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Activity className="h-3 w-3" /> Pulse
          </Label>
          <Input
            placeholder="72 bpm"
            value={pulse}
            onChange={(e) => setVitals({ pulse: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Thermometer className="h-3 w-3" /> Temperature
          </Label>
          <Input
            placeholder="98.6 °F"
            value={temperature}
            onChange={(e) => setVitals({ temperature: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Weight className="h-3 w-3" /> Weight
          </Label>
          <Input
            placeholder="65 kg"
            value={weight}
            onChange={(e) => setVitals({ weight: e.target.value })}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1">
            <Droplets className="h-3 w-3" /> SpO2
          </Label>
          <Input
            placeholder="98%"
            value={spO2}
            onChange={(e) => setVitals({ spO2: e.target.value })}
            className="h-8 text-sm"
          />
        </div>
      </CardContent>
    </Card>
  )
}
