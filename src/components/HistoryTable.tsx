import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Trophy, TrendingUp } from 'lucide-react'
import { zodiacConfig } from '../lib/zodiacConfig'
import { generateHistory } from '../lib/history'
import { useState, useEffect } from 'react'

export default function HistoryTable() {
  const [history] = useState(() => generateHistory())
  const matchCount = history.filter(r => r.match).length
  const matchRate = ((matchCount / history.length) * 100).toFixed(1)

  const [animatedRate, setAnimatedRate] = useState(0)
  useEffect(() => {
    const target = parseFloat(matchRate)
    const timer = setInterval(() => {
      setAnimatedRate(prev => {
        if (prev >= target) return target
        return prev + 0.8
      })
    }, 30)
    return () => clearInterval(timer)
  }, [matchRate])

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
            历史战绩 | Performance History
          </h2>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            <span className="text-[10px] sm:text-xs text-text-secondary">
              <span className="text-neon-green font-bold number-mono">{matchCount}</span>/{history.length}
            </span>
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-neon-green/10 border border-neon-green/20">
            <TrendingUp className="w-2.5 h-2.5 text-neon-green" />
            <span className="text-[10px] sm:text-xs font-bold text-neon-green number-mono">
              {animatedRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-2 text-text-secondary font-medium">期号</th>
              <th className="text-center py-2 px-2 text-text-secondary font-medium">开奖号码</th>
              <th className="text-center py-2 px-2 text-text-secondary font-medium">开奖生肖</th>
              <th className="text-center py-2 px-2 text-text-secondary font-medium">AI 预测</th>
              <th className="text-center py-2 px-2 text-text-secondary font-medium">结果</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, i) => {
              const animalData = zodiacConfig.find(a => a.name === record.openAnimal)
              const predictedAnimalData = zodiacConfig.find(a => a.name === record.aiPrediction)
              return (
                <motion.tr
                  key={record.period}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.03 }}
                  className="border-b border-border/50 hover:bg-bg-tertiary/30 transition-colors"
                >
                  <td className="py-2 px-2 number-mono text-text-secondary">{record.period}</td>
                  <td className="py-2 px-2 text-center">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 font-bold text-gold number-mono text-[11px]">
                      {String(record.openNumber).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-sm">{animalData?.emoji}</span>
                      <span className="text-text-primary font-medium">{record.openAnimal}</span>
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-sm">{predictedAnimalData?.emoji}</span>
                      <span className={`font-medium ${record.match ? 'text-neon-green' : 'text-neon-red'}`}>
                        {record.aiPrediction}
                      </span>
                    </span>
                  </td>
                  <td className="py-2 px-2 text-center">
                    {record.match ? (
                      <span className="inline-flex items-center gap-0.5 text-neon-green">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="font-medium">命中</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-neon-red">
                        <XCircle className="w-3 h-3" />
                        <span className="font-medium">未中</span>
                      </span>
                    )}
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card layout */}
      <div className="sm:hidden space-y-1.5">
        {history.map((record, i) => {
          const animalData = zodiacConfig.find(a => a.name === record.openAnimal)
          const predictedAnimalData = zodiacConfig.find(a => a.name === record.aiPrediction)
          return (
            <motion.div
              key={record.period}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.03 }}
              className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-bg-tertiary/30 border border-border/30"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 font-bold text-gold number-mono text-[10px]">
                  {String(record.openNumber).padStart(2, '0')}
                </span>
                <div>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>{animalData?.emoji}</span>
                    <span className="text-text-primary font-medium">{record.openAnimal}</span>
                  </div>
                  <div className="text-[9px] text-text-secondary number-mono">
                    {record.period.slice(4)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[10px] justify-end">
                    <span>{predictedAnimalData?.emoji}</span>
                    <span className={`font-medium ${record.match ? 'text-neon-green' : 'text-neon-red'}`}>
                      {record.aiPrediction}
                    </span>
                  </div>
                </div>
                {record.match ? (
                  <CheckCircle2 className="w-4 h-4 text-neon-green" />
                ) : (
                  <XCircle className="w-4 h-4 text-neon-red" />
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-2.5 p-2 rounded-lg bg-bg-tertiary/30 text-center">
        <span className="text-[9px] sm:text-[10px] text-text-secondary">
          数据基于量子增强型 LSTM-Transformer 混合模型回测 | 近 20 期综合准确率 {matchRate}%
        </span>
      </div>
    </motion.div>
  )
}
