import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Zap } from 'lucide-react';
import { ZODIAC_MAP, type Prediction } from '../lib/zodiacConfig';

interface Props {
  prediction: Prediction;
  onRescan: () => void;
}

export default function PredictionPanel({ prediction, onRescan }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">AI 预测结果</h2>
          <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-mono">2026 马年模型</span>
        </div>
        <button
          onClick={onRescan}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重新扫描
        </button>
      </div>

      {/* Section: 特码推荐 */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-accent mb-3 flex items-center gap-1.5">
          <span className="w-1 h-4 bg-accent rounded-full" />
          特码推荐 · 精选 4 生肖
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {prediction.selectedZodiacs.map((key, i) => {
            const z = ZODIAC_MAP[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="bg-card/80 backdrop-blur-sm border border-accent/20 rounded-lg p-4 hover:border-accent/40 transition-colors"
              >
                <div className="text-3xl mb-1">{z.emoji}</div>
                <div className="text-sm font-bold text-accent">{z.cn} · {z.en}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {z.numbers.map(n => (
                    <span
                      key={n}
                      className="w-9 h-9 flex items-center justify-center bg-accent/10 text-accent rounded font-mono text-sm font-bold"
                    >
                      {String(n).padStart(2, '0')}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Section: 平码推荐 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-card/80 backdrop-blur-sm border border-warning/20 rounded-lg p-4"
      >
        <h3 className="text-sm font-bold text-warning mb-3 flex items-center gap-1.5">
          <Zap className="w-4 h-4" />
          全频谱平码推荐 · 全盘扫描 · 不限生肖
        </h3>
        <div className="flex flex-wrap gap-2">
          {prediction.flatCodes.map((n, i) => (
            <motion.span
              key={n}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.9 + i * 0.08, type: 'spring', stiffness: 200 }}
              className="w-12 h-12 flex items-center justify-center bg-warning/10 text-warning border border-warning/20 rounded-lg font-mono text-lg font-bold"
            >
              {String(n).padStart(2, '0')}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
