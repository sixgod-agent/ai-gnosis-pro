import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { HISTORY_DATA } from '../lib/zodiacConfig';

export default function HistoryTable() {
  const wins = HISTORY_DATA.filter(h => h.won).length;
  const total = HISTORY_DATA.length;
  const rate = ((wins / total) * 100).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 mb-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-bold">历史战绩</h2>
        </div>
        <div className="flex items-center gap-4 text-sm font-mono">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-success rounded-full" />
            <span className="text-success font-bold">{wins} 胜</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-danger rounded-full" />
            <span className="text-danger font-bold">{total - wins} 负</span>
          </span>
          <span className="text-text-secondary">命中率 <span className="text-accent font-bold">{rate}%</span></span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-text-secondary text-xs border-b border-border">
              <th className="text-left pb-3 font-medium">期号</th>
              <th className="text-left pb-3 font-medium">日期</th>
              <th className="text-left pb-3 font-medium">推荐生肖</th>
              <th className="text-center pb-3 font-medium">开奖号码</th>
              <th className="text-right pb-3 font-medium">结果</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY_DATA.map((r) => (
              <tr key={r.period} className="border-b border-border/40 hover:bg-bg/50 transition-colors">
                <td className="py-2.5 font-mono text-text-secondary">{r.period}</td>
                <td className="py-2.5 text-text-secondary">{r.date}</td>
                <td className="py-2.5 text-accent font-medium">{r.prediction}</td>
                <td className="py-2.5 text-center font-mono font-bold text-text-primary">{r.result}</td>
                <td className="py-2.5 text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                      r.won
                        ? 'bg-success/10 text-success'
                        : 'bg-danger/10 text-danger'
                    }`}
                  >
                    {r.won ? '命中' : '未中'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
