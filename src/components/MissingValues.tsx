import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'
import { useLotteryData } from '../hooks/useLotteryData'
import { calcMissingValues, WAVE_COLOR_MAP } from '../lib/lotteryData'

export default function MissingValues() {
  const { history } = useLotteryData()
  const [sortBy, setSortBy] = useState<'missing' | 'frequency' | 'number'>('missing')

  const stats = useMemo(() => calcMissingValues(history), [history])

  const sorted = useMemo(() => {
    const arr = [...stats]
    switch (sortBy) {
      case 'missing': return arr.sort((a, b) => b.missing - a.missing || a.number - b.number)
      case 'frequency': return arr.sort((a, b) => b.frequency - a.frequency || a.number - b.number)
      case 'number': return arr.sort((a, b) => a.number - b.number)
    }
  }, [stats, sortBy])

  const maxMissing = Math.max(...stats.map(s => s.missing), 1)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.55 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Timer className="w-3.5 h-3.5 text-amber-400" />
          <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
            遗漏值 | Missing Values
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-bg-tertiary/50 rounded-lg p-0.5">
          <button
            onClick={() => setSortBy('missing')}
            className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded transition-all ${sortBy === 'missing' ? 'bg-amber-400/20 text-amber-400' : 'text-text-secondary'}`}
          >
            遗漏
          </button>
          <button
            onClick={() => setSortBy('frequency')}
            className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded transition-all ${sortBy === 'frequency' ? 'bg-amber-400/20 text-amber-400' : 'text-text-secondary'}`}
          >
            频率
          </button>
          <button
            onClick={() => setSortBy('number')}
            className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded transition-all ${sortBy === 'number' ? 'bg-amber-400/20 text-amber-400' : 'text-text-secondary'}`}
          >
            号码
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 sm:grid-cols-7 gap-0.5">
        {sorted.map((s, i) => {
          const isLongMissing = s.missing >= Math.floor(maxMissing * 0.6)
          return (
            <motion.div
              key={s.number}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6 + i * 0.01, type: 'spring', stiffness: 250 }}
              className={`rounded-md p-0.5 sm:p-1 text-center border ${
                isLongMissing
                  ? 'bg-amber-400/10 border-amber-400/30'
                  : s.missing === 0
                    ? 'bg-neon-green/10 border-neon-green/30'
                    : 'bg-bg-tertiary/30 border-border/30'
              }`}
            >
              <div className={`text-[8px] sm:text-[10px] font-bold number-mono ${WAVE_COLOR_MAP[s.wave]?.css ?? 'text-text-primary'}`}>
                {String(s.number).padStart(2, '0')}
              </div>
              <div className="text-[6px] sm:text-[7px] text-text-secondary">{s.zodiac}</div>
              <div className={`text-[7px] sm:text-[9px] font-bold number-mono ${
                isLongMissing ? 'text-amber-400' : s.missing === 0 ? 'text-neon-green' : 'text-text-secondary/70'
              }`}>
                {s.missing === 0 ? '-' : s.missing}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-amber-400/30 border border-amber-400/40" />
          <span className="text-[7px] sm:text-[8px] text-text-secondary">严重遗漏</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-neon-green/30 border border-neon-green/40" />
          <span className="text-[7px] sm:text-[8px] text-text-secondary">刚出现</span>
        </div>
      </div>
    </motion.div>
  )
}
