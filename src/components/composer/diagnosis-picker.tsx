'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Static dataset of common Bangladesh-relevant ICD-10 codes.
 * Covers common conditions seen in Bangladeshi clinical practice.
 */
const ICD10_CODES = [
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'E10.9', description: 'Type 1 diabetes mellitus without complications' },
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'I11.9', description: 'Hypertensive heart disease without heart failure' },
  { code: 'J45.9', description: 'Asthma, unspecified' },
  { code: 'J44.1', description: 'Chronic obstructive pulmonary disease with acute exacerbation' },
  { code: 'J18.9', description: 'Pneumonia, unspecified organism' },
  { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified' },
  { code: 'J20.9', description: 'Acute bronchitis, unspecified' },
  { code: 'N39.0', description: 'Urinary tract infection, site not specified' },
  { code: 'K29.7', description: 'Gastritis, unspecified' },
  { code: 'K21.0', description: 'Gastro-esophageal reflux disease with esophagitis' },
  { code: 'K25.9', description: 'Gastric ulcer, unspecified as acute or chronic, without hemorrhage or perforation' },
  { code: 'K35.80', description: 'Unspecified acute appendicitis' },
  { code: 'A09', description: 'Infectious gastroenteritis and colitis, unspecified' },
  { code: 'A00.0', description: 'Cholera due to Vibrio cholerae 01, biovar cholerae' },
  { code: 'A01.0', description: 'Typhoid fever' },
  { code: 'B54', description: 'Unspecified malaria' },
  { code: 'B50.0', description: 'Plasmodium falciparum malaria with cerebral complications' },
  { code: 'A06.0', description: 'Amebic dysentery' },
  { code: 'M54.5', description: 'Low back pain' },
  { code: 'M79.3', description: 'Panniculitis, unspecified' },
  { code: 'M54.2', description: 'Cervicalgia (neck pain)' },
  { code: 'G43.9', description: 'Migraine, unspecified' },
  { code: 'R51', description: 'Headache' },
  { code: 'R05', description: 'Cough' },
  { code: 'R50.9', description: 'Fever, unspecified' },
  { code: 'R06.02', description: 'Shortness of breath' },
  { code: 'N20.0', description: 'Calculus of kidney' },
  { code: 'N40.0', description: 'Benign prostatic hyperplasia without lower urinary tract symptoms' },
  { code: 'N41.1', description: 'Chronic prostatitis' },
  { code: 'L23.9', description: 'Allergic contact dermatitis, unspecified cause' },
  { code: 'L30.9', description: 'Dermatitis, unspecified' },
  { code: 'L20.9', description: 'Atopic dermatitis, unspecified' },
  { code: 'B37.0', description: 'Candidal stomatitis (oral thrush)' },
  { code: 'B35.1', description: 'Tinea unguium (fungal nail infection)' },
  { code: 'H10.9', description: 'Conjunctivitis, unspecified' },
  { code: 'H40.1', description: 'Primary open-angle glaucoma' },
  { code: 'H52.0', description: 'Hypermetropia' },
  { code: 'F32.9', description: 'Major depressive disorder, single episode, unspecified' },
  { code: 'F41.1', description: 'Generalized anxiety disorder' },
  { code: 'F51.0', description: 'Insomnia' },
  { code: 'I50.9', description: 'Heart failure, unspecified' },
  { code: 'I25.10', description: 'Atherosclerotic heart disease of native coronary artery without angina pectoris' },
  { code: 'I63.9', description: 'Cerebral infarction, unspecified' },
  { code: 'G40.9', description: 'Epilepsy, unspecified' },
  { code: 'G20', description: "Parkinson's disease" },
  { code: 'D50.9', description: 'Iron deficiency anemia, unspecified' },
  { code: 'D64.9', description: 'Anemia, unspecified' },
  { code: 'C34.90', description: 'Malignant neoplasm of unspecified part of unspecified bronchus or lung' },
  { code: 'C18.9', description: 'Malignant neoplasm of colon, unspecified' },
  { code: 'C50.9', description: 'Malignant neoplasm of breast, unspecified' },
  { code: 'C61', description: 'Malignant neoplasm of prostate' },
  { code: 'E03.9', description: 'Hypothyroidism, unspecified' },
  { code: 'E05.00', description: 'Thyrotoxicosis with diffuse goiter without thyrotoxic crisis or storm' },
  { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  { code: 'E66.01', description: 'Morbid (severe) obesity due to excess calories' },
  { code: 'K80.20', description: 'Calculus of gallbladder without cholecystitis without obstruction' },
  { code: 'K74.0', description: 'Hepatic fibrosis' },
  { code: 'K70.0', description: 'Alcoholic fatty liver' },
  { code: 'K75.0', description: 'Liver abscess' },
  { code: 'R42', description: 'Dizziness and giddiness' },
  { code: 'R00.2', description: 'Palpitations' },
  { code: 'Z86.79', description: 'Personal history of other diseases of the circulatory system' },
  { code: 'Z87.891', description: 'Personal history of nicotine dependence' },
  { code: 'S72.009A', description: 'Fracture of unspecified part of neck of right femur' },
  { code: 'S82.899A', description: 'Other fracture of unspecified lower leg' },
  { code: 'S06.0X0A', description: 'Concussion without loss of consciousness' },
]

interface ICD10Code {
  code: string
  description: string
}

interface DiagnosisPickerProps {
  /** Current ICD-10 code value */
  value: string
  /** Callback when code is selected or changed */
  onCodeChange: (code: string) => void
  /** Callback when a code is selected from the dropdown (can pre-fill diagnosis) */
  onCodeSelect?: (code: string, description: string) => void
  /** Optional className */
  className?: string
}

/**
 * Fuzzy search over ICD-10 codes.
 * Matches against both code and description fields.
 */
function fuzzySearch(query: string): ICD10Code[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const terms = q.split(/\s+/)

  return ICD10_CODES.filter((item) => {
    const combined = `${item.code} ${item.description}`.toLowerCase()
    return terms.every((term) => combined.includes(term))
  }).slice(0, 15)
}

/**
 * ICD-10 Diagnosis Code Lookup Component.
 *
 * Provides:
 * - Input field for ICD-10 code with autocomplete
 * - Fuzzy search over static dataset of Bangladesh-relevant codes
 * - When a code is selected, it populates both the code and optionally pre-fills diagnosis
 */
export function DiagnosisPicker({
  value,
  onCodeChange,
  onCodeSelect,
  className,
}: DiagnosisPickerProps) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<ICD10Code[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync external value changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = useCallback(
    (inputValue: string) => {
      setQuery(inputValue)
      onCodeChange(inputValue)

      if (inputValue.trim().length >= 1) {
        const searchResults = fuzzySearch(inputValue)
        setResults(searchResults)
      } else {
        setResults([])
      }
    },
    [onCodeChange]
  )

  const handleSelectCode = useCallback(
    (item: ICD10Code) => {
      setQuery(item.code)
      onCodeChange(item.code)
      onCodeSelect?.(item.code, item.description)
      setIsFocused(false)
      setResults([])
    },
    [onCodeChange, onCodeSelect]
  )

  const handleClear = useCallback(() => {
    setQuery('')
    onCodeChange('')
    setResults([])
  }, [onCodeChange])

  const showDropdown = isFocused && results.length > 0

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="ICD-10 code (e.g. E11.9)"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true)
            if (query.trim().length >= 1) {
              const searchResults = fuzzySearch(query)
              setResults(searchResults)
            }
          }}
          className="pl-8 pr-7 h-8 text-xs font-mono"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <ScrollArea className="max-h-56">
            {results.map((item) => (
              <button
                key={item.code}
                onClick={() => handleSelectCode(item)}
                className="w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-accent transition-colors border-b border-border/50 last:border-0"
              >
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono px-1.5 py-0 h-5 mt-0.5 bg-[#0d6b6e]/10 text-[#14919b] border-[#14919b]/30 flex-shrink-0"
                >
                  {item.code}
                </Badge>
                <span className="text-xs text-foreground leading-relaxed">
                  {item.description}
                </span>
              </button>
            ))}
          </ScrollArea>
        </div>
      )}

      {isFocused && !showDropdown && query.trim().length >= 1 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border border-border rounded-lg shadow-lg p-3 text-center text-xs text-muted-foreground">
          No matching ICD-10 codes found
        </div>
      )}
    </div>
  )
}
