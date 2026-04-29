export interface ZodiacAnimal {
  name: string
  emoji: string
  numbers: number[]
}

export const zodiacConfig: ZodiacAnimal[] = [
  { name: '马', emoji: '🐴', numbers: [1, 13, 25, 37, 49] },
  { name: '蛇', emoji: '🐍', numbers: [2, 14, 26, 38] },
  { name: '龙', emoji: '🐲', numbers: [3, 15, 27, 39] },
  { name: '兔', emoji: '🐰', numbers: [4, 16, 28, 40] },
  { name: '虎', emoji: '🐯', numbers: [5, 17, 29, 41] },
  { name: '牛', emoji: '🐂', numbers: [6, 18, 30, 42] },
  { name: '鼠', emoji: '🐀', numbers: [7, 19, 31, 43] },
  { name: '猪', emoji: '🐷', numbers: [8, 20, 32, 44] },
  { name: '狗', emoji: '🐶', numbers: [9, 21, 33, 45] },
  { name: '鸡', emoji: '🐔', numbers: [10, 22, 34, 46] },
  { name: '猴', emoji: '🐒', numbers: [11, 23, 35, 47] },
  { name: '羊', emoji: '🐑', numbers: [12, 24, 36, 48] },
]

export const predictGroups = {
  A: ['马', '羊', '鼠', '兔'],
  B: ['蛇', '猴', '牛', '猪'],
  C: ['龙', '鸡', '虎', '狗'],
} as const

export type GroupKey = keyof typeof predictGroups

export function getAnimalNumbers(name: string): number[] {
  return zodiacConfig.find(a => a.name === name)?.numbers ?? []
}

export function getAllNumbers(): number[] {
  return zodiacConfig.flatMap(a => a.numbers)
}
