import { predictGroups, type GroupKey } from './zodiacConfig'

interface UserSession {
  analyticId: string
  group: GroupKey
  animals: string[]
  assignedAt: number
  expireAt: number
}

const STORAGE_KEY = 'ai_gnosis_session'
const LOCK_DURATION = 24 * 60 * 60 * 1000 // 24 hours

function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segments = [8, 4, 4, 4, 12]
  return segments.map(len =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  ).join('-')
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function getSession(): UserSession {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      const session: UserSession = JSON.parse(raw)
      if (Date.now() < session.expireAt) {
        return session
      }
    } catch { /* expired or corrupt */ }
  }

  const groupKeys = Object.keys(predictGroups) as GroupKey[]
  const group = pickRandom(groupKeys)
  const animals = predictGroups[group]
  const now = Date.now()

  const session: UserSession = {
    analyticId: generateId(),
    group,
    animals: [...animals],
    assignedAt: now,
    expireAt: now + LOCK_DURATION,
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function getRemainingTime(): string {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return '24:00:00'
  try {
    const session: UserSession = JSON.parse(raw)
    const diff = Math.max(0, session.expireAt - Date.now())
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  } catch {
    return '24:00:00'
  }
}
