import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Timer, AlertTriangle } from 'lucide-react'
import { useLotteryData } from '../hooks/useLotteryData'

export default function CountdownTimer() {
  const { latestDraw, nextExpect } = useLotteryData()

  // Next draw is at 21:30 HKT (UTC+8)
  const nextDrawTime = useMemo(() => {
    const lastDrawDate = new Date(latestDraw.openTime.replace(' ', 'T') + '+08:00')
    const next = new Date(lastDrawDate)
    next.setDate(next.getDate() + 1)
    next.setHours(21, 30, 0, 0)
    return next
  }, [latestDraw.openTime])

  const [time, setTime] = useState(() => getTimeDiff(nextDrawTime))

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeDiff(nextDrawTime))
    }, 1000)
    return () => clearInterval(timer)
  }, [nextDrawTime])

  const isUrgent = time.total < 3600000

  const label = useMemo(() => {
    const now = new Date()
    const h = now.getUTCHours() + 8 // HKT
    if (h < 9) return '晨间数据采集'
    if (h < 12) return '午间模型训练'
    if (h < 15) return '下午推理计算'
    if (h < 18) return '傍晚数据校验'
    if (h < 21) return '最终预测锁定'
    return '封盘 · 等待开奖'
  }, [])

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass-card rounded-xl px-3 py-2.5 sm:px-4 sm:py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Timer className={`w-3.5 h-3.5 ${isUrgent ? 'text-neon-red' : 'text-gold'}`} />
          <div>
            <span className="text-[10px] sm:text-xs text-text-secondary">下一期 {nextExpect}</span>
            <div className="text-[8px] sm:text-[9px] text-text-secondary/60 number-mono">
              最新: {latestDraw.expect} | {latestDraw.openCode}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {isUrgent && <AlertTriangle className="w-3 h-3 text-neon-red animate-pulse" />}
          <div className="flex items-center gap-1">
            {[
              { value: time.h, label: '时' },
              { value: time.m, label: '分' },
              { value: time.s, label: '秒' },
            ].map(({ value, label }, idx) => (
              <div key={label} className="flex items-center">
                <span className={`inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md text-sm sm:text-base font-bold number-mono ${
                  isUrgent
                    ? 'bg-neon-red/10 text-neon-red border border-neon-red/30'
                    : 'bg-gold/10 text-gold border border-gold/30'
                }`}>
                  {String(value).padStart(2, '0')}
                </span>
                <span className={`text-[9px] sm:text-[10px] ml-0.5 ${isUrgent ? 'text-neon-red' : 'text-text-secondary'}`}>{label}</span>
                {idx < 2 && <span className="text-[10px] text-text-secondary/50 mx-0.5">:</span>}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${isUrgent ? 'bg-neon-red animate-pulse' : 'bg-neon-green animate-pulse'}`} />
          <span className={`text-[9px] sm:text-[10px] ${isUrgent ? 'text-neon-red font-medium' : 'text-text-secondary'}`}>{label}</span>
        </div>
      </div>
    </motion.div>
  )
}

function getTimeDiff(target: Date): { h: number; m: number; s: number; total: number } {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { h: 0, m: 0, s: 0, total: 0 }
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    total: diff,
  }
}
