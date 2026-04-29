import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, ChevronDown, Calendar } from 'lucide-react'
import { useLotteryData } from '../hooks/useLotteryData'
import { WAVE_COLOR_MAP } from '../lib/lotteryData'

export default function HistoryTable() {
  const { latestDraw, history } = useLotteryData()
  const [showAll, setShowAll] = useState(false)
  const [filterYear, setFilterYear] = useState<string>('all')

  const allDraws = [latestDraw, ...history]
  const filteredDraws = filterYear === 'all'
    ? allDraws
    : allDraws.filter(d => d.expect.startsWith(filterYear))

  const years = Array.from(new Set(allDraws.map(d => d.expect.slice(0, 4)))).sort().reverse()
  const displayDraws = showAll ? filteredDraws : filteredDraws.slice(0, 15)

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-gold" />
          <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
            历史开奖 | Draw History
          </h2>
          <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
            {filteredDraws.length}期
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-text-secondary" />
          <select
            value={filterYear}
            onChange={e => { setFilterYear(e.target.value); setShowAll(false) }}
            className="bg-bg-tertiary/50 border border-border/50 rounded px-1.5 py-0.5 text-[9px] sm:text-[10px] text-text-primary outline-none cursor-pointer"
          >
            <option value="all">全部年份</option>
            {years.map(y => <option key={y} value={y}>{y}年</option>)}
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-text-secondary font-medium">期号</th>
              <th className="text-center py-2 px-1 text-text-secondary font-medium">开奖号码</th>
              <th className="text-center py-2 px-2 text-text-secondary font-medium">波色</th>
              <th className="text-center py-2 px-2 text-text-secondary font-medium">生肖</th>
              <th className="text-right py-2 px-2 text-text-secondary font-medium">开奖时间</th>
            </tr>
          </thead>
          <tbody>
            {displayDraws.map((draw, i) => (
              <motion.tr
                key={draw.expect}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(0.5 + i * 0.02, 1.5) }}
                className={`border-b border-border/50 hover:bg-bg-tertiary/30 transition-colors ${i === 0 ? 'bg-gold/5' : ''}`}
              >
                <td className="py-2 px-2 number-mono text-text-secondary">{draw.expect}</td>
                <td className="py-2 px-1">
                  <div className="flex items-center justify-center gap-1">
                    {draw.numbers.map((num, j) => (
                      <span
                        key={j}
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-bold number-mono text-[11px] ${WAVE_COLOR_MAP[draw.waves[j]]?.bg ?? ''} ${WAVE_COLOR_MAP[draw.waves[j]]?.border ?? 'border-border/50'} ${WAVE_COLOR_MAP[draw.waves[j]]?.css ?? 'text-text-primary'}`}
                      >
                        {String(num).padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {draw.waves.map((w, j) => (
                      <span key={j} className={`text-[9px] font-medium ${WAVE_COLOR_MAP[w]?.css ?? 'text-text-secondary'}`}>
                        {w}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-2 text-center">
                  <div className="flex items-center justify-center gap-0.5 text-[9px]">
                    {draw.zodiacs.map((z, j) => (
                      <span key={j} className="text-text-secondary">{z}</span>
                    ))}
                  </div>
                </td>
                <td className="py-2 px-2 text-right number-mono text-[10px] text-text-secondary/60">
                  {draw.openTime.split(' ')[0].slice(5)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card layout */}
      <div className="sm:hidden space-y-1.5">
        {displayDraws.map((draw, i) => (
          <motion.div
            key={draw.expect}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(0.5 + i * 0.02, 1.5) }}
            className={`rounded-lg p-2.5 ${i === 0 ? 'bg-gold/5 border border-gold/20' : 'bg-bg-tertiary/30 border border-border/30'}`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] number-mono text-text-secondary font-medium">{draw.expect}</span>
              <span className="text-[9px] number-mono text-text-secondary/60">{draw.openTime.split(' ')[0].slice(5)}</span>
            </div>
            <div className="flex items-center gap-1">
              {draw.numbers.map((num, j) => (
                <span
                  key={j}
                  className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-bold number-mono text-[10px] ${WAVE_COLOR_MAP[draw.waves[j]]?.bg ?? ''} ${WAVE_COLOR_MAP[draw.waves[j]]?.border ?? 'border-border/50'} ${WAVE_COLOR_MAP[draw.waves[j]]?.css ?? 'text-text-primary'}`}
                >
                  {String(num).padStart(2, '0')}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-1 text-[8px] text-text-secondary">
                {draw.waves.map((w, j) => (
                  <span key={j} className={WAVE_COLOR_MAP[w]?.css}>{w}</span>
                ))}
              </div>
              <div className="flex items-center gap-0.5 text-[8px] text-text-secondary">
                {draw.zodiacs.map((z, j) => <span key={j}>{z}</span>)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDraws.length > 15 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full flex items-center justify-center gap-1 py-2 mt-2 text-[10px] text-text-secondary hover:text-text-primary transition-colors"
        >
          <ChevronDown className={`w-3 h-3 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          {showAll ? '收起' : `展开全部 ${filteredDraws.length} 期`}
        </button>
      )}
    </motion.div>
  )
}
