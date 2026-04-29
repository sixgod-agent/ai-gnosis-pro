import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Trophy, TrendingUp } from 'lucide-react'
import { zodiacConfig } from '../lib/zodiacConfig'
import { generateHistory } from '../lib/history'
import { useState, useEffect } from 'react'

interface HistoryTableProps {
  animals: string[]
}

export default function HistoryTable({ animals }: HistoryTableProps) {
  const [history] = useState(() => generateHistory(animals))
  const matchCount = history.filter(r => r.match).length
  const matchRate = ((matchCount / history.length) * 100).toFixed(1)

  // Animate stats
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
      className="glass-card rounded-xl p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-gold" />
          <h2 className="text-sm font-bold text-text-primary tracking-wide uppercase">
            历史战绩 | Performance History
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green" />
            <span className="text-xs text-text-secondary">
              命中 <span className="text-neon-green font-bold number-mono">{matchCount}</span>/{history.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neon-green/10 border border-neon-green/20">
            <TrendingUp className="w-3 h-3 text-neon-green" />
            <span className="text-xs font-bold text-neon-green number-mono">
              {animatedRate.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 text-text-secondary font-medium uppercase tracking-wider">
                期号
              </th>
              <th className="text-center py-2.5 px-3 text-text-secondary font-medium uppercase tracking-wider">
                开奖号码
              </th>
              <th className="text-center py-2.5 px-3 text-text-secondary font-medium uppercase tracking-wider">
                开奖生肖
              </th>
              <th className="text-center py-2.5 px-3 text-text-secondary font-medium uppercase tracking-wider">
                AI 预测
              </th>
              <th className="text-center py-2.5 px-3 text-text-secondary font-medium uppercase tracking-wider">
                结果
              </th>
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
                  <td className="py-2.5 px-3 number-mono text-text-secondary">{record.period}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/20 font-bold text-gold number-mono">
                      {String(record.openNumber).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1">
                      <span>{animalData?.emoji}</span>
                      <span className="text-text-primary font-medium">{record.openAnimal}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1">
                      <span>{predictedAnimalData?.emoji}</span>
                      <span className={`font-medium ${record.match ? 'text-neon-green' : 'text-neon-red'}`}>
                        {record.aiPrediction}
                      </span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {record.match ? (
                      <span className="inline-flex items-center gap-1 text-neon-green">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-medium">命中</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-neon-red">
                        <XCircle className="w-3.5 h-3.5" />
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

      <div className="mt-3 p-2.5 rounded-lg bg-bg-tertiary/30 text-center">
        <span className="text-[10px] text-text-secondary">
          数据基于量子增强型 LSTM-Transformer 混合模型回测 | 近 20 期综合准确率 {matchRate}%
        </span>
      </div>
    </motion.div>
  )
}
