// 波色映射 (Wave Color Mapping) - Standard Hong Kong lottery
export const WAVE_COLORS: Record<number, '红' | '绿' | '蓝'> = {
  1: '红', 2: '红', 3: '蓝', 4: '蓝', 5: '绿', 6: '绿',
  7: '红', 8: '红', 9: '蓝', 10: '蓝', 11: '绿', 12: '红',
  13: '红', 14: '蓝', 15: '蓝', 16: '绿', 17: '绿', 18: '红',
  19: '红', 20: '蓝', 21: '绿', 22: '绿', 23: '红', 24: '红',
  25: '蓝', 26: '蓝', 27: '绿', 28: '绿', 29: '红', 30: '红',
  31: '蓝', 32: '绿', 33: '绿', 34: '红', 35: '红', 36: '蓝',
  37: '蓝', 38: '绿', 39: '绿', 40: '红', 41: '蓝', 42: '蓝',
  43: '绿', 44: '绿', 45: '红', 46: '红', 47: '蓝', 48: '蓝',
  49: '绿',
}

export const WAVE_COLOR_MAP: Record<string, { label: string; css: string; bg: string; border: string }> = {
  '红': { label: '红波', css: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/30' },
  '绿': { label: '绿波', css: 'text-green-400', bg: 'bg-green-500/15', border: 'border-green-500/30' },
  '蓝': { label: '蓝波', css: 'text-blue-400', bg: 'bg-blue-500/15', border: 'border-blue-500/30' },
}

export function getWaveColor(num: number): '红' | '绿' | '蓝' {
  return WAVE_COLORS[num] ?? '蓝'
}

export function isOdd(num: number): boolean { return num % 2 === 1 }
export function isBig(num: number): boolean { return num >= 25 }
export function isSmall(num: number): boolean { return num < 25 }

export interface DrawRecord {
  expect: string       // e.g. "2026045"
  openCode: string     // e.g. "21,42,46,36,04,16,09"
  numbers: number[]    // [21, 42, 46, 36, 4, 16, 9]
  zodiacs: string[]    // ["狗","牛","鸡","羊","兔","兔","狗"]
  waves: string[]      // ["绿","蓝","红","蓝","蓝","绿","蓝"]
  openTime: string     // "2026-04-25 21:32:32"
}

export interface NumberStats {
  number: number
  frequency: number
  wave: '红' | '绿' | '蓝'
  zodiac: string
  emoji: string
  missing: number      // consecutive periods since last appeared
  oddEven: '单' | '双'
  bigSmall: '大' | '小'
}

export interface WaveStats {
  '红': number
  '绿': number
  '蓝': number
}

export function parseDrawRecord(raw: { expect: string; openCode: string; openTime: string; zodiac?: string; wave?: string }): DrawRecord {
  const numbers = raw.openCode.split(',').map(n => parseInt(n, 10))
  const zodiacs = raw.zodiac ? raw.zodiac.split(',').map(z => z.trim()) : numbers.map(n => getZodiacForNumber(n).name)
  const waves = raw.wave ? raw.wave.split(',').map(w => w.trim()) : numbers.map(n => getWaveColor(n))
  return { expect: raw.expect, openCode: raw.openCode, numbers, zodiacs, waves, openTime: raw.openTime }
}

import { zodiacConfig, type ZodiacAnimal } from './zodiacConfig'

export function getZodiacForNumber(num: number): ZodiacAnimal {
  return zodiacConfig.find(a => a.numbers.includes(num)) ?? zodiacConfig[0]
}

// Calculate number frequency from draw history
export function calcNumberFrequency(draws: DrawRecord[]): Map<number, number> {
  const freq = new Map<number, number>()
  for (const draw of draws) {
    for (const n of draw.numbers) {
      freq.set(n, (freq.get(n) || 0) + 1)
    }
  }
  return freq
}

// Hot/Cold ranking: top N hot, top N cold
export function getHotColdNumbers(draws: DrawRecord[], topN = 10): {
  hot: { number: number; count: number; wave: string; zodiac: string; emoji: string }[]
  cold: { number: number; count: number; wave: string; zodiac: string; emoji: string }[]
} {
  const freq = calcNumberFrequency(draws)
  const all = Array.from(freq.entries())
    .map(([number, count]) => {
      const wave = getWaveColor(number)
      const z = getZodiacForNumber(number)
      return { number, count, wave, zodiac: z.name, emoji: z.emoji }
    })
    .sort((a, b) => b.count - a.count || a.number - b.number)
  return {
    hot: all.slice(0, topN),
    cold: all.slice(-topN).reverse(),
  }
}

// Missing values (遗漏值) - how many consecutive periods since last appeared
export function calcMissingValues(draws: DrawRecord[]): NumberStats[] {
  const drawsReversed = [...draws].reverse() // oldest first
  const allNumbers = Array.from({ length: 49 }, (_, i) => i + 1)

  return allNumbers.map(num => {
    const wave = getWaveColor(num)
    const z = getZodiacForNumber(num)
    let frequency = 0
    let missing = drawsReversed.length // worst case: never appeared

    for (let i = 0; i < drawsReversed.length; i++) {
      if (drawsReversed[i].numbers.includes(num)) {
        frequency++
        missing = i // 0-based gap from most recent draw
        break
      }
    }

    return {
      number: num,
      frequency,
      wave,
      zodiac: z.name,
      emoji: z.emoji,
      missing,
      oddEven: isOdd(num) ? '单' : '双',
      bigSmall: isBig(num) ? '大' : '小',
    }
  })
}

// Wave color statistics for recent N draws
export interface WavePeriodStats {
  period: string
  '红': number
  '绿': number
  '蓝': number
}

export function calcWaveStats(draws: DrawRecord[], recentN = 10): { periods: WavePeriodStats[]; total: WaveStats } {
  const recent = draws.slice(-recentN)
  const total: WaveStats = { '红': 0, '绿': 0, '蓝': 0 }
  const periods: WavePeriodStats[] = recent.map(draw => {
    const counts: WaveStats = { '红': 0, '绿': 0, '蓝': 0 }
    for (const w of draw.waves) {
      if (w in counts) counts[w as keyof WaveStats]++
      total[w as keyof WaveStats]++
    }
    return { period: draw.expect, ...counts }
  })
  return { periods, total }
}

// Odd/Even stats for recent N draws
export function calcOddEvenStats(draws: DrawRecord[], recentN = 10) {
  const recent = draws.slice(-recentN)
  return recent.map(draw => {
    let odd = 0, even = 0
    for (const n of draw.numbers) {
      if (isOdd(n)) odd++; else even++
    }
    return { period: draw.expect, odd, even }
  })
}

// Big/Small stats for recent N draws
export function calcBigSmallStats(draws: DrawRecord[], recentN = 10) {
  const recent = draws.slice(-recentN)
  return recent.map(draw => {
    let big = 0, small = 0
    for (const n of draw.numbers) {
      if (isBig(n)) big++; else small++
    }
    return { period: draw.expect, big, small }
  })
}

// Get next draw expect number
export function getNextExpect(currentExpect: string): string {
  const year = parseInt(currentExpect.slice(0, 4))
  const num = parseInt(currentExpect.slice(4))
  const next = num + 1
  return `${year}${String(next).padStart(3, '0')}`
}
