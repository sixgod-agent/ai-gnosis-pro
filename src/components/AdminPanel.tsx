import { motion } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { ZODIAC_MAP, ZODIAC_KEYS } from '../lib/zodiacConfig';

interface Props {
  onClose: () => void;
  excludedZodiac: string;
  onExcludeChange: (zodiac: string) => void;
}

export default function AdminPanel({ onClose, excludedZodiac, onExcludeChange }: Props) {
  const ex = ZODIAC_MAP[excludedZodiac];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{ zIndex: 100 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <h3 className="font-bold">管理控制台</h3>
          </div>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-text-secondary mb-2">上期开奖生肖 (将被排除)</label>
            <select
              value={excludedZodiac}
              onChange={(e) => onExcludeChange(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-text-primary focus:outline-none focus:border-accent cursor-pointer"
            >
              {ZODIAC_KEYS.map((key) => (
                <option key={key} value={key}>
                  {ZODIAC_MAP[key].emoji} {ZODIAC_MAP[key].cn} ({ZODIAC_MAP[key].en})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-accent/5 border border-accent/20 rounded-lg p-3 text-xs text-text-secondary space-y-1">
            <p>
              当前排除: <span className="text-accent font-bold">{ex.emoji} {ex.cn} ({ex.en})</span>
            </p>
            <p>排除的号码: {ex.numbers.map((n) => String(n).padStart(2, '0')).join(', ')}</p>
            <p className="pt-1 border-t border-accent/10">
              系统将从剩余 11 个生肖中精选 4 个作为特码推荐。
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
