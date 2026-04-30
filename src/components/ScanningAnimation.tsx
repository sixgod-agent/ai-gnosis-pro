import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ZODIAC_MAP } from '../lib/zodiacConfig';

interface StageDef {
  getText: (excluded: string) => string;
  duration: number;
}

const STAGES: StageDef[] = [
  { getText: () => '正在初始化量子随机引擎...', duration: 800 },
  { getText: (ex) => `正在排除上期干扰项 (${ZODIAC_MAP[ex].cn}·${ZODIAC_MAP[ex].en})... 成功`, duration: 1200 },
  { getText: () => '正在同步 2026 年马年权重参数... 完毕', duration: 1000 },
  { getText: () => '正在执行蒙特卡洛 10,000 次模拟... 锁定结果', duration: 1500 },
  { getText: () => '正在生成特码与平码推荐矩阵... 就绪', duration: 500 },
];

const TOTAL = STAGES.reduce((s, st) => s + st.duration, 0);

interface Props {
  excludedZodiac: string;
}

export default function ScanningAnimation({ excludedZodiac }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let elapsed = 0;
    let timer: ReturnType<typeof setInterval>;

    timer = setInterval(() => {
      elapsed += 50;
      setProgress(Math.min(100, (elapsed / TOTAL) * 100));

      let acc = 0;
      let count = 0;
      for (const st of STAGES) {
        acc += st.duration;
        if (elapsed >= acc) count++;
      }
      setVisibleCount(count);

      if (elapsed >= TOTAL) clearInterval(timer);
    }, 50);

    return () => clearInterval(timer);
  }, []);

  const now = new Date().toLocaleTimeString('zh-CN', { hour12: false });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-5 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
        </span>
        <span className="text-sm text-accent font-mono">AI-Gnosis v6.0 · 深度扫描中</span>
      </div>

      <div className="bg-bg rounded-lg p-4 font-mono text-sm space-y-2 min-h-[200px]">
        {STAGES.map((stage, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{
              opacity: i < visibleCount ? 1 : 0.15,
              x: i < visibleCount ? 0 : -10,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2"
          >
            <span className="text-text-secondary shrink-0">[{now}]</span>
            <span className={i < visibleCount ? 'text-accent' : 'text-text-secondary/40'}>
              {stage.getText(excludedZodiac)}
            </span>
            {i < visibleCount && (
              <span className="text-accent ml-auto shrink-0">OK</span>
            )}
          </motion.div>
        ))}
        <span className="inline-block w-2 h-4 bg-accent animate-pulse" />
      </div>

      <div className="mt-3 h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05 }}
        />
      </div>
      <p className="mt-1 text-right text-xs text-text-secondary font-mono">{progress.toFixed(0)}%</p>
    </motion.div>
  );
}
