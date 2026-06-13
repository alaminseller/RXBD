import Fuse, { type IFuseOptions } from 'fuse.js'
import type { Medicine } from '@/types'

// Fuse.js configuration for medicine search
const fuseOptions: IFuseOptions<Medicine> = {
  keys: [
    { name: 'brand', weight: 0.4 },
    { name: 'generic', weight: 0.35 },
    { name: 'tags', weight: 0.15 },
    { name: 'category', weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
  minMatchCharLength: 2,
  shouldSort: true,
}

let fuseInstance: Fuse<Medicine> | null = null
let medicineData: Medicine[] = []

export async function loadMedicineData(): Promise<Medicine[]> {
  if (medicineData.length > 0) return medicineData
  
  const response = await fetch('/data/medicines.json')
  medicineData = await response.json()
  return medicineData
}

export async function getFuseInstance(): Promise<Fuse<Medicine>> {
  if (fuseInstance) return fuseInstance
  
  const data = await loadMedicineData()
  fuseInstance = new Fuse(data, fuseOptions)
  return fuseInstance
}

export async function searchMedicines(query: string, limit: number = 10): Promise<Medicine[]> {
  if (!query || query.length < 2) return []
  
  const fuse = await getFuseInstance()
  const results = fuse.search(query, { limit })
  return results.map(result => result.item)
}

export async function getMedicineById(id: string): Promise<Medicine | undefined> {
  const data = await loadMedicineData()
  return data.find(med => med.id === id)
}

export async function getMedicinesByCategory(category: string): Promise<Medicine[]> {
  const data = await loadMedicineData()
  return data.filter(med => med.category === category)
}

export async function getCategories(): Promise<string[]> {
  const data = await loadMedicineData()
  const categories = [...new Set(data.map(med => med.category))]
  return categories.sort()
}
