import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Flame, Snowflake, TrendingUp } from 'lucide-react'
import { useLotteryData } from '../hooks/useLotteryData'
import { getHotColdNumbers, WAVE_COLOR_MAP } from '../lib/lotteryData'

export default function HotColdRanking() {
  const { history } = useLotteryData()
  const { hot, cold } = useMemo(() => getHotColdNumbers(history, 10), [history])

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center gap-1.5 mb-3">
        <TrendingUp className="w-3.5 h-3.5 text-gold" />
        <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
          冷热排行 | Hot & Cold
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Hot Numbers */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Flame className="w-3 h-3 text-neon-red" />
            <span className="text-[9px] sm:text-[10px] text-neon-red font-medium">热号 TOP 10</span>
          </div>
          <div className="space-y-0.5">
            {hot.map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.04 }}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-md bg-neon-red/5 border border-neon-red/10"
              >
                <span className={`text-[8px] number-mono font-bold w-3 text-center ${i < 3 ? 'text-neon-red' : 'text-text-secondary'}`}>
                  {i + 1}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-bold number-mono ${WAVE_COLOR_MAP[item.wave]?.css ?? 'text-text-primary'}`}>
                  {String(item.number).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-text-secondary">{item.emoji}{item.zodiac}</span>
                <span className="ml-auto text-[9px] font-bold text-neon-red number-mono">{item.count}次</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cold Numbers */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Snowflake className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] sm:text-[10px] text-blue-400 font-medium">冷号 TOP 10</span>
          </div>
          <div className="space-y-0.5">
            {cold.map((item, i) => (
              <motion.div
                key={item.number}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.55 + i * 0.04 }}
                className="flex items-center gap-1.5 px-1.5 py-1 rounded-md bg-blue-500/5 border border-blue-500/10"
              >
                <span className={`text-[8px] number-mono font-bold w-3 text-center ${i < 3 ? 'text-blue-400' : 'text-text-secondary'}`}>
                  {i + 1}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-bold number-mono ${WAVE_COLOR_MAP[item.wave]?.css ?? 'text-text-primary'}`}>
                  {String(item.number).padStart(2, '0')}
                </span>
                <span className="text-[8px] text-text-secondary">{item.emoji}{item.zodiac}</span>
                <span className="ml-auto text-[9px] font-bold text-blue-400 number-mono">{item.count}次</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
