import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Shield, TrendingUp } from 'lucide-react';
import { generatePrediction, ZODIAC_MAP, type Prediction } from './lib/zodiacConfig';
import Background from './components/Background';
import MetricsBar from './components/MetricsBar';
import ScanningAnimation from './components/ScanningAnimation';
import PredictionPanel from './components/PredictionPanel';
import HistoryTable from './components/HistoryTable';
import AdminPanel from './components/AdminPanel';

type Phase = 'idle' | 'scanning' | 'result';

export default function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [excluded, setExcluded] = useState('horse');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);

  const startScan = useCallback(() => {
    setPhase('scanning');
    setTimeout(() => {
      setPrediction(generatePrediction(excluded));
      setPhase('result');
    }, 5000);
  }, [excluded]);

  const handleAdminChange = (zodiac: string) => {
    setExcluded(zodiac);
    setAdminOpen(false);
    setPhase('idle');
    setPrediction(null);
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary relative overflow-hidden">
      <Background />

      {/* ─── Header ─── */}
      <header className="relative border-b border-border" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-bg" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight leading-tight">
                AI-Gnosis <span className="text-accent">Pro</span>
              </h1>
              <p className="text-[10px] text-text-secondary leading-tight">v6.0 · Quantum-Enhanced Prediction Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-xs text-text-secondary">
              排除: {ZODIAC_MAP[excluded].emoji} {ZODIAC_MAP[excluded].cn}
            </span>
            <button
              onClick={() => setAdminOpen(true)}
              className="p-2 rounded-lg hover:bg-card transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main ─── */}
      <main className="relative max-w-7xl mx-auto px-4 py-6" style={{ zIndex: 10 }}>
        <MetricsBar />

        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20">
                <Shield className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-2">AI 深度预测引擎</h2>
              <p className="text-text-secondary mb-8 text-center max-w-md text-sm leading-relaxed">
                基于量子增强算法与蒙特卡洛模拟，从 49 个号码中精准锁定高概率目标。
              </p>
              <button
                onClick={startScan}
                className="flex items-center gap-2 px-8 py-3 bg-accent text-bg rounded-lg font-bold hover:brightness-110 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4" />
                启动 AI 深度扫描
              </button>
            </motion.div>
          )}

          {phase === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScanningAnimation excludedZodiac={excluded} />
            </motion.div>
          )}

          {phase === 'result' && prediction && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PredictionPanel prediction={prediction} excludedZodiac={excluded} onRescan={startScan} />
            </motion.div>
          )}
        </AnimatePresence>

        <HistoryTable />
      </main>

      {/* ─── Footer ─── */}
      <footer className="relative border-t border-border mt-4" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <p className="text-center text-xs text-text-secondary">
            本工具仅供 AI 概率建模实验研究使用，不构成任何投资建议
          </p>
        </div>
      </footer>

      {/* ─── Admin ─── */}
      <AnimatePresence>
        {adminOpen && (
          <AdminPanel
            onClose={() => setAdminOpen(false)}
            excludedZodiac={excluded}
            onExcludeChange={handleAdminChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
