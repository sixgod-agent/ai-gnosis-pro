import { useEffect, useState } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { Cpu, Activity, Brain } from 'lucide-react';

export default function MetricsBar() {
  const [cpuLoad, setCpuLoad] = useState(67.3);
  const [chartData, setChartData] = useState<{ v: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuLoad(prev => {
        const next = prev + (Math.random() - 0.45) * 12;
        return Math.max(32, Math.min(91, next));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const data = Array.from({ length: 24 }, () => ({ v: 55 + Math.random() * 35 }));
    setChartData(data);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-text-secondary">CPU 算力负载</span>
        </div>
        <div className="text-2xl font-bold text-accent font-mono">{cpuLoad.toFixed(1)}%</div>
        <div className="mt-1 h-1 bg-bg rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: `${cpuLoad}%` }} />
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-text-secondary">量子算力波动</span>
        </div>
        <div className="h-10 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#02f1a6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#02f1a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke="#02f1a6" fill="url(#gV)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs text-text-secondary">模型收敛度</span>
        </div>
        <div className="text-2xl font-bold text-accent font-mono">98.9%</div>
        <div className="text-xs text-success mt-1">● 稳定</div>
      </div>
    </div>
  );
}
