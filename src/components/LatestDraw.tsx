import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock } from 'lucide-react';
import { WAVE_COLOR_HEX, WAVE_COLOR_BG } from '../lib/zodiacConfig';

interface DrawRecord {
  expect: string;
  openTime: string;
  openCode: string;
  wave: string;
  zodiac: string;
}

export default function LatestDraw() {
  const [latest, setLatest] = useState<DrawRecord | null>(null);

  useEffect(() => {
    fetch('/ai-gnosis-pro/history.json')
      .then(res => res.json())
      .then((json: DrawRecord[]) => {
        if (json.length > 0) setLatest(json[0]);
      })
      .catch(() => {});
  }, []);

  if (!latest) return null;

  const codes = latest.openCode.split(',').map(Number);
  const waves = latest.wave.split(',');
  const zodiacs = latest.zodiac.split(',');
  const flatNums = codes.slice(0, 6);
  const specialNum = codes[6];
  const specialWave = waves[6];
  const date = latest.openTime.split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-card/80 backdrop-blur-sm border border-accent/20 rounded-lg p-4 mb-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-bold">最新开奖</h2>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-secondary">
          <span className="font-mono text-accent font-bold">第 {latest.expect} 期</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {date}
          </span>
        </div>
      </div>

      {/* Flat numbers */}
      <div className="flex items-center justify-center gap-2 mb-3">
        {flatNums.map((n, i) => (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.0 + i * 0.08, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-mono font-bold"
            style={{
              backgroundColor: WAVE_COLOR_BG[waves[i] as keyof typeof WAVE_COLOR_BG],
              color: WAVE_COLOR_HEX[waves[i] as keyof typeof WAVE_COLOR_HEX],
              border: `2px solid ${WAVE_COLOR_HEX[waves[i] as keyof typeof WAVE_COLOR_HEX]}80`,
              boxShadow: `0 0 12px ${WAVE_COLOR_HEX[waves[i] as keyof typeof WAVE_COLOR_HEX]}30`,
            }}
          >
            {String(n).padStart(2, '0')}
          </motion.span>
        ))}

        {/* Plus separator */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-lg font-bold text-text-secondary mx-1"
        >
          +
        </motion.span>

        {/* Special number */}
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full text-base font-mono font-bold"
          style={{
            backgroundColor: WAVE_COLOR_BG[specialWave as keyof typeof WAVE_COLOR_BG],
            color: WAVE_COLOR_HEX[specialWave as keyof typeof WAVE_COLOR_HEX],
            border: `3px solid ${WAVE_COLOR_HEX[specialWave as keyof typeof WAVE_COLOR_HEX]}`,
            boxShadow: `0 0 16px ${WAVE_COLOR_HEX[specialWave as keyof typeof WAVE_COLOR_HEX]}50`,
          }}
        >
          {String(specialNum).padStart(2, '0')}
        </motion.span>
      </div>

      {/* Zodiac row */}
      <div className="flex items-center justify-center gap-2 text-xs">
        {zodiacs.map((z, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded ${i === 6 ? 'bg-warning/20 text-warning font-bold' : 'bg-bg text-text-secondary'}`}
          >
            {z}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
