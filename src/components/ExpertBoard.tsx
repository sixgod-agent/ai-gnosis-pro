import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Users, Crown, Medal } from 'lucide-react'
import { useLotteryData } from '../hooks/useLotteryData'
import { getHotColdNumbers, calcMissingValues, getWaveColor, WAVE_COLOR_MAP } from '../lib/lotteryData'
import type { DrawRecord } from '../lib/lotteryData'

// Generate fake expert recommendations based on real data patterns
function generateExperts(history: DrawRecord[]) {
  const hotCold = getHotColdNumbers(history, 10)
  const missing = calcMissingValues(history)

  const experts = [
    {
      name: '玄机大师',
      avatar: '🧙',
      winRate: 87.3,
      streak: 5,
      picks: hotCold.hot.slice(0, 4).map(h => h.number),
      desc: '专注热号追踪，近5期连中',
    },
    {
      name: '遗漏猎手',
      avatar: '🎯',
      winRate: 82.1,
      streak: 3,
      picks: [...missing].sort((a, b) => b.missing - a.missing).slice(0, 4).map(m => m.number),
      desc: '遗漏回补策略大师',
    },
    {
      name: '波色专家',
      avatar: '🎨',
      winRate: 79.6,
      streak: 2,
      picks: hotCold.hot.slice(2, 6).map(h => h.number),
      desc: '擅长波色组合分析',
    },
    {
      name: '生肖通灵',
      avatar: '🔮',
      winRate: 76.8,
      streak: 4,
      picks: [...missing].sort((a, b) => b.frequency - a.frequency).slice(0, 4).map(m => m.number),
      desc: '深度生肖命理分析',
    },
    {
      name: '数据分析师',
      avatar: '📊',
      winRate: 91.2,
      streak: 7,
      picks: hotCold.hot.slice(0, 2).map(h => h.number).concat([...missing].sort((a, b) => b.missing - a.missing).slice(0, 2).map(m => m.number)),
      desc: '量化模型驱动，AI辅助决策',
    },
  ]

  return experts
}

export default function ExpertBoard() {
  const { history } = useLotteryData()
  const experts = useMemo(() => generateExperts(history), [history])

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-card rounded-xl p-3 sm:p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <h2 className="text-[11px] sm:text-sm font-bold text-text-primary tracking-wide uppercase">
            高手方案 | Expert Picks
          </h2>
        </div>
      </div>

      <div className="space-y-1.5">
        {experts.map((expert, i) => (
          <motion.div
            key={expert.name}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.75 + i * 0.08 }}
            className={`rounded-lg p-2 sm:p-2.5 border ${
              i === 0 ? 'bg-gold/5 border-gold/20' : 'bg-bg-tertiary/30 border-border/30'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className="text-base">{expert.avatar}</span>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] sm:text-xs font-bold text-text-primary">{expert.name}</span>
                    {i === 0 && <Crown className="w-3 h-3 text-gold" />}
                    {i === 1 && <Medal className="w-3 h-3 text-gray-400" />}
                  </div>
                  <div className="text-[8px] sm:text-[9px] text-text-secondary">{expert.desc}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] sm:text-xs font-bold text-neon-green number-mono">{expert.winRate}%</div>
                <div className="text-[7px] sm:text-[8px] text-neon-green/60">连中{expert.streak}期</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {expert.picks.map(num => {
                const wave = getWaveColor(num)
                const style = WAVE_COLOR_MAP[wave]
                return (
                  <span
                    key={num}
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-[10px] font-bold number-mono border ${style?.bg} ${style?.border} ${style?.css}`}
                  >
                    {String(num).padStart(2, '0')}
                  </span>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
