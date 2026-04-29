import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Star, Zap } from 'lucide-react'
import { useLotteryData } from '../hooks/useLotteryData'
import { getHotColdNumbers, calcMissingValues, getWaveColor, getZodiacForNumber, WAVE_COLOR_MAP } from '../lib/lotteryData'
import type { DrawRecord } from '../lib/lotteryData'

function generateTodayPicks(history: DrawRecord[]) {
  const hotCold = getHotColdNumbers(history, 10)
  const missing = calcMissingValues(history)

  // 5 picks: 3 hot + 1 missing + 1 balanced
  const topHot = hotCold.hot.slice(0, 3)
  const topMissing = [...missing].sort((a, b) => b.missing - a.missing).slice(0, 1)

  // 1 balanced pick - moderate frequency, not too hot/cold
  const balanced = [...missing].sort((a, b) => {
    const aScore = Math.abs(a.missing - 3)
    const bScore = Math.abs(b.missing - 3)
    return aScore - bScore
  }).slice(0, 1)

  return [...topHot, ...topMissing, ...balanced]
    .filter((v, i, arr) => arr.findIndex(a => a.number === v.number) === i)
    .slice(0, 5)
}

function generate10Picks(history: DrawRecord[]) {
  const hotCold = getHotColdNumbers(history, 10)
  const missing = calcMissingValues(history)

  const picks = [
    ...hotCold.hot.slice(0, 5),
    ...hotCold.cold.slice(0, 2),
    ...[...missing].sort((a, b) => b.missing - a.missing).slice(0, 3),
  ]

  // Deduplicate
  const seen = new Set<number>()
  return picks.filter(p => {
    if (seen.has(p.number)) return false
    seen.add(p.number)
    return true
  }).slice(0, 10)
}

export default function TodayPick() {
  const { history } = useLotteryData()
  const five = useMemo(() => generateTodayPicks(history), [history])
  const ten = useMemo(() => generate10Picks(history), [history])

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.65 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <Star className="w-3.5 h-3.5 text-gold" />
        <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
          今日精选 | Today's Picks
        </h2>
      </div>

      {/* 5 Code */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-1.5">
          <Zap className="w-2.5 h-2.5 text-gold" />
          <span className="text-[9px] sm:text-[10px] text-gold font-medium">精选 5 码 | TOP 5</span>
        </div>
        <div className="flex gap-2">
          {five.map((item, i) => {
            const wave = getWaveColor(item.number)
            const animal = getZodiacForNumber(item.number)
            const style = WAVE_COLOR_MAP[wave]
            return (
              <motion.div
                key={item.number}
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
                className={`flex-1 rounded-xl p-2 sm:p-3 text-center border glow-gold ${style?.bg} ${style?.border}`}
              >
                <div className={`text-base sm:text-xl font-bold number-mono ${style?.css}`}>
                  {String(item.number).padStart(2, '0')}
                </div>
                <div className="text-[8px] sm:text-[9px] text-text-secondary">{animal.emoji} {animal.name}</div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* 10 Code */}
      <div>
        <div className="text-[9px] sm:text-[10px] text-text-secondary mb-1.5">精选 10 码 | EXTENDED 10</div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-1.5">
          {ten.map((item, i) => {
            const wave = getWaveColor(item.number)
            const animal = getZodiacForNumber(item.number)
            const style = WAVE_COLOR_MAP[wave]
            return (
              <motion.div
                key={item.number}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 + i * 0.05, type: 'spring' }}
                className={`rounded-lg p-1 sm:p-1.5 text-center border ${style?.bg} ${style?.border}`}
              >
                <div className={`text-[10px] sm:text-xs font-bold number-mono ${style?.css}`}>
                  {String(item.number).padStart(2, '0')}
                </div>
                <div className="text-[7px] text-text-secondary">{animal.emoji}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
