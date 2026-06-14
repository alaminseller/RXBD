'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  Users,
  Search,
  Pill,
  FileDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

interface TutorialStepProps {
  onComplete: () => void
  onBack: () => void
}

interface TooltipStop {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  position: 'left' | 'center' | 'right'
}

const TOOLTIP_STOPS: TooltipStop[] = [
  {
    id: 'patient',
    label: 'Select a Patient',
    description: 'Start by selecting or adding a patient. Their info auto-fills the prescription header.',
    icon: <Users className="h-4 w-4" />,
    position: 'left',
  },
  {
    id: 'search',
    label: 'Search Medicines',
    description: 'Type a medicine name or generic to instantly find it from our database of 130+ Bangladeshi brands.',
    icon: <Search className="h-4 w-4" />,
    position: 'center',
  },
  {
    id: 'medication',
    label: 'Add Medications',
    description: 'Set frequency, duration, and special instructions for each medicine using smart dropdowns.',
    icon: <Pill className="h-4 w-4" />,
    position: 'center',
  },
  {
    id: 'save',
    label: 'Save & Create',
    description: 'When you\'re ready, save the prescription. It generates a PDF with QR verification automatically!',
    icon: <FileDown className="h-4 w-4" />,
    position: 'right',
  },
]

export function TutorialStep({ onComplete, onBack }: TutorialStepProps) {
  const [currentStop, setCurrentStop] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleGotIt = () => {
    if (currentStop < TOOLTIP_STOPS.length - 1) {
      setCurrentStop((prev) => prev + 1)
    } else {
      setIsComplete(true)
      setShowConfetti(true)
    }
  }

  // Auto-dismiss confetti after animation
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  const activeStop = TOOLTIP_STOPS[currentStop]

  return (
    <div className="space-y-6">
      {/* Step Header */}
      {!isComplete && (
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0d6b6e] to-[#14919b] text-white mb-2">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold">Write Your First Prescription</h2>
          <p className="text-sm text-muted-foreground">
            Quick tour of the composer — {currentStop + 1} of {TOOLTIP_STOPS.length}
          </p>
        </div>
      )}

      {/* Completion State */}
      {isComplete ? (
        <div className="text-center space-y-4 py-4">
          {/* CSS Confetti Animation */}
          {showConfetti && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute animate-confetti"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-5%',
                    animationDelay: `${Math.random() * 0.5}s`,
                    animationDuration: `${1.5 + Math.random() * 1.5}s`,
                    width: `${6 + Math.random() * 8}px`,
                    height: `${6 + Math.random() * 8}px`,
                    backgroundColor: ['#0d6b6e', '#14919b', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'][
                      Math.floor(Math.random() * 6)
                    ],
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                />
              ))}
            </div>
          )}

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#0d6b6e] to-[#14919b] text-white mb-2 animate-in zoom-in-50 duration-500">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold">You&apos;re All Set!</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            You now know the basics of writing prescriptions with RxBD. You can always explore more features from the dashboard.
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto pt-4">
            {TOOLTIP_STOPS.map((stop) => (
              <div
                key={stop.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 text-sm"
              >
                <div className="text-primary">{stop.icon}</div>
                <span className="text-xs font-medium">{stop.label}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={onComplete}
            size="lg"
            className="gap-2 bg-gradient-to-r from-[#0d6b6e] to-[#14919b] hover:from-[#0a5759] hover:to-[#117a84] mt-4"
          >
            <Sparkles className="h-4 w-4" />
            Start Using RxBD
          </Button>
        </div>
      ) : (
        <>
          {/* Simplified Composer Preview */}
          <div className="relative border rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-0">
              {/* Left Panel - Patient */}
              <div
                className={`sm:col-span-3 p-3 border-r transition-all duration-500 ${
                  activeStop.id === 'patient'
                    ? 'ring-2 ring-[#0d6b6e] ring-inset bg-[#0d6b6e]/5'
                    : 'opacity-50'
                }`}
              >
                <div className="text-xs font-semibold text-muted-foreground mb-2">Patient</div>
                <div className="h-8 bg-gray-100 rounded mb-2" />
                <div className="h-4 bg-gray-50 rounded w-2/3 mb-1" />
                <div className="h-4 bg-gray-50 rounded w-1/2" />
              </div>

              {/* Center Panel - Medications */}
              <div
                className={`sm:col-span-5 p-3 border-r transition-all duration-500 ${
                  activeStop.id === 'search' || activeStop.id === 'medication'
                    ? 'ring-2 ring-[#0d6b6e] ring-inset bg-[#0d6b6e]/5'
                    : 'opacity-50'
                }`}
              >
                <div className="text-xs font-semibold text-muted-foreground mb-2">Medications</div>
                {/* Search Bar */}
                <div
                  className={`mb-3 transition-all duration-300 ${
                    activeStop.id === 'search' ? 'scale-105' : ''
                  }`}
                >
                  <div className="h-8 bg-gray-100 rounded flex items-center px-2">
                    <Search className="h-3.5 w-3.5 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-400">Search medicine...</span>
                  </div>
                </div>
                {/* Medication Rows */}
                <div className="space-y-2">
                  <div
                    className={`p-2 rounded border transition-all duration-300 ${
                      activeStop.id === 'medication' ? 'border-[#0d6b6e] bg-[#0d6b6e]/5' : 'border-gray-200'
                    }`}
                  >
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1.5" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-gray-100 rounded w-1/4" />
                      <div className="h-5 bg-gray-100 rounded w-1/4" />
                      <div className="h-5 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="p-2 rounded border border-gray-200">
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-1.5" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-gray-100 rounded w-1/4" />
                      <div className="h-5 bg-gray-100 rounded w-1/4" />
                      <div className="h-5 bg-gray-100 rounded w-1/4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Clinical Notes */}
              <div className="sm:col-span-4 p-3 opacity-50">
                <div className="text-xs font-semibold text-muted-foreground mb-2">Clinical Notes</div>
                <div className="space-y-2">
                  <div className="h-16 bg-gray-50 rounded" />
                  <div className="h-16 bg-gray-50 rounded" />
                </div>
              </div>
            </div>

            {/* Bottom Bar - Save */}
            <div
              className={`border-t p-2 flex items-center justify-end transition-all duration-500 ${
                activeStop.id === 'save'
                  ? 'ring-2 ring-[#0d6b6e] ring-inset bg-[#0d6b6e]/5'
                  : 'opacity-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="h-7 w-20 bg-gray-100 rounded" />
                <div className="h-7 w-28 bg-[#0d6b6e] rounded flex items-center justify-center gap-1">
                  <FileDown className="h-3 w-3 text-white" />
                  <span className="text-[10px] text-white font-medium">Save & Create</span>
                </div>
              </div>
            </div>

            {/* Tooltip Overlay */}
            <div
              className={`absolute ${
                activeStop.position === 'left'
                  ? 'left-2 sm:left-4 top-1/4'
                  : activeStop.position === 'right'
                  ? 'right-2 sm:right-4 bottom-16'
                  : 'left-1/2 -translate-x-1/2 top-1/4'
              } z-10 animate-in fade-in-0 slide-in-from-bottom-4 duration-300`}
            >
              <div className="bg-white rounded-xl shadow-xl border p-4 max-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[#0d6b6e] to-[#14919b] flex items-center justify-center text-white">
                    {activeStop.icon}
                  </div>
                  <span className="text-sm font-bold">{activeStop.label}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {activeStop.description}
                </p>
                <Button
                  size="sm"
                  onClick={handleGotIt}
                  className="w-full mt-3 gap-1 text-xs bg-gradient-to-r from-[#0d6b6e] to-[#14919b] hover:from-[#0a5759] hover:to-[#117a84]"
                >
                  {currentStop < TOOLTIP_STOPS.length - 1 ? (
                    <>
                      Got it!
                      <ChevronRight className="h-3 w-3" />
                    </>
                  ) : (
                    'Finish Tour'
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex items-center justify-center gap-2">
            {TOOLTIP_STOPS.map((stop, idx) => (
              <div
                key={stop.id}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStop
                    ? 'w-6 bg-gradient-to-r from-[#0d6b6e] to-[#14919b]'
                    : idx < currentStop
                    ? 'w-2 bg-[#14919b]'
                    : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Back button */}
          <div className="flex items-center justify-start pt-0">
            <Button variant="ghost" onClick={onBack} className="text-muted-foreground">
              Back
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
