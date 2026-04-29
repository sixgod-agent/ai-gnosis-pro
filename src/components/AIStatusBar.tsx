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
      className="glass-card rounded-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap"
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <span className="text-xs font-semibold text-neon-green tracking-wider uppercase">
          系统在线 | SYSTEM ONLINE
        </span>
      </div>

      <div className="flex items-center gap-6 flex-wrap">
        {/* GPU Load */}
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs text-text-secondary">GPU 负载</span>
          <span className="text-xs font-bold text-gold number-mono">
            {animatedGpu}%
          </span>
          <div className="w-16 h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gold"
              animate={{ width: `${animatedGpu}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Convergence */}
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-neon-green" />
          <span className="text-xs text-text-secondary">模型收敛度</span>
          <span className="text-xs font-bold text-neon-green number-mono">
            {animatedConv}
          </span>
        </div>

        {/* Compute Power */}
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs text-text-secondary">实时算力</span>
          <span className="text-xs font-bold text-blue-400 number-mono">
            {animatedCompute} TFLOPS
          </span>
        </div>

        {/* Session Timer */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-text-secondary" />
          <span className="text-xs text-text-secondary">分片锁定</span>
          <span className="text-xs font-bold text-text-primary number-mono">
            {timeLeft}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
