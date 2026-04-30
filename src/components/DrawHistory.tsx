import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Database, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { getWaveColor, WAVE_COLOR_HEX, WAVE_COLOR_BG } from '../lib/zodiacConfig';

interface DrawRecord {
  expect: string;
  openTime: string;
  openCode: string;
  wave: string;
  zodiac: string;
}

const PAGE_SIZE = 20;

function parseCodes(code: string): number[] {
  return code.split(',').map(Number);
}

function Ball({ num, wave }: { num: number; wave: string }) {
  const color = wave === 'red' ? WAVE_COLOR_HEX.red
    : wave === 'blue' ? WAVE_COLOR_HEX.blue
    : WAVE_COLOR_HEX.green;
  const bg = wave === 'red' ? WAVE_COLOR_BG.red
    : wave === 'blue' ? WAVE_COLOR_BG.blue
    : WAVE_COLOR_BG.green;

  return (
    <span
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mx-0.5 flex-shrink-0"
      style={{ backgroundColor: bg, color, border: `1px solid ${color}40` }}
    >
      {String(num).padStart(2, '0')}
    </span>
  );
}

export default function DrawHistory() {
  const [data, setData] = useState<DrawRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/ai-gnosis-pro/history.json')
      .then(res => res.json())
      .then((json: DrawRecord[]) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    return data.filter(r =>
      r.expect.includes(search.trim()) ||
      r.openTime.includes(search.trim())
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 mb-6"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold">开奖历史记录</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary font-mono">
            共 {filtered.length} 期
          </span>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="搜索期号/日期"
              className="bg-bg border border-border rounded px-3 py-1.5 pl-8 text-xs text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent/50 w-36"
            />
          </div>
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex items-center gap-4 mb-3 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: WAVE_COLOR_HEX.red }} />
          红波
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: WAVE_COLOR_HEX.blue }} />
          蓝波
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: WAVE_COLOR_HEX.green }} />
          绿波
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-text-secondary text-xs border-b border-border">
              <th className="text-left pb-2.5 font-medium">期号</th>
              <th className="text-left pb-2.5 font-medium">开奖时间</th>
              <th className="text-left pb-2.5 font-medium">平码</th>
              <th className="text-center pb-2.5 font-medium">特码</th>
              <th className="text-left pb-2.5 font-medium">生肖</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-text-secondary">
                  <div className="animate-pulse">加载中...</div>
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-text-secondary">
                  暂无数据
                </td>
              </tr>
            ) : (
              paged.map((r) => {
                const codes = parseCodes(r.openCode);
                const waves = r.wave.split(',');
                const zodiacs = r.zodiac.split(',');
                const flatNums = codes.slice(0, 6);
                const specialNum = codes[6];
                const specialWave = waves[6];
                const date = r.openTime.split(' ')[0];

                return (
                  <tr key={r.expect} className="border-b border-border/30 hover:bg-bg/50 transition-colors">
                    <td className="py-2 font-mono text-text-secondary text-xs">{r.expect}</td>
                    <td className="py-2 text-text-secondary text-xs">{date}</td>
                    <td className="py-2">
                      <div className="flex flex-wrap gap-0">
                        {flatNums.map((n, i) => (
                          <Ball key={i} num={n} wave={waves[i]} />
                        ))}
                      </div>
                    </td>
                    <td className="py-2 text-center">
                      <div className="flex items-center justify-center">
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
                          style={{
                            backgroundColor: specialWave === 'red' ? WAVE_COLOR_BG.red : specialWave === 'blue' ? WAVE_COLOR_BG.blue : WAVE_COLOR_BG.green,
                            color: specialWave === 'red' ? WAVE_COLOR_HEX.red : specialWave === 'blue' ? WAVE_COLOR_HEX.blue : WAVE_COLOR_HEX.green,
                            border: `2px solid ${specialWave === 'red' ? WAVE_COLOR_HEX.red : specialWave === 'blue' ? WAVE_COLOR_HEX.blue : WAVE_COLOR_HEX.green}`,
                          }}
                        >
                          {String(specialNum).padStart(2, '0')}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-xs text-text-secondary">
                      <div className="flex flex-wrap gap-1 max-w-[140px]">
                        {zodiacs.map((z, i) => (
                          <span
                            key={i}
                            className={`inline-block px-1 py-0 rounded text-[10px] ${i === 6 ? 'text-warning font-bold' : ''}`}
                          >
                            {z}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            className="p-1.5 rounded hover:bg-card disabled:opacity-30 transition cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-4 h-4 text-text-secondary" />
          </button>
          <span className="text-xs text-text-secondary font-mono px-3">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            className="p-1.5 rounded hover:bg-card disabled:opacity-30 transition cursor-pointer disabled:cursor-default"
          >
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
