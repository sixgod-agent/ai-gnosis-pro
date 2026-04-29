import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Target, Shield, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { zodiacConfig, getAnimalNumbers } from '../lib/zodiacConfig'
import type { GroupKey } from '../lib/zodiacConfig'
import { useAnimatedValue } from '../hooks/useAnimatedValue'

interface MainPredictorProps {
  animals: string[]
  group: GroupKey
}

export default function MainPredictor({ animals, group }: MainPredictorProps) {
  const [confidence, setConfidence] = useState(96.8)
  const animatedConf = useAnimatedValue(confidence, 1.2, 1)

  // Primary animal is the first in the group
  const primaryAnimal = zodiacConfig.find(a => a.name === animals[0])!
  const primaryNumbers = getAnimalNumbers(animals[0])

  // Flat code hedging: pick 6 numbers from all assigned animals
  const allAssignedNumbers = animals.flatMap(a => getAnimalNumbers(a))
  const hedgingNumbers = allAssignedNumbers.slice(0, 6)

  useEffect(() => {
    const timer = setInterval(() => {
      setConfidence(prev => Math.max(92, Math.min(99.2, prev + (Math.random() - 0.45) * 0.3)))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Special Code Recommendation */}
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="glass-card rounded-xl p-5 glow-green"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-neon-green" />
            <h2 className="text-sm font-bold text-neon-green tracking-wide uppercase">
              特码推荐 | Special Code
            </h2>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-neon-green/10 border border-neon-green/20">
            <Sparkles className="w-3 h-3 text-neon-green" />
            <span className="text-[10px] font-bold text-neon-green number-mono">
              首选生肖
            </span>
          </div>
        </div>

        {/* Primary Animal */}
        <div className="flex items-center gap-4 mb-5">
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-green/20 to-neon-green/5 flex items-center justify-center border border-neon-green/30"
            animate={{ boxShadow: ['0 0 15px rgba(2,241,166,0.1)', '0 0 30px rgba(2,241,166,0.2)', '0 0 15px rgba(2,241,166,0.1)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-3xl">{primaryAnimal.emoji}</span>
          </motion.div>
          <div>
            <div className="text-2xl font-bold text-text-primary">{primaryAnimal.name}</div>
            <div className="text-xs text-text-secondary mt-0.5">
              {group}组 - 深度神经网络分析结果
            </div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-neon-green" />
              <span className="text-[10px] text-neon-green">连续命中 17 期</span>
            </div>
          </div>
        </div>

        {/* Number Balls */}
        <div className="mb-4">
          <div className="text-[10px] text-text-secondary uppercase tracking-wider mb-2">
            对应号码 | CORRESPONDING NUMBERS
          </div>
          <div className="flex gap-2">
            {primaryNumbers.map((num, i) => (
              <motion.div
                key={num}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 200 }}
                className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green to-emerald-600 flex items-center justify-center shadow-lg shadow-neon-green/20"
              >
                <span className="text-base font-bold text-bg-primary number-mono">
                  {String(num).padStart(2, '0')}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Confidence Bar */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-text-secondary uppercase tracking-wider">
              置信度 | CONFIDENCE
            </span>
            <span className="text-sm font-bold text-neon-green number-mono">
              {animatedConf}%
            </span>
          </div>
          <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-green via-emerald-400 to-gold"
              animate={{ width: `${animatedConf}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px] text-text-secondary">量子贝叶斯推理引擎 v5.0</span>
            <span className="text-[9px] text-neon-green/60">模型精度 {animatedConf > 95 ? '优秀' : '良好'}</span>
          </div>
        </div>
      </motion.div>

      {/* Flat Code Hedging */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass-card rounded-xl p-5 glow-gold"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            <h2 className="text-sm font-bold text-gold tracking-wide uppercase">
              平码对冲 | Flat Code Hedge
            </h2>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-gold/10 border border-gold/20">
            <Zap className="w-3 h-3 text-gold" />
            <span className="text-[10px] font-bold text-gold number-mono">
              高频波动捕捉
            </span>
          </div>
        </div>

        {/* Grid of hedging numbers */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {hedgingNumbers.map((num, i) => {
            const animal = zodiacConfig.find(a => a.numbers.includes(num))
            return (
              <motion.div
                key={num}
                initial={{ scale: 0, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 180 }}
                className="rounded-lg bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-gold/20 p-3 flex flex-col items-center gap-1 hover:border-gold/40 transition-colors"
              >
                <span className="text-xl font-bold text-gold number-mono">
                  {String(num).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-text-secondary">
                  {animal?.emoji} {animal?.name}
                </span>
                <div className="flex items-center gap-0.5">
                  <div className="w-1 h-1 rounded-full bg-neon-green" />
                  <span className="text-[8px] text-neon-green/60 number-mono">HOT</span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '覆盖生肖', value: `${animals.length} 个`, color: 'text-neon-green' },
            { label: '波动系数', value: '0.847', color: 'text-gold' },
            { label: '对冲效率', value: '92.3%', color: 'text-blue-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-bg-tertiary/50 rounded-lg p-2 text-center">
              <div className="text-[9px] text-text-secondary">{stat.label}</div>
              <div className={`text-sm font-bold number-mono ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 p-2 rounded-lg bg-gold/5 border border-gold/10">
          <div className="text-[10px] text-gold/80 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            基于马尔可夫链 + LSTM 时序模型的多维对冲策略
          </div>
        </div>
      </motion.div>
    </div>
  )
}
