import { zodiacConfig } from './zodiacConfig'

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

export interface TrendRecord {
  period: string
  number: number
  animal: string
  emoji: string
}

export function generateTrendData(): TrendRecord[] {
  const rng = seededRandom(20260410)
  const records: TrendRecord[] = []
  const baseDate = new Date('2026-04-28')

  for (let i = 0; i < 20; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() - i)
    const period = `2026${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
    const num = Math.floor(rng() * 49) + 1
    const animal = zodiacConfig.find(a => a.numbers.includes(num))
    records.push({
      period,
      number: num,
      animal: animal?.name ?? '?',
      emoji: animal?.emoji ?? '?',
    })
  }

  return records.reverse()
}

export interface NumberFrequency {
  number: number
  count: number
  animal: string
  emoji: string
}

export function getNumberFrequencies(trend: TrendRecord[]): NumberFrequency[] {
  const freqMap = new Map<number, number>()
  for (const r of trend) {
    freqMap.set(r.number, (freqMap.get(r.number) || 0) + 1)
  }
  return Array.from(freqMap.entries())
    .map(([number, count]) => {
      const animal = zodiacConfig.find(a => a.numbers.includes(number))
      return { number, count, animal: animal?.name ?? '?', emoji: animal?.emoji ?? '?' }
    })
    .sort((a, b) => b.count - a.count || a.number - b.number)
}
