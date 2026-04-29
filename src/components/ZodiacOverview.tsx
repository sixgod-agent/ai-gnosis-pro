import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
import { zodiacConfig } from '../lib/zodiacConfig'

interface ZodiacOverviewProps {
  assignedAnimals: string[]
}

export default function ZodiacOverview({ assignedAnimals }: ZodiacOverviewProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-3.5 h-3.5 text-gold" />
        <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
          12 生肖号码矩阵 | Zodiac Matrix 2026
        </h2>
        <span className="text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 ml-auto">
          马年周期
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5 sm:gap-2">
        {zodiacConfig.map((animal, i) => {
          const isAssigned = assignedAnimals.includes(animal.name)
          return (
            <motion.div
              key={animal.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 200 }}
              className={`rounded-lg p-2 text-center transition-all ${
                isAssigned
                  ? 'bg-neon-green/10 border border-neon-green/30 glow-green'
                  : 'bg-bg-tertiary/30 border border-border/30'
              }`}
            >
              <div className="text-lg mb-0.5">{animal.emoji}</div>
              <div className={`text-xs font-bold ${isAssigned ? 'text-neon-green' : 'text-text-secondary'}`}>
                {animal.name}
              </div>
              <div className="flex flex-wrap gap-0.5 mt-1 justify-center">
                {animal.numbers.map(n => (
                  <span
                    key={n}
                    className={`text-[8px] px-1 rounded number-mono ${
                      isAssigned
                        ? 'bg-neon-green/15 text-neon-green'
                        : 'bg-bg-tertiary text-text-secondary/60'
                    }`}
                  >
                    {String(n).padStart(2, '0')}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
