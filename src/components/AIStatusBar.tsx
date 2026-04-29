import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Activity, Wifi, Clock } from 'lucide-react'
import { useAnimatedValue, useInterval } from '../hooks/useAnimatedValue'
import { getRemainingTime } from '../lib/storage'

export default function AIStatusBar() {
  const [gpuLoad, setGpuLoad] = useState(74.2)
  const [convergence, setConvergence] = useState(0.9851)
  const [computePower, setComputePower] = useState(847.3)
  const [timeLeft, setTimeLeft] = useState('24:00:00')

  const animatedGpu = useAnimatedValue(gpuLoad, 1.5, 1)
  const animatedConv = useAnimatedValue(convergence, 1.5, 4)
  const animatedCompute = useAnimatedValue(computePower, 1.5, 1)

  useInterval(() => {
    setGpuLoad(prev => Math.max(60, Math.min(95, prev + (Math.random() - 0.48) * 2)))
    setConvergence(prev => Math.max(0.95, Math.min(0.9999, prev + (Math.random() - 0.45) * 0.002)))
    setComputePower(prev => Math.max(600, Math.min(1200, prev + (Math.random() - 0.5) * 30)))
    setTimeLeft(getRemainingTime())
  }, 2000)

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-card rounded-xl px-3 py-2.5 sm:px-4 sm:py-3"
    >
      {/* Mobile: compact row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold text-neon-green tracking-wider uppercase">
            系统在线
          </span>
        </div>
        {/* Desktop metrics */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-gold" />
            <span className="text-[10px] text-text-secondary">GPU</span>
            <span className="text-[10px] font-bold text-gold number-mono">{animatedGpu}%</span>
            <div className="w-12 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gold"
                animate={{ width: `${animatedGpu}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-neon-green" />
            <span className="text-[10px] text-text-secondary">收敛度</span>
            <span className="text-[10px] font-bold text-neon-green number-mono">{animatedConv}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-text-secondary">算力</span>
            <span className="text-[10px] font-bold text-blue-400 number-mono">{animatedCompute} TF</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-text-secondary" />
            <span className="text-[10px] font-bold text-text-primary number-mono">{timeLeft}</span>
          </div>
        </div>
        {/* Mobile: just show key values */}
        <div className="flex sm:hidden items-center gap-3 text-[9px] number-mono">
          <span className="text-gold font-bold">GPU {animatedGpu}%</span>
          <span className="text-neon-green font-bold">{animatedConv}</span>
          <span className="text-text-primary font-bold">{timeLeft}</span>
        </div>
      </div>
    </motion.div>
  )
}
