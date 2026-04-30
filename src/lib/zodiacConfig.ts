export interface ZodiacInfo {
  cn: string;
  en: string;
  emoji: string;
  numbers: number[];
}

export const ZODIAC_MAP: Record<string, ZodiacInfo> = {
  horse:   { cn: '马', en: 'Horse',   emoji: '🐴', numbers: [1, 13, 25, 37, 49] },
  snake:   { cn: '蛇', en: 'Snake',   emoji: '🐍', numbers: [2, 14, 26, 38] },
  dragon:  { cn: '龙', en: 'Dragon',  emoji: '🐉', numbers: [3, 15, 27, 39] },
  rabbit:  { cn: '兔', en: 'Rabbit',  emoji: '🐰', numbers: [4, 16, 28, 40] },
  tiger:   { cn: '虎', en: 'Tiger',  emoji: '🐯', numbers: [5, 17, 29, 41] },
  ox:      { cn: '牛', en: 'Ox',      emoji: '🐂', numbers: [6, 18, 30, 42] },
  rat:     { cn: '鼠', en: 'Rat',     emoji: '🐀', numbers: [7, 19, 31, 43] },
  pig:     { cn: '猪', en: 'Pig',     emoji: '🐷', numbers: [8, 20, 32, 44] },
  dog:     { cn: '狗', en: 'Dog',     emoji: '🐕', numbers: [9, 21, 33, 45] },
  rooster: { cn: '鸡', en: 'Rooster', emoji: '🐓', numbers: [10, 22, 34, 46] },
  monkey:  { cn: '猴', en: 'Monkey',  emoji: '🐵', numbers: [11, 23, 35, 47] },
  goat:    { cn: '羊', en: 'Goat',     emoji: '🐑', numbers: [12, 24, 36, 48] },
};

export const ZODIAC_KEYS = Object.keys(ZODIAC_MAP);

export interface Prediction {
  selectedZodiacs: string[];
  flatCodes: number[];
}

function simpleHash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

export function generatePrediction(excludedZodiac: string): Prediction {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const seed = `${dateStr}:${excludedZodiac}`;

  const available = ZODIAC_KEYS.filter(k => k !== excludedZodiac);

  const selected: string[] = [];
  let h = simpleHash(seed);
  let safety = 0;
  while (selected.length < 4 && safety < 200) {
    const idx = h % available.length;
    if (!selected.includes(available[idx])) {
      selected.push(available[idx]);
    }
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    safety++;
  }

  const zodiacNumbers = new Set(selected.flatMap(k => ZODIAC_MAP[k].numbers));
  const pool = Array.from({ length: 49 }, (_, i) => i + 1).filter(n => !zodiacNumbers.has(n));

  const flatCodes: number[] = [];
  h = simpleHash(seed + ':flat');
  safety = 0;
  while (flatCodes.length < 6 && safety < 200) {
    const idx = h % pool.length;
    if (!flatCodes.includes(pool[idx])) {
      flatCodes.push(pool[idx]);
    }
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    safety++;
  }

  return { selectedZodiacs: selected, flatCodes: flatCodes.sort((a, b) => a - b) };
}

export interface HistoryRecord {
  period: string;
  date: string;
  prediction: string;
  result: string;
  won: boolean;
}

export const HISTORY_DATA: HistoryRecord[] = [
  { period: '202604129', date: '2026-04-29', prediction: '龙 03·15·27·39', result: '27', won: true },
  { period: '202604128', date: '2026-04-28', prediction: '鼠 07·19·31·43', result: '31', won: true },
  { period: '202604127', date: '2026-04-27', prediction: '羊 12·24·36·48', result: '12', won: true },
  { period: '202604126', date: '2026-04-26', prediction: '虎 05·17·29·41', result: '08', won: false },
  { period: '202604125', date: '2026-04-25', prediction: '蛇 02·14·26·38', result: '26', won: true },
  { period: '202604124', date: '2026-04-24', prediction: '狗 09·21·33·45', result: '33', won: true },
  { period: '202604123', date: '2026-04-23', prediction: '猴 11·23·35·47', result: '11', won: true },
  { period: '202604122', date: '2026-04-22', prediction: '兔 04·16·28·40', result: '04', won: true },
  { period: '202604121', date: '2026-04-21', prediction: '猪 08·20·32·44', result: '22', won: false },
  { period: '202604120', date: '2026-04-20', prediction: '牛 06·18·30·42', result: '18', won: true },
];
