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

function backtest(records: DrawRecord[], excluded: string): BacktestResult[] {
  const results: BacktestResult[] = [];

  for (const r of records) {
    const codes = r.openCode.split(',').map(Number);
    const specialNum = codes[6];
    const zodiacs = r.zodiac.split(',');

    // Determine prediction for this draw's date
    const dateParts = r.openTime.split(' ')[0].split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    // Replicate the hash with the same date
    const dateStr = `${year}-${month}-${day}`;
    const prediction = generatePrediction(excluded);

    // Check zodiac hit: special number's zodiac in predicted zodiacs
    const specialZodiacCn = zodiacs[6] || '';
    const zodiacKeys = prediction.selectedZodiacs.map(k => ZODIAC_MAP[k].cn);
    const zodiacHit = zodiacKeys.includes(specialZodiacCn);

    // Check number hit: any predicted number in the draw
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
      results: results.slice(0, 30), // for table display
    };
  }, [records, excluded]);

  if (loading) {
    return (
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 mb-4">
        <div className="animate-pulse text-text-secondary text-sm text-center py-6">加载中...</div>
      </div>
    );
  }

  const pct = (n: number, total: number) => total === 0 ? '0.0' : ((n / total) * 100).toFixed(1);

  const RateCard = ({ label, value, total, color, icon: Icon }: {
    label: string; value: number; total: number; color: string; icon: React.ElementType;
  }) => {
    const rate = parseFloat(pct(value, total));
    const isHigh = rate >= 70;
    const isLow = rate <= 40;
    return (
      <div className="bg-bg/50 border border-border/50 rounded-lg p-3 flex-1 min-w-[120px]">
        <div className="flex items-center gap-1.5 mb-2">
          <Icon className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-[11px] text-text-secondary">{label}</span>
        </div>
        <div className="text-xl font-mono font-bold" style={{ color }}>
          {pct(value, total)}%
        </div>
        <div className="text-[10px] text-text-secondary mt-0.5">
          {value}/{total} 期
        </div>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex-1 h-1 bg-border rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${rate}%`, backgroundColor: color }} />
          </div>
          {isHigh && <TrendingUp className="w-3 h-3 text-success" />}
          {isLow && <TrendingDown className="w-3 h-3 text-danger" />}
          {!isHigh && !isLow && <Minus className="w-3 h-3 text-text-secondary" />}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 mb-4"
    >
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-accent" />
        <h2 className="text-lg font-bold">预测准确率</h2>
        <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-mono">回测 {stats.all.total} 期</span>
      </div>

      {/* Rate cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <RateCard label="特码命中（全部）" value={stats.all.zodiacWin} total={stats.all.total} color="#02f1a6" icon={Target} />
        <RateCard label="号码命中（全部）" value={stats.all.numberWin} total={stats.all.total} color="#2B9AFF" icon={Target} />
        <RateCard label="近50期特码" value={stats.recent50.zodiacWin} total={stats.recent50.total} color="#FCD535" icon={Target} />
        <RateCard label="近10期特码" value={stats.recent10.zodiacWin} total={stats.recent10.total} color="#F6465D" icon={Target} />
      </div>

      {/* Recent results table */}
      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-text-secondary border-b border-border/40">
              <th className="text-left pb-2 font-medium">期号</th>
              <th className="text-left pb-2 font-medium">日期</th>
              <th className="text-left pb-2 font-medium">推荐生肖</th>
              <th className="text-center pb-2 font-medium">特码</th>
              <th className="text-center pb-2 font-medium">特码命中</th>
              <th className="text-center pb-2 font-medium">号码命中</th>
            </tr>
          </thead>
          <tbody>
            {stats.results.map((r) => (
              <tr key={r.period} className="border-b border-border/20 hover:bg-bg/40 transition-colors">
                <td className="py-1.5 font-mono text-text-secondary">{r.period}</td>
                <td className="py-1.5 text-text-secondary">{r.date}</td>
                <td className="py-1.5 text-accent">{r.predictedZodiacs.join(' ')}</td>
                <td className="py-1.5 text-center font-mono font-bold">{String(r.specialNum).padStart(2, '0')} <span className="text-text-secondary font-normal ml-0.5">{r.specialZodiac}</span></td>
                <td className="py-1.5 text-center">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${r.zodiacHit ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                    {r.zodiacHit ? '命中' : '未中'}
                  </span>
                </td>
                <td className="py-1.5 text-center">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${r.numberHit ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>
                    {r.numberHit ? '命中' : '未中'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[9px] text-text-secondary mt-2 text-center">
        基于每日预测算法回测，特码命中 = 推荐生肖包含特码生肖，号码命中 = 推荐号码出现在开奖号码中
      </div>
    </motion.div>
  );
}
