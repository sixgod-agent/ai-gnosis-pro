import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Zap, TrendingUp, CircleDot } from 'lucide-react';
import { ZODIAC_MAP, type Prediction, getWaveColor, isBig, WAVE_COLOR_HEX, WAVE_COLOR_BG, WAVE_COLOR_BORDER } from '../lib/zodiacConfig';

interface Props {
  prediction: Prediction;
  onRescan: () => void;
}

/* ── 单个号码球 ── */
function NumberBall({ n, size = 'sm' }: { n: number; size?: 'sm' | 'md' }) {
  const color = getWaveColor(n);
  const big = isBig(n);
  const pad = String(n).padStart(2, '0');
  const isLg = size === 'md';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`flex items-center justify-center rounded-full font-mono font-bold text-white ${isLg ? 'w-11 h-11 text-sm' : 'w-8 h-8 text-xs'}`}
        style={{ backgroundColor: WAVE_COLOR_HEX[color], boxShadow: `0 0 8px ${WAVE_COLOR_HEX[color]}40` }}
      >
        {pad}
      </div>
      <span className="text-[9px] text-text-secondary leading-none flex items-center gap-0.5">
        <span className={big ? 'text-danger' : 'text-accent'}>{big ? '大' : '小'}</span>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: WAVE_COLOR_HEX[color] }}
        />
      </span>
    </div>
  );
}

/* ── 波色图例 ── */
function WaveLegend() {
  const { red, blue, green } = WAVE_COLOR_HEX;
  const items = [
    { color: red, label: '红波' },
    { color: blue, label: '蓝波' },
    { color: green, label: '绿波' },
  ];
  return (
    <div className="flex items-center gap-4 text-[10px] text-text-secondary">
      {items.map(it => (
        <span key={it.label} className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

export default function PredictionPanel({ prediction, onRescan }: Props) {
  const allZodiacNumbers = prediction.selectedZodiacs.flatMap(k => ZODIAC_MAP[k].numbers);
  const allNumbers = [...allZodiacNumbers, ...prediction.flatCodes];

  // 波色统计
  const colorCount = { red: 0, blue: 0, green: 0 } as Record<string, number>;
  allNumbers.forEach(n => { colorCount[getWaveColor(n)]++; });
  const bigCount = allNumbers.filter(isBig).length;
  const smallCount = allNumbers.length - bigCount;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">AI 预测结果</h2>
          <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-mono">2026 马年</span>
        </div>
        <button
          onClick={onRescan}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          重新扫描
        </button>
      </div>

      {/* ── 特码推荐 · 4 生肖 ── */}
      <div className="mb-5">
        <h3 className="text-sm font-bold text-accent mb-3 flex items-center gap-1.5">
          <span className="w-1 h-4 bg-accent rounded-full" />
          特码推荐 · 精选 4 生肖
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {prediction.selectedZodiacs.map((key, i) => {
            const z = ZODIAC_MAP[key];
            const zodiacColor = getWaveColor(z.numbers[0]);
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
                className="bg-card/80 backdrop-blur-sm border rounded-lg p-4"
                style={{ borderColor: WAVE_COLOR_BORDER[zodiacColor] }}
              >
                {/* 生肖头部 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{z.emoji}</span>
                    <div>
                      <span className="text-sm font-bold" style={{ color: WAVE_COLOR_HEX[zodiacColor] }}>
                        {z.cn}
                      </span>
                      <span className="text-xs text-text-secondary ml-1">{z.en}</span>
                    </div>
                  </div>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    style={{ backgroundColor: WAVE_COLOR_BG[zodiacColor], color: WAVE_COLOR_HEX[zodiacColor] }}
                  >
                    推荐
                  </span>
                </div>
                {/* 号码球 */}
                <div className="flex flex-wrap gap-2">
                  {z.numbers.map(n => (
                    <NumberBall key={n} n={n} size="sm" />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── 平码推荐 ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card/80 backdrop-blur-sm border border-warning/20 rounded-lg p-4 mb-4"
      >
        <h3 className="text-sm font-bold text-warning mb-3 flex items-center gap-1.5">
          <Zap className="w-4 h-4" />
          全频谱平码推荐
          <span className="text-[10px] text-text-secondary font-normal ml-1">· 全盘扫描 · 不限生肖</span>
        </h3>
        <div className="flex flex-wrap gap-3">
          {prediction.flatCodes.map((n, i) => (
            <motion.div
              key={n}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.08, type: 'spring', stiffness: 200 }}
            >
              <NumberBall n={n} size="md" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── 分析摘要 ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="grid grid-cols-3 gap-3"
      >
        {/* 波色分布 */}
        <div className="bg-card/60 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1 mb-2">
            <CircleDot className="w-3 h-3 text-text-secondary" />
            <span className="text-[11px] text-text-secondary font-medium">波色分布</span>
          </div>
          <div className="space-y-1">
            {(['red', 'blue', 'green'] as const).map(c => (
              <div key={c} className="flex items-center gap-2 text-[11px]">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: WAVE_COLOR_HEX[c] }}
                />
                <span className="text-text-secondary">
                  {{ red: '红波', blue: '蓝波', green: '绿波' }[c]}
                </span>
                <span className="ml-auto font-mono font-bold" style={{ color: WAVE_COLOR_HEX[c] }}>
                  {colorCount[c]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 大小比 */}
        <div className="bg-card/60 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1 mb-2">
            <TrendingUp className="w-3 h-3 text-text-secondary" />
            <span className="text-[11px] text-text-secondary font-medium">大小比</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-mono font-bold text-danger">{bigCount}</span>
            <span className="text-xs text-text-secondary">大</span>
            <span className="text-xs text-text-secondary mx-0.5">:</span>
            <span className="text-lg font-mono font-bold text-accent">{smallCount}</span>
            <span className="text-xs text-text-secondary">小</span>
          </div>
          <div className="mt-1.5 h-1 bg-border rounded-full overflow-hidden flex">
            <div className="h-full bg-danger rounded-l-full" style={{ width: `${(bigCount / allNumbers.length) * 100}%` }} />
            <div className="h-full bg-accent rounded-r-full" style={{ width: `${(smallCount / allNumbers.length) * 100}%` }} />
          </div>
        </div>

        {/* 总推荐数 */}
        <div className="bg-card/60 border border-border rounded-lg p-3">
          <div className="flex items-center gap-1 mb-2">
            <Sparkles className="w-3 h-3 text-text-secondary" />
            <span className="text-[11px] text-text-secondary font-medium">本期推荐</span>
          </div>
          <div className="mt-1">
            <span className="text-2xl font-mono font-bold text-accent">{allNumbers.length}</span>
            <span className="text-xs text-text-secondary ml-1">个号码</span>
          </div>
          <div className="text-[10px] text-text-secondary mt-1">
            特码 {allZodiacNumbers.length} + 平码 {prediction.flatCodes.length}
          </div>
        </div>
      </motion.div>

      {/* 图例 */}
      <div className="flex items-center justify-between mt-3">
        <WaveLegend />
        <span className="text-[9px] text-text-secondary">数据仅供参考 · 以官方开奖为准</span>
      </div>
    </motion.div>
  );
}
