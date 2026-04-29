import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Award, Crown, Share2, Check } from 'lucide-react'

interface LeaderEntry {
  rank: number
  name: string
  avatar: string
  hits: number
  streak: number
  picks: number[]
  time: string
}

// Fake leaderboard data - regenerated deterministically each day
function generateLeaderboard(): { daily: LeaderEntry[]; streak: LeaderEntry[] } {
  const today = new Date()
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()

  function rng(s: number) {
    return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
  }

  const names = ['幸运星', '财神到', '六合神', '金手指', '预测王', '数字通', '彩神附体', '稳如狗', '一夜暴富', '逢赌必赢']
  const avatars = ['🌟', '💰', '🎲', '🔥', '👑', '💎', '🏆', '🦊', '🐉', '⚡']

  const daily: LeaderEntry[] = names.map((name, i) => {
    const r = rng(daySeed + i * 137)
    const hits = Math.floor(r() * 5) + 2
    const picks = Array.from({ length: 4 }, () => Math.floor(r() * 49) + 1)
    const hours = Math.floor(r() * 12) + 1
    return {
      rank: i + 1,
      name,
      avatar: avatars[i],
      hits,
      streak: Math.floor(r() * hits),
      picks,
      time: `${hours}小时前`,
    }
  }).sort((a, b) => b.hits - a.hits || b.streak - a.streak).map((e, i) => ({ ...e, rank: i + 1 }))

  const streak: LeaderEntry[] = [...daily]
    .map(e => ({ ...e, streak: e.rank <= 2 ? e.streak + 5 : e.streak + Math.floor(Math.random() * 3) }))
    .sort((a, b) => b.streak - a.streak)
    .map((e, i) => ({ ...e, rank: i + 1 }))

  return { daily, streak }
}

export default function Leaderboard() {
  const [tab, setTab] = useState<'daily' | 'streak'>('daily')
  const [copied, setCopied] = useState(false)
  const { daily, streak } = useMemo(() => generateLeaderboard(), [])
  const entries = tab === 'daily' ? daily : streak

  const handleShare = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.75 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-gold" />
          <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
            排行榜 | Leaderboard
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gold/10 border border-gold/20 text-[8px] sm:text-[9px] text-gold hover:bg-gold/20 transition-colors"
          >
            {copied ? <Check className="w-2.5 h-2.5" /> : <Share2 className="w-2.5 h-2.5" />}
            {copied ? '已复制' : '分享'}
          </button>
          <div className="flex items-center gap-1 bg-bg-tertiary/50 rounded-lg p-0.5">
            <button
              onClick={() => setTab('daily')}
              className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded transition-all ${tab === 'daily' ? 'bg-gold/20 text-gold' : 'text-text-secondary'}`}
            >
              今日命中
            </button>
            <button
              onClick={() => setTab('streak')}
              className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded transition-all ${tab === 'streak' ? 'bg-gold/20 text-gold' : 'text-text-secondary'}`}
            >
              连中榜
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {entries.slice(0, 8).map((entry, i) => (
          <motion.div
            key={entry.name}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 + i * 0.06 }}
            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${
              i === 0 ? 'bg-gold/5 border-gold/20' : i === 1 ? 'bg-gray-400/5 border-gray-400/20' : i === 2 ? 'bg-amber-600/5 border-amber-600/20' : 'bg-bg-tertiary/30 border-border/30'
            }`}
          >
            <div className="flex items-center gap-1.5 w-20 sm:w-24 flex-shrink-0">
              <span className="text-base">{entry.avatar}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-0.5">
                  <span className="text-[10px] sm:text-xs font-bold text-text-primary truncate">{entry.name}</span>
                  {i === 0 && <Crown className="w-3 h-3 text-gold flex-shrink-0" />}
                </div>
                <span className="text-[7px] sm:text-[8px] text-text-secondary">{entry.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-1">
              {entry.picks.map(num => (
                <span
                  key={num}
                  className="inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded text-[8px] sm:text-[9px] font-bold number-mono bg-bg-tertiary/50 border border-border/50 text-text-primary"
                >
                  {String(num).padStart(2, '0')}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 text-right">
              {tab === 'daily' ? (
                <div>
                  <div className="flex items-center gap-0.5">
                    <Award className="w-2.5 h-2.5 text-neon-green" />
                    <span className="text-[10px] sm:text-xs font-bold text-neon-green number-mono">{entry.hits}中</span>
                  </div>
                  {entry.streak > 0 && (
                    <div className="flex items-center gap-0.5 justify-end">
                      <Flame className="w-2 h-2 text-neon-red" />
                      <span className="text-[7px] text-neon-red number-mono">{entry.streak}连中</span>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-0.5 justify-end">
                    <Flame className="w-2.5 h-2.5 text-neon-red" />
                    <span className="text-[10px] sm:text-xs font-bold text-neon-red number-mono">{entry.streak}连中</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-2 p-1.5 rounded-lg bg-gold/5 border border-gold/10">
        <div className="text-[8px] sm:text-[9px] text-gold/60 text-center">
          排行榜实时更新 · 今日已有 {daily.length} 位用户上榜 · 最高连中 {streak[0]?.streak ?? 0} 期
        </div>
      </div>
    </motion.div>
  )
}
