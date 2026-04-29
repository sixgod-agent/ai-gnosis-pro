import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Database, Shield, Zap } from 'lucide-react'

interface LoadingScreenProps {
  onComplete: () => void
}

const steps = [
  { icon: Cpu, label: '初始化神经网络引擎...', duration: 800 },
  { icon: Database, label: '正在同步云端算力...', duration: 1200 },
  { icon: Shield, label: '加载量子加密模块...', duration: 800 },
  { icon: Zap, label: 'AI 模型预热完成，正在渲染数据...', duration: 600 },
]

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (currentStep >= steps.length) {
      setTimeout(onComplete, 400)
      return
    }

    const stepDuration = steps[currentStep].duration
    const startTime = Date.now()
    const baseProgress = (currentStep / steps.length) * 100
    const stepProgress = (1 / steps.length) * 100

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const stepFraction = Math.min(elapsed / stepDuration, 1)
      setProgress(baseProgress + stepProgress * stepFraction)

      if (stepFraction >= 1) {
        clearInterval(timer)
        setCurrentStep(prev => prev + 1)
      }
    }, 30)

    return () => clearInterval(timer)
  }, [currentStep, onComplete])

  const StepIcon = steps[Math.min(currentStep, steps.length - 1)]?.icon ?? Zap

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-neon-green/20 to-gold/20 flex items-center justify-center border border-neon-green/30">
              <Cpu className="w-12 h-12 text-neon-green" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-2xl border border-neon-green/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">
              AI-Gnosis <span className="text-neon-green">Pro v5.0</span>
            </h1>
            <p className="text-text-secondary text-sm mt-2 number-mono">
              量子增强型预测终端 | Quantum-Enhanced Prediction Terminal
            </p>
          </motion.div>

          {/* Progress */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="w-80"
          >
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-neon-green to-gold"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <StepIcon className="w-4 h-4 text-neon-green animate-pulse" />
              <span className="text-sm text-text-secondary number-mono">
                {steps[Math.min(currentStep, steps.length - 1)]?.label}
              </span>
            </div>

            <div className="flex justify-between mt-2">
              <span className="text-xs text-text-secondary number-mono">
                {progress.toFixed(1)}%
              </span>
              <span className="text-xs text-neon-green/60 number-mono">
                LAYER {Math.min(currentStep + 1, steps.length)}/{steps.length}
              </span>
            </div>
          </motion.div>

          {/* Neural Network Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-1 mt-4"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-neon-green"
                animate={{
                  opacity: [0.1, 1, 0.1],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.08,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
