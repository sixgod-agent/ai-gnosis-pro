interface UserSession {
  analyticId: string
  createdAt: number
}

const STORAGE_KEY = 'ai_gnosis_session'

function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const segments = [8, 4, 4, 4, 12]
  return segments.map(len =>
    Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  ).join('-')
}

export function getSession(): UserSession {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw) {
    try {
      return JSON.parse(raw)
    } catch { /* corrupt */ }
  }

  const session: UserSession = {
    analyticId: generateId(),
    createdAt: Date.now(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}
