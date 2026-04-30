import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';
import { getDailyPoem } from '../lib/zodiacConfig';

export default function DailyPoem() {
  const poem = getDailyPoem();
  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card/60 backdrop-blur-sm border border-border rounded-lg p-4 mb-6 max-w-lg mx-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-warning" />
          <span className="text-xs text-warning font-bold">今日玄机</span>
        </div>
        <span className="text-[10px] text-text-secondary font-mono">{dateStr}</span>
      </div>

      <div className="space-y-1.5">
        {poem.lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + i * 0.2 }}
            className="text-sm text-text-primary/90 font-mono tracking-wider text-center"
            style={{ textShadow: '0 0 8px rgba(2,241,166,0.15)' }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-border/50 text-right">
        <span className="text-[10px] text-text-secondary italic">—— {poem.source}</span>
      </div>
    </motion.div>
  );
}
