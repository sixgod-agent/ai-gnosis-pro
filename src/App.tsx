import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Brain, Lock, Fingerprint, Info } from 'lucide-react'
import NumberMatrix from './components/NumberMatrix'
import LoadingScreen from './components/LoadingScreen'
import AIStatusBar from './components/AIStatusBar'
import MainPredictor from './components/MainPredictor'
import HistoryTable from './components/HistoryTable'
import ZodiacOverview from './components/ZodiacOverview'
import { getSession } from './lib/storage'

export default function App() {
  const [loading, setLoading] = useState(true)
  const session = getSession()

  const handleLoadComplete = useCallback(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <>
        <NumberMatrix />
        <LoadingScreen onComplete={handleLoadComplete} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary relative">
      <NumberMatrix />

      {/* Scan line effect */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent"
          animate={{ top: ['-10px', '100vh'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 py-3 flex flex-col gap-3">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-neon-green/20 to-gold/20 flex items-center justify-center border border-neon-green/20">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-neon-green" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-text-primary tracking-tight leading-tight">
                AI-Gnosis <span className="text-neon-green">Pro v5.0</span>
              </h1>
              <p className="text-[9px] sm:text-[10px] text-text-secondary number-mono hidden xs:block">
                量子增强型大数据预测终端 | 2026 马年周期
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg glass-card">
              <Fingerprint className="w-3 h-3 text-text-secondary" />
              <div>
                <div className="text-[9px] text-text-secondary">Analytic ID</div>
                <div className="text-[10px] text-text-primary number-mono font-medium">
                  {session.analyticId.slice(0, 18)}...
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-neon-green/5 border border-neon-green/20">
              <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-neon-green" />
              <span className="text-[9px] sm:text-[10px] text-neon-green font-medium">
                {session.group}组 · 已锁定
              </span>
            </div>
          </div>
        </motion.header>

        {/* AI Status Bar */}
        <AIStatusBar />

        {/* Main Content */}
        <div className="flex flex-col gap-3">
          <MainPredictor animals={session.animals} group={session.group} />
          <HistoryTable animals={session.animals} />
          <ZodiacOverview assignedAnimals={session.animals} />
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-2 py-4 border-t border-border/30"
        >
          <div className="flex items-center gap-1.5 text-text-secondary/50">
            <Info className="w-3 h-3" />
            <span className="text-[10px]">
              本站仅供 AI 概率建模实验研究使用 | For AI probabilistic modeling research only
            </span>
          </div>
          <div className="text-[9px] text-text-secondary/30 number-mono">
            AI-Gnosis Pro v5.0 &copy; 2026 | Quantum-Enhanced Prediction Terminal | All data is simulated
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
