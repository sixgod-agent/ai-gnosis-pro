import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Palette } from 'lucide-react'
import { useLotteryData } from '../hooks/useLotteryData'
import { calcWaveStats, calcOddEvenStats, calcBigSmallStats, WAVE_COLOR_MAP } from '../lib/lotteryData'

export default function ColorAnalysis() {
  const { history } = useLotteryData()
  const waveData = useMemo(() => calcWaveStats(history, 10), [history])
  const oddEvenData = useMemo(() => calcOddEvenStats(history, 10), [history])
  const bigSmallData = useMemo(() => calcBigSmallStats(history, 10), [history])

  const totalWaves = waveData.total
  const totalNumbers = totalWaves['红'] + totalWaves['绿'] + totalWaves['蓝']

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.45 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <Palette className="w-3.5 h-3.5 text-purple-400" />
        <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
          号码属性 | Number Analysis
        </h2>
        <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded bg-purple-400/10 text-purple-400 border border-purple-400/20">
          近10期
        </span>
      </div>

      {/* Wave Color Bars */}
      <div className="mb-3">
        <div className="text-[9px] sm:text-[10px] text-text-secondary mb-1.5">波色分布 | WAVE DISTRIBUTION</div>
        <div className="flex gap-1 h-4 rounded-lg overflow-hidden mb-1.5">
          {(['红', '绿', '蓝'] as const).map(w => {
            const pct = totalNumbers > 0 ? (totalWaves[w] / totalNumbers) * 100 : 0
            return (
              <motion.div
                key={w}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className={`${w === '红' ? 'bg-red-500' : w === '绿' ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center`}
              >
                {pct > 8 && <span className="text-[7px] sm:text-[8px] font-bold text-white number-mono">{totalWaves[w]}</span>}
              </motion.div>
            )
          })}
        </div>
        <div className="flex items-center justify-center gap-3">
          {(['红', '绿', '蓝'] as const).map(w => {
            const style = WAVE_COLOR_MAP[w]
            const pct = totalNumbers > 0 ? ((totalWaves[w] / totalNumbers) * 100).toFixed(0) : '0'
            return (
              <div key={w} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-sm ${style.bg} ${style.border} border`} />
                <span className={`text-[8px] sm:text-[9px] ${style.css}`}>{w}波 {pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Per-period wave breakdown */}
      <div className="mb-3">
        <div className="text-[9px] sm:text-[10px] text-text-secondary mb-1.5">逐期波色 | PERIOD BREAKDOWN</div>
        <div className="space-y-0.5">
          {waveData.periods.slice().reverse().map((p) => (
            <motion.div
              key={p.period}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 + waveData.periods.length * 0.03 }}
              className="flex items-center gap-1"
            >
              <span className="text-[8px] sm:text-[9px] number-mono text-text-secondary w-10 text-right flex-shrink-0">{p.period.slice(-3)}</span>
              <div className="flex-1 flex gap-px h-2.5 rounded overflow-hidden">
                {(['红', '绿', '蓝'] as const).map(w => (
                  <div
                    key={w}
                    className={`${w === '红' ? 'bg-red-500' : w === '绿' ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${(p[w] / 7) * 100}%` }}
                  />
                ))}
              </div>
              <div className="flex gap-1 text-[7px] w-14 flex-shrink-0">
                <span className="text-red-400">{p.红}</span>
                <span className="text-green-400">{p.绿}</span>
                <span className="text-blue-400">{p.蓝}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Odd/Even and Big/Small */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-bg-tertiary/30 rounded-lg p-2">
          <div className="text-[9px] sm:text-[10px] text-text-secondary mb-1.5">单双 | ODD/EVEN</div>
          {oddEvenData.slice().reverse().slice(0, 5).map((p) => (
            <div key={p.period} className="flex items-center gap-1 mb-0.5">
              <span className="text-[7px] sm:text-[8px] number-mono text-text-secondary w-8">{p.period.slice(-3)}</span>
              <div className="flex-1 flex gap-px h-1.5 rounded overflow-hidden">
                <div className="bg-neon-green" style={{ width: `${(p.odd / 7) * 100}%` }} />
                <div className="bg-neon-red" style={{ width: `${(p.even / 7) * 100}%` }} />
              </div>
              <span className="text-[7px]"><span className="text-neon-green">{p.odd}</span>:<span className="text-neon-red">{p.even}</span></span>
            </div>
          ))}
        </div>
        <div className="bg-bg-tertiary/30 rounded-lg p-2">
          <div className="text-[9px] sm:text-[10px] text-text-secondary mb-1.5">大小 | BIG/SMALL</div>
          {bigSmallData.slice().reverse().slice(0, 5).map((p) => (
            <div key={p.period} className="flex items-center gap-1 mb-0.5">
              <span className="text-[7px] sm:text-[8px] number-mono text-text-secondary w-8">{p.period.slice(-3)}</span>
              <div className="flex-1 flex gap-px h-1.5 rounded overflow-hidden">
                <div className="bg-gold" style={{ width: `${(p.big / 7) * 100}%` }} />
                <div className="bg-blue-400" style={{ width: `${(p.small / 7) * 100}%` }} />
              </div>
              <span className="text-[7px]"><span className="text-gold">{p.big}</span>:<span className="text-blue-400">{p.small}</span></span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
