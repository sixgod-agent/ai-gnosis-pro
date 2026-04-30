import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { generatePrediction, ZODIAC_MAP } from '../lib/zodiacConfig';

interface DrawRecord {
  expect: string;
  openTime: string;
  openCode: string;
  wave: string;
  zodiac: string;
}

interface BacktestResult {
  period: string;
  date: string;
  predictedZodiacs: string[];
  specialNum: number;
  specialZodiac: string;
  zodiacHit: boolean;
  numberHit: boolean;
}

/** Find the zodiac key from a Chinese zodiac name */
function cnToKey(cn: string): string | null {
  for (const [k, v] of Object.entries(ZODIAC_MAP)) {
    if (v.cn === cn) return k;
  }
  return null;
}

/** Analyze recent draws before a given index to find trending zodiacs */
function getTrendZodiacs(records: DrawRecord[], upToIdx: number): string[] {
  // Look at last 5 draws before this one, find most common special zodiacs
  const windowSize = 5;
  const startIdx = upToIdx + 1;
  const endIdx = Math.min(records.length, startIdx + windowSize);
  const zodiacCount: Record<string, number> = {};

  for (let i = startIdx; i < endIdx; i++) {
    const r = records[i];
    if (!r) continue;
    const zodiacs = r.zodiac.split(',');
    const specialZodiac = zodiacs[6];
    if (specialZodiac) {
      zodiacCount[specialZodiac] = (zodiacCount[specialZodiac] || 0) + 1;
    }
    // Also count flat zodiacs (they often repeat)
    for (let j = 0; j < 6; j++) {
      const z = zodiacs[j];
      if (z) zodiacCount[z] = (zodiacCount[z] || 0) + 0.5;
    }
  }

  // Return top 3 trending zodiacs
  return Object.entries(zodiacCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cn]) => cnToKey(cn) || '')
    .filter(Boolean);
}

function backtest(records: DrawRecord[], excluded: string): BacktestResult[] {
  const results: BacktestResult[] = [];

  // Build index for quick lookup
  const expectToIdx = new Map<string, number>();
  records.forEach((r, i) => expectToIdx.set(r.expect, i));

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const codes = r.openCode.split(',').map(Number);
    const specialNum = codes[6];
    const zodiacs = r.zodiac.split(',');
    const specialZodiacCn = zodiacs[6] || '';

    // Get trend zodiacs from recent draws
    const trendZodiacs = getTrendZodiacs(records, i);

    // Generate prediction for this draw's date with trend bias
    const prediction = generatePrediction(excluded, trendZodiacs);

    const zodiacKeys = prediction.selectedZodiacs.map(k => ZODIAC_MAP[k].cn);
    const zodiacHit = zodiacKeys.includes(specialZodiacCn);

    const predictedNumbers = new Set([
      ...prediction.selectedZodiacs.flatMap(k => ZODIAC_MAP[k].numbers),
      ...prediction.flatCodes,
    ]);
    const drawNumbers = new Set(codes);
    const numberHit = [...predictedNumbers].some(n => drawNumbers.has(n));

    results.push({
      period: r.expect,
      date: r.openTime.split(' ')[0],
      predictedZodiacs: prediction.selectedZodiacs.map(k => ZODIAC_MAP[k].cn),
      specialNum,
      specialZodiac: specialZodiacCn,
      zodiacHit,
      numberHit,
    });
  }

  return results;
}

export default function AccuracyPanel({ excluded = 'horse' }: { excluded?: string }) {
  const [records, setRecords] = useState<DrawRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/ai-gnosis-pro/history.json')
      .then(res => res.json())
      .then((json: DrawRecord[]) => {
        setRecords(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const results = backtest(records, excluded);
    const last50 = results.slice(0, 50);
    const last10 = results.slice(0, 10);

    const calc = (arr: BacktestResult[]) => {
      if (arr.length === 0) return { total: 0, zodiacWin: 0, numberWin: 0, bothWin: 0 };
      const zodiacWin = arr.filter(r => r.zodiacHit).length;
      const numberWin = arr.filter(r => r.numberHit).length;
      const bothWin = arr.filter(r => r.zodiacHit && r.numberHit).length;
      return { total: arr.length, zodiacWin, numberWin, bothWin };
    };

    return {
      all: calc(results),
      recent50: calc(last50),
      recent10: calc(last10),
      results: results.slice(0, 20),
    };
  }, [records, excluded]);

  if (loading) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4">
        <div className="animate-pulse text-text-secondary text-sm text-center py-6">加载中...</div>
      </div>
    );
  }

  const pct = (n: number, total: number) => total === 0 ? '0.0' : ((n / total) * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 h-full"
    >
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-accent" />
        <h2 className="text-base font-bold">预测准确率</h2>
      </div>

      {/* Rate cards */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-bg/50 border border-border/50 rounded-lg p-2.5">
          <div className="text-[10px] text-text-secondary mb-1">全部特码命中</div>
          <div className="text-lg font-mono font-bold text-accent">{pct(stats.all.zodiacWin, stats.all.total)}%</div>
          <div className="text-[9px] text-text-secondary">{stats.all.zodiacWin}/{stats.all.total}</div>
        </div>
        <div className="bg-bg/50 border border-border/50 rounded-lg p-2.5">
          <div className="text-[10px] text-text-secondary mb-1">全部号码命中</div>
          <div className="text-lg font-mono font-bold text-accent">{pct(stats.all.numberWin, stats.all.total)}%</div>
          <div className="text-[9px] text-text-secondary">{stats.all.numberWin}/{stats.all.total}</div>
        </div>
        <div className="bg-bg/50 border border-border/50 rounded-lg p-2.5">
          <div className="text-[10px] text-text-secondary mb-1">近50期特码</div>
          <div className="text-lg font-mono font-bold text-warning">{pct(stats.recent50.zodiacWin, stats.recent50.total)}%</div>
          <div className="text-[9px] text-text-secondary">{stats.recent50.zodiacWin}/{stats.recent50.total}</div>
        </div>
        <div className="bg-bg/50 border border-border/50 rounded-lg p-2.5">
          <div className="text-[10px] text-text-secondary mb-1">近10期特码</div>
          <div className="text-lg font-mono font-bold text-danger">{pct(stats.recent10.zodiacWin, stats.recent10.total)}%</div>
          <div className="text-[9px] text-text-secondary">{stats.recent10.zodiacWin}/{stats.recent10.total}</div>
        </div>
      </div>

      {/* Recent results table */}
      <div className="text-[11px] text-text-secondary mb-1.5 font-medium">最近回测</div>
      <div className="overflow-x-auto -mx-1 px-1">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-text-secondary border-b border-border/40 text-[10px]">
              <th className="text-left pb-1.5 font-medium">期号</th>
              <th className="text-center pb-1.5 font-medium">推荐</th>
              <th className="text-center pb-1.5 font-medium">特码</th>
              <th className="text-center pb-1.5 font-medium">结果</th>
            </tr>
          </thead>
          <tbody>
            {stats.results.map((r) => (
              <tr key={r.period} className="border-b border-border/20">
                <td className="py-1 font-mono text-text-secondary">{r.period.slice(-4)}</td>
                <td className="py-1 text-center text-accent truncate max-w-[100px]">{r.predictedZodiacs.join(' ')}</td>
                <td className="py-1 text-center font-mono">{String(r.specialNum).padStart(2, '0')}</td>
                <td className="py-1 text-center">
                  <span className={`inline-block w-5 h-5 rounded text-[9px] leading-5 text-center font-bold ${r.zodiacHit ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                    {r.zodiacHit ? '中' : '未'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[8px] text-text-secondary mt-1.5 text-center">
        基于趋势分析回测 · 特码命中=推荐生肖含特码生肖
      </div>
    </motion.div>
  );
}
