import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Flame, BarChart3 } from 'lucide-react'
import { useLotteryData } from '../hooks/useLotteryData'
import { calcNumberFrequency } from '../lib/lotteryData'

export default function TrendChart() {
  const [tab, setTab] = useState<'heatmap' | 'line'>('heatmap')
  const { history } = useLotteryData()

  const frequencies = useMemo(() => {
    const freq = calcNumberFrequency(history)
    return Array.from(freq.entries())
      .map(([number, count]) => ({ number, count }))
      .sort((a, b) => b.count - a.count || a.number - b.number)
  }, [history])

  const maxFreq = Math.max(...frequencies.map(f => f.count), 1)
  const recentDraws = history.slice(-20)

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-gold" />
          <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
            号码走势 | Number Trend
          </h2>
        </div>
        <div className="flex items-center gap-1 bg-bg-tertiary/50 rounded-lg p-0.5">
          <button
            onClick={() => setTab('heatmap')}
            className={`text-[9px] sm:text-[10px] px-2 py-1 rounded-md transition-all ${
              tab === 'heatmap' ? 'bg-gold/20 text-gold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            号码频率
          </button>
          <button
            onClick={() => setTab('line')}
            className={`text-[9px] sm:text-[10px] px-2 py-1 rounded-md transition-all ${
              tab === 'line' ? 'bg-gold/20 text-gold' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            近期开奖
          </button>
        </div>
      </div>

      {tab === 'heatmap' ? (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Flame className="w-3 h-3 text-neon-red" />
            <span className="text-[9px] sm:text-[10px] text-text-secondary">
              全部 {frequencies.length} 个号码出现频率 | NUMBER FREQUENCY
            </span>
          </div>
          <div className="grid grid-cols-7 sm:grid-cols-7 gap-1">
            {frequencies.map((item, i) => {
              const intensity = item.count / maxFreq
              const isHot = item.count >= maxFreq * 0.7
              return (
                <motion.div
                  key={item.number}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.55 + i * 0.015, type: 'spring', stiffness: 200 }}
                  className="rounded-md p-1 sm:p-1.5 text-center"
                  style={{
                    backgroundColor: isHot
                      ? `rgba(239, 68, 68, ${0.1 + intensity * 0.3})`
                      : `rgba(2, 241, 166, ${0.03 + intensity * 0.12})`,
                    border: `1px solid ${isHot ? `rgba(239, 68, 68, ${0.2 + intensity * 0.4})` : `rgba(43, 49, 57, 0.5)`}`,
                  }}
                >
                  <div className={`text-[9px] sm:text-[11px] font-bold number-mono ${
                    isHot ? 'text-neon-red' : 'text-text-primary/80'
                  }`}>
                    {String(item.number).padStart(2, '0')}
                  </div>
                  <div className={`text-[7px] sm:text-[8px] font-medium number-mono ${
                    isHot ? 'text-neon-red/70' : 'text-text-secondary/60'
                  }`}>
                    {item.count}次
                  </div>
                </motion.div>
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-neon-red/40 border border-neon-red/50" />
              <span className="text-[8px] sm:text-[9px] text-text-secondary">高频</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-sm bg-neon-green/20 border border-neon-green/30" />
              <span className="text-[8px] sm:text-[9px] text-text-secondary">低频</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BarChart3 className="w-3 h-3 text-neon-green" />
            <span className="text-[9px] sm:text-[10px] text-text-secondary">
              近 {recentDraws.length} 期开奖号码走势 | RECENT DRAWS
            </span>
          </div>
          <div className="overflow-x-auto">
            <div className="flex items-end gap-0.5 sm:gap-1 min-w-max">
              {recentDraws.map((draw, i) => (
                <motion.div
                  key={draw.expect}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  transition={{ delay: 0.55 + i * 0.02, duration: 0.3 }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="text-[6px] sm:text-[7px] number-mono text-text-secondary">
                    {draw.numbers.slice(0, 3).map(n => String(n).padStart(2, '0')).join(' ')}
                  </span>
                  <div className="w-3 sm:w-4 rounded-t-sm bg-gradient-to-t from-neon-green/40 to-neon-green min-h-[4px]" style={{ height: `${(draw.numbers[6] / 49) * 60}px` }} />
                  <span className="text-[6px] sm:text-[7px] text-text-secondary/50 number-mono">
                    {draw.expect.slice(-3)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
