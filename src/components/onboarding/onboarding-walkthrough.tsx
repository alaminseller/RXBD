'use client'

import { useState } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { ProfileStep } from './profile-step'
import { BrandingStep } from './branding-step'
import { TutorialStep } from './tutorial-step'
import { UserCheck, Palette, GraduationCap } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Profile', icon: UserCheck },
  { id: 2, label: 'Branding', icon: Palette },
  { id: 3, label: 'Tutorial', icon: GraduationCap },
]

interface OnboardingWalkthroughProps {
  open: boolean
  onComplete: () => void
}

export function OnboardingWalkthrough({ open, onComplete }: OnboardingWalkthroughProps) {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)
  const [currentStep, setCurrentStep] = useState(1)

  const progressValue = (currentStep / 3) * 100

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = () => {
    completeOnboarding()
    onComplete()
  }

  const handleSkip = () => {
    completeOnboarding()
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleSkip() }}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-0"
      >
        {/* Progress Bar */}
        <div className="sticky top-0 z-10 bg-background border-b">
          <div className="px-6 pt-5 pb-3">
            {/* Step indicators */}
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((step, idx) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted = currentStep > step.id

                return (
                  <div key={step.id} className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-br from-[#0d6b6e] to-[#14919b] text-white shadow-md'
                            : isCompleted
                            ? 'bg-[#14919b] text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium hidden sm:inline transition-colors ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="flex-1 mx-2">
                        <div
                          className={`h-0.5 rounded-full transition-colors duration-300 ${
                            currentStep > step.id ? 'bg-[#14919b]' : 'bg-muted'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Progress Bar */}
            <Progress
              value={progressValue}
              className="h-1.5"
            />

            {/* Step counter */}
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">
                Step {currentStep} of 3
              </p>
              {currentStep < 3 && (
                <button
                  onClick={handleSkip}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-5">
          {currentStep === 1 && <ProfileStep onNext={handleNext} />}
          {currentStep === 2 && <BrandingStep onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <TutorialStep onComplete={handleComplete} onBack={handleBack} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
