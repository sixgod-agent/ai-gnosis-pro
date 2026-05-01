import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, Shield, TrendingUp } from 'lucide-react';
import { generatePrediction, ZODIAC_MAP, type Prediction } from './lib/zodiacConfig';
import Background from './components/Background';
import MetricsBar from './components/MetricsBar';
import ScanningAnimation from './components/ScanningAnimation';
import PredictionPanel from './components/PredictionPanel';
import AdminPanel from './components/AdminPanel';
import DailyPoem from './components/DailyPoem';
import DrawHistory from './components/DrawHistory';
import LatestDraw from './components/LatestDraw';
import AccuracyPanel from './components/AccuracyPanel';

const TRADITIONAL_MAP: Record<string, string> = {
  '豬': '猪', '雞': '鸡', '馬': '马', '龍': '龙',
  '龜': '龟', '貓': '猫', '鳳': '凤', '獅': '狮',
};

function cnToKey(cn: string): string | null {
  const normalized = TRADITIONAL_MAP[cn] || cn;
  for (const [k, v] of Object.entries(ZODIAC_MAP)) {
    if (v.cn === normalized) return k;
  }
  return null;
}

/** Get the draw date (Beijing time) for a period number like "2026120" */
function periodToBeijingDate(period: string): string {
  const year = parseInt(period.substring(0, 4));
  const dayOfYear = parseInt(period.substring(4));
  const d = new Date(year, 0, 1);
  d.setDate(d.getDate() + dayOfYear - 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

type Phase = 'idle' | 'scanning' | 'result';

export default function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [excluded, setExcluded] = useState('horse');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [targetPeriod, setTargetPeriod] = useState('');
  const [drawDate, setDrawDate] = useState('');
  const currentPeriodRef = useRef('');

  // Fetch latest period from history.json and auto-start scan
  useEffect(() => {
    fetch('/ai-gnosis-pro/history.json')
      .then(res => res.json())
      .then((json: { expect: string; zodiac: string }[]) => {
        if (json.length > 0) {
          const latest = json[0].expect;
          // Auto-derive excluded zodiac from latest draw's special code (index 6)
          const specialZodiacCn = json[0].zodiac.split(',')[6];
          const autoExcluded = specialZodiacCn ? cnToKey(specialZodiacCn) : null;
          if (autoExcluded) setExcluded(autoExcluded);
          const nextPeriod = String(Number(latest) + 1).padStart(7, '0');
          setTargetPeriod(nextPeriod);
          setDrawDate(periodToBeijingDate(nextPeriod));
          currentPeriodRef.current = nextPeriod;

          // Auto-start scan with the derived excluded zodiac
          const excludedZodiac = autoExcluded || excluded;
          setPhase('scanning');
          setTimeout(() => {
            setPrediction(generatePrediction(excludedZodiac, undefined, nextPeriod));
            setPhase('result');
          }, 5000);
        }
      })
      .catch(() => {});
  }, []);

  const startScan = useCallback((period?: string) => {
    setPhase('scanning');
    setTimeout(() => {
      const seed = period || currentPeriodRef.current || '';
      setPrediction(generatePrediction(excluded, undefined, seed));
      if (period) {
        setTargetPeriod(period);
        setDrawDate(periodToBeijingDate(period));
        currentPeriodRef.current = period;
      }
      setPhase('result');
    }, 5000);
  }, [excluded]);

  // Auto-refresh: after draw (21:32) + 2 hours (23:32 Beijing = 15:32 UTC), auto-scan next period
  useEffect(() => {
    const timer = setInterval(() => {
      if (phase !== 'result' || !targetPeriod) return;

      const now = new Date();
      const utcH = now.getUTCHours();
      const utcM = now.getUTCMinutes();
      const nowUtcMin = utcH * 60 + utcM;
      // 23:32 Beijing = 15:32 UTC
      const refreshUtcMin = 15 * 60 + 32;

      if (nowUtcMin >= refreshUtcMin) {
        const nextPeriod = String(Number(targetPeriod) + 1).padStart(7, '0');
        // Only auto-refresh if we haven't already scanned for this period
        if (nextPeriod !== currentPeriodRef.current) {
          currentPeriodRef.current = nextPeriod;
          setPhase('idle');
          setPrediction(null);
          setTimeout(() => startScan(nextPeriod), 200);
        }
      }
    }, 60_000); // check every minute

    return () => clearInterval(timer);
  }, [phase, targetPeriod, startScan]);

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
              <p className="text-[10px] text-text-secondary leading-tight hidden sm:block">v6.0 · Quantum-Enhanced Prediction Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
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
        <LatestDraw />

        <AnimatePresence mode="wait">          {phase === 'idle' && (
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
              <DailyPoem />
              <h2 className="text-xl sm:text-2xl font-bold mb-2">AI 深度预测引擎</h2>
              <p className="text-text-secondary mb-8 text-center max-w-md text-xs sm:text-sm leading-relaxed px-4">
                基于量子增强算法与蒙特卡洛模拟，从 49 个号码中精准锁定高概率目标。
              </p>
              <button
                onClick={() => startScan()}
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
              <ScanningAnimation />
            </motion.div>
          )}

          {phase === 'result' && prediction && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PredictionPanel prediction={prediction} onRescan={startScan} targetPeriod={targetPeriod} drawDate={drawDate} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <DrawHistory />
          </div>
          <div className="lg:col-span-1 order-1 lg:order-2">
            <AccuracyPanel excluded={excluded} />
          </div>
        </div>
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
