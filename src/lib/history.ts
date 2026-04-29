import { zodiacConfig, getAnimalNumbers, type ZodiacAnimal } from './zodiacConfig'

interface HistoryRecord {
  period: string
  openNumber: number
  openAnimal: string
  aiPrediction: string
  match: boolean
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function findAnimalByNumber(num: number): ZodiacAnimal | undefined {
  return zodiacConfig.find(a => a.numbers.includes(num))
}

export function generateHistory(assignedAnimals: string[]): HistoryRecord[] {
  const records: HistoryRecord[] = []
  const rng = seededRandom(20260401)
  const baseDate = new Date('2026-04-28')

  for (let i = 0; i < 20; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)

    const period = `2026${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`

    // ~85% match rate: first 17 match, last 3 don't
    const shouldMatch = i < 17

    let openNumber: number
    let aiPrediction: string

    if (shouldMatch) {
      // Pick a number from assigned animals
      const animalName = assignedAnimals[Math.floor(rng() * assignedAnimals.length)]
      const numbers = getAnimalNumbers(animalName)
      openNumber = numbers[Math.floor(rng() * numbers.length)]
      aiPrediction = animalName
    } else {
      // Pick from non-assigned animals
      const nonAssigned = zodiacConfig.filter(a => !assignedAnimals.includes(a.name))
      const animal = nonAssigned[Math.floor(rng() * nonAssigned.length)]
      const numbers = getAnimalNumbers(animal.name)
      openNumber = numbers[Math.floor(rng() * numbers.length)]
      aiPrediction = assignedAnimals[Math.floor(rng() * assignedAnimals.length)]
    }

    const openAnimalData = findAnimalByNumber(openNumber)

    records.push({
      period,
      openNumber,
      openAnimal: openAnimalData?.name ?? '?',
      aiPrediction,
      match: shouldMatch,
    })
  }

  return records
}
