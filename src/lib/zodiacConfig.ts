// ── 波色 & 大小 ──
export type WaveColor = 'red' | 'blue' | 'green';

const RED_NUMBERS = new Set([1,2,7,8,12,13,18,19,23,24,29,30,34,35,40,45,46]);
const BLUE_NUMBERS = new Set([3,4,9,10,14,15,20,25,26,31,36,37,41,42,47,48]);
// green = rest

export function getWaveColor(n: number): WaveColor {
  if (RED_NUMBERS.has(n)) return 'red';
  if (BLUE_NUMBERS.has(n)) return 'blue';
  return 'green';
}

export function isBig(n: number): boolean { return n >= 25; }

export const WAVE_COLOR_HEX: Record<WaveColor, string> = {
  red: '#F6465D',
  blue: '#2B9AFF',
  green: '#0ECB81',
};

export const WAVE_COLOR_BG: Record<WaveColor, string> = {
  red: 'rgba(246,70,93,0.15)',
  blue: 'rgba(43,154,255,0.15)',
  green: 'rgba(14,203,129,0.15)',
};

export const WAVE_COLOR_BORDER: Record<WaveColor, string> = {
  red: 'rgba(246,70,93,0.35)',
  blue: 'rgba(43,154,255,0.35)',
  green: 'rgba(14,203,129,0.35)',
};

// ── 生肖 ──
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

/**
 * Generate prediction.
 * @param excludedZodiac - zodiac to exclude
 * @param trendZodiacs - zodiac keys with priority selection (trend analysis)
 * @param dateStr - optional, defaults to today. Used for backtesting historical dates.
 */
export function generatePrediction(excludedZodiac: string, trendZodiacs?: string[], dateStr?: string): Prediction {
  if (!dateStr) {
    const today = new Date();
    dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }
  const seed = `${dateStr}:${excludedZodiac}`;

  const available = ZODIAC_KEYS.filter(k => k !== excludedZodiac);

  // Priority pool: trend zodiacs go first
  const priority = (trendZodiacs ?? []).filter(k => available.includes(k));
  const normal = available.filter(k => !priority.includes(k));

  const selected: string[] = [];

  // Select up to 3 from trend-priority pool
  let h = simpleHash(seed);
  for (let i = 0; i < 3 && priority.length > 0; i++) {
    const idx = h % priority.length;
    const pick = priority.splice(idx, 1)[0];
    if (pick && !selected.includes(pick)) {
      selected.push(pick);
    }
    h = (h * 1103515245 + 12345) & 0x7fffffff;
  }

  // Fill remaining from all available
  const remaining = available.filter(k => !selected.includes(k));
  let safety = 0;
  while (selected.length < 4 && safety < 200) {
    const idx = h % remaining.length;
    if (!selected.includes(remaining[idx])) {
      selected.push(remaining[idx]);
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

// ── 每日玄机诗 ──
export interface DailyPoem {
  lines: string[];
  source: string;
}

export const DAILY_POEMS: DailyPoem[] = [
  { lines: ['三更明月照高楼，', '紫微星动破云游。', '欲识玄机真妙处，', '一七之中看水流。'], source: '曾道人' },
  { lines: ['金风玉露相逢时，', '南国秋色映碧池。', '四九分明观正路，', '二三合七定乾坤。'], source: '曾道人' },
  { lines: ['东风吹柳日迟迟，', '独倚阑干看落花。', '数中藏有玄机在，', '一二三八定天涯。'], source: '白小姐' },
  { lines: ['龙腾虎跃风云起，', '金戈铁马入梦来。', '五湖四海皆兄弟，', '单数双对细安排。'], source: '曾道人' },
  { lines: ['花开富贵满堂春，', '绿柳枝头映日新。', '七数相连成大器，', '合三四六定输赢。'], source: '白小姐' },
  { lines: ['月挂梧桐影正斜，', '银河星斗转无涯。', '玄机藏在三四位，', '八九相逢是一家。'], source: '曾道人' },
  { lines: ['暮雨萧萧落花天，', '寒鸦栖树夜无眠。', '六彩纷飞如有意，', '一五相连入画篇。'], source: '白小姐' },
  { lines: ['春风得意马蹄疾，', '一日看尽长安花。', '奇数偶数各有序，', '蓝红交替映彩霞。'], source: '刘伯温' },
  { lines: ['孤帆远影碧空尽，', '唯见长江天际流。', '波色分明三五对，', '大数藏机在末头。'], source: '曾道人' },
  { lines: ['天机不可尽泄也，', '地脉须知暗中通。', '五行生克有定数，', '九六相逢必中宫。'], source: '刘伯温' },
  { lines: ['碧水青山映晓霞，', '春风吹柳万千枝。', '偶数为先奇在后，', '七九相逢定有期。'], source: '白小姐' },
  { lines: ['朱雀桥边野草花，', '乌衣巷口夕阳斜。', '旧时王谢堂前燕，', '飞入寻常百姓家。'], source: '曾道人' },
  { lines: ['银汉无声玉漏残，', '秋风画扇烛影寒。', '二三合五藏妙理，', '七九同宫必开颜。'], source: '白小姐' },
  { lines: ['千里黄云白日曛，', '北风吹雁雪纷纷。', '莫道前路无知己，', '天下谁人不识君。'], source: '刘伯温' },
  { lines: ['春江潮水连海平，', '海上明月共潮生。', '四七相连藏玉兔，', '二八一六照前程。'], source: '曾道人' },
  { lines: ['大漠孤烟直上云，', '长河落日圆如金。', '五八相逢真妙极，', '二四分明看正身。'], source: '刘伯温' },
  { lines: ['绿蚁新醅酒一杯，', '红泥小火炉初开。', '波色分明三五行，', '六九同宫待客来。'], source: '白小姐' },
  { lines: ['明月松间照清泉，', '石上清流映九天。', '三五相连成大势，', '一二八数定真篇。'], source: '曾道人' },
  { lines: ['日照香炉生紫烟，', '遥看瀑布挂前川。', '四六分明藏大势，', '二三合五是真传。'], source: '白小姐' },
  { lines: ['远上寒山石径斜，', '白云深处有人家。', '偶奇交替藏深意，', '七九同路到天涯。'], source: '刘伯温' },
  { lines: ['离离原上草一岁，', '一枯一荣又一春。', '五行相生相克理，', '六八相逢必成真。'], source: '曾道人' },
  { lines: ['举杯邀明月对影，', '成三人独酌无亲。', '蓝波三数藏真穴，', '红绿交织映乾坤。'], source: '白小姐' },
  { lines: ['空山不见人踪影，', '但闻人语响深林。', '一三七九藏妙理，', '五八相生定输赢。'], source: '刘伯温' },
  { lines: ['风急天高猿啸哀，', '渚清沙白鸟飞回。', '数中分明看大势，', '二六相逢在一堆。'], source: '白小姐' },
  { lines: ['落霞与孤鹜齐飞，', '秋水共长天一色。', '三五同宫藏玉兔，', '二八分明定有无。'], source: '曾道人' },
  { lines: ['黄河远上白云间，', '一片孤城万仞山。', '四九分明观正路，', '奇偶交错定关山。'], source: '刘伯温' },
  { lines: ['朝辞白帝彩云间，', '千里江陵一日还。', '三五七九藏妙理，', '二四六八照人寰。'], source: '白小姐' },
  { lines: ['独在异乡为异客，', '每逢佳节倍思亲。', '二五八数藏玄妙，', '六九相合必如神。'], source: '曾道人' },
  { lines: ['青山遮不住毕竟，', '东流到海不复回。', '波色三行藏大势，', '大小分明定吉凶。'], source: '刘伯温' },
  { lines: ['烟笼寒水月笼沙，', '夜泊秦淮近酒家。', '四七相连看走势，', '一三五七定归家。'], source: '白小姐' },
  { lines: ['红豆生南国春来，', '此物最是相思客。', '三六九数藏深意，', '二四八位看明白。'], source: '曾道人' },
  { lines: ['海内存知己天涯，', '若比邻无不相亲。', '奇偶交替藏真妙，', '七九相连满盘春。'], source: '刘伯温' },
  { lines: ['两个黄鹂鸣翠柳，', '一行白鹭上青天。', '四六相连成大势，', '二三合五定周全。'], source: '白小姐' },
  { lines: ['山重水复疑无路，', '柳暗花明又一村。', '五八相生藏妙理，', '一七三四定乾坤。'], source: '刘伯温' },
  { lines: ['昨夜星辰昨夜风，', '画楼西畔桂堂东。', '波色分明三五行，', '六九相逢立大功。'], source: '曾道人' },
  { lines: ['锦瑟无端五十弦，', '一弦一柱思华年。', '三四六八藏深意，', '二七五九定真元。'], source: '白小姐' },
  { lines: ['春城无处不飞花，', '寒食东风御柳斜。', '二四六八看好势，', '三五七九必到家。'], source: '曾道人' },
  { lines: ['天街小雨润如酥，', '草色遥看近却无。', '五八相连藏妙理，', '七九同宫定不虚。'], source: '刘伯温' },
  { lines: ['清明时节雨纷纷，', '路上行人欲断魂。', '偶奇交替藏大势，', '七九相合看输赢。'], source: '白小姐' },
  { lines: ['野火烧不尽春风，', '春风吹又生满地。', '四七相连藏大势，', '二三合五是真谛。'], source: '刘伯温' },
  { lines: ['枯藤老树昏鸦飞，', '小桥流水人家晚。', '六九分明看奇偶，', '三四同宫定双全。'], source: '白小姐' },
  { lines: ['长风破浪会有时，', '直挂云帆济沧海。', '五八相连藏大势，', '一二七数定三才。'], source: '刘伯温' },
  { lines: ['月落乌啼霜满天，', '江枫渔火对愁眠。', '二四六八成大势，', '三五七九看前缘。'], source: '曾道人' },
  { lines: ['白日依山尽黄河，', '入海流欲穷千里。', '一波三折藏玄妙，', '七九同宫照天门。'], source: '白小姐' },
  { lines: ['飞流直下三千尺，', '疑是银河落九天。', '四六分明藏玉兔，', '二八相连定山川。'], source: '刘伯温' },
  { lines: ['松下问童子言师，', '采药去只在此山。', '三五七九藏妙理，', '偶奇交替不等闲。'], source: '曾道人' },
  { lines: ['海上生明月天涯，', '共此时情人怨遥。', '四九相连成大势，', '二六八数定周全。'], source: '白小姐' },
  { lines: ['春蚕到死丝方尽，', '蜡炬成灰泪始干。', '波色分明看走势，', '一三五七定不难。'], source: '刘伯温' },
  { lines: ['停车坐爱枫林晚，', '霜叶红于二月花。', '六九相生藏妙理，', '二三合五是真家。'], source: '曾道人' },
  { lines: ['葡萄美酒夜光杯，', '欲饮琵琶马上催。', '四七相连看好势，', '二五八数待春回。'], source: '白小姐' },
  { lines: ['大江东去浪淘尽，', '千古风流人物多。', '三五七九藏大势，', '奇偶交替定风波。'], source: '刘伯温' },
  { lines: ['寻寻觅觅冷冷清，', '凄凄惨惨戚戚中。', '二四六八藏玄妙，', '一三七九定真功。'], source: '白小姐' },
  { lines: ['千山鸟飞绝万径，', '人踪灭孤舟蓑笠。', '五八相生看奇偶，', '三四六七定全功。'], source: '曾道人' },
  { lines: ['国破山河在城春，', '草木深感时花溅。', '四六分明藏大势，', '二三合五照前程。'], source: '刘伯温' },
  { lines: ['春风又绿江南岸，', '明月何时照我还。', '七九相连藏妙理，', '二四六八定安然。'], source: '白小姐' },
  { lines: ['会当凌绝顶一览', '众山小胸中藏万', '三五七九观正路', '奇偶交替定大权'], source: '曾道人' },
  { lines: ['露从今夜白月是', '故乡明有弟皆分', '四七相连成大势', '二五八数定分明'], source: '白小姐' },
  { lines: ['无边落木萧萧下', '不尽长江滚滚来', '六九相生藏妙理', '一二八数照花开'], source: '刘伯温' },
  { lines: ['烽火连三月家书', '抵万金白头搔更', '三五七九藏大势', '二四六八定乾坤'], source: '曾道人' },
  { lines: ['人生得意须尽欢', '莫使金樽空对月', '波色分明三五行', '七九相逢满堂悦'], source: '白小姐' },
  { lines: ['天生我材必有用', '千金散尽还复来', '四六相连藏大势', '二三合五定天开'], source: '刘伯温' },
  { lines: ['窗含西岭千秋雪', '门泊东吴万里船', '一三五七藏妙理', '二四六八定前缘'], source: '曾道人' },
  { lines: ['随风潜入夜润物', '细无声野径云俱', '五八相生看奇偶', '七九同宫照乾坤'], source: '白小姐' },
  { lines: ['谁言寸草心报得', '三春晖慈母手中线', '二四六八成大势', '三五七九定真元'], source: '刘伯温' },
  { lines: ['采菊东篱下悠然', '见南山山气日夕', '四七相连藏妙理', '一二八九定不偏'], source: '曾道人' },
  { lines: ['少小离家老大回', '乡音无改鬓毛衰', '六九相生看走势', '二三合五定生财'], source: '白小姐' },
  { lines: ['忽如一夜春风来', '千树万树梨花开', '三五七九藏大势', '偶奇交替定良才'], source: '刘伯温' },
  { lines: ['竹外桃花三两枝', '春江水暖鸭先知', '四六分明藏大势', '二五八数待时知'], source: '曾道人' },
  { lines: ['但愿人长久千里', '共婵娟明月几时', '七九相逢藏妙理', '一三五七定归期'], source: '白小姐' },
  { lines: ['浮云游子意落日', '故人情挥手自兹', '二四六八藏大势', '五八同宫照前程'], source: '刘伯温' },
  { lines: ['欲穷千里目更上', '一层楼黄河入海流', '三五七九藏妙理', '偶奇交替不须愁'], source: '曾道人' },
  { lines: ['两岸猿声啼不住', '轻舟已过万重山', '四六分明看好势', '二七五九定通关'], source: '白小姐' },
  { lines: ['床前明月光疑是', '地上霜举头望明', '一三五七藏大势', '四六八数定成双'], source: '刘伯温' },
  { lines: ['锄禾日当午汗滴', '禾下土谁知盘中', '五八相生成大势', '二三合五照前途'], source: '曾道人' },
  { lines: ['日出江花红胜火', '春来江水绿如蓝', '七九相连藏妙理', '二四六八定周全'], source: '白小姐' },
  { lines: ['不识庐山真面目', '只缘身在此山中', '三五七九观大势', '奇偶交替定真功'], source: '刘伯温' },
  { lines: ['接天莲叶无穷碧', '映日荷花别样红', '四六分明藏玉兔', '二五八九照清风'], source: '曾道人' },
  { lines: ['等闲识得东风面', '万紫千红总是春', '一三五七成大势', '二四六八定家门'], source: '白小姐' },
  { lines: ['山外青山楼外楼', '西湖歌舞几时休', '五八相生藏妙理', '七九同宫定无忧'], source: '刘伯温' },
  { lines: ['水光潋滟晴方好', '山色空蒙雨亦奇', '二四六八看好势', '三五七九定无疑'], source: '曾道人' },
  { lines: ['小荷才露尖尖角', '早有蜻蜓立上头', '四七相连成大势', '一三八数定先筹'], source: '白小姐' },
  { lines: ['问渠那得清如许', '为有源头活水来', '六九相生看奇偶', '二三合五照天台'], source: '刘伯温' },
  { lines: ['满园春色关不住', '一枝红杏出墙来', '三五七九藏大势', '偶奇交替定花开'], source: '曾道人' },
  { lines: ['黑云翻墨未遮山', '白雨跳珠乱入船', '四六分明看好势', '二五八九定平安'], source: '白小姐' },
  { lines: ['春色满园关不住', '一枝红杏出墙来', '一三五七藏妙理', '二四六八定重来'], source: '刘伯温' },
  { lines: ['横看成岭侧成峰', '远近高低各不同', '五八相生成大势', '七九同宫定成功'], source: '曾道人' },
  { lines: ['月落星沉天欲明', '东方破晓露华浓', '二四六八看好势', '三五七九定飞龙'], source: '白小姐' },
  { lines: ['凤凰台上凤凰游', '凤去台空江自流', '四七相连藏妙理', '二六八九照神州'], source: '刘伯温' },
  { lines: ['晴川历历汉阳树', '芳草萋萋鹦鹉洲', '一三五七成大势', '偶奇交替定金秋'], source: '曾道人' },
  { lines: ['白云千载空悠悠', '晴川历历汉阳树', '五八相生看走势', '七九同宫照前途'], source: '白小姐' },
  { lines: ['春风一度花开尽', '满园红紫斗芳菲', '二四六八藏大势', '三五七九定齐眉'], source: '刘伯温' },
  { lines: ['玉露初凝秋水寒', '银河横跨映远山', '四七相连藏妙理', '一三八数定通关'], source: '曾道人' },
  { lines: ['独钓寒江雪中行', '孤舟蓑笠任平生', '六九相生成大势', '二三合五照前程'], source: '白小姐' },
  { lines: ['龙吟虎啸风云起', '万里长空展翅飞', '三五七九藏妙理', '偶奇交替定光辉'], source: '刘伯温' },
  { lines: ['花开花落自有时', '春夏秋冬四季更', '四六分明看好势', '二五八九定三生'], source: '曾道人' },
  { lines: ['一叶知秋天下凉', '层林尽染映斜阳', '五八相生藏大势', '七九同宫定吉祥'], source: '白小姐' },
  { lines: ['星河璀璨映九州', '皓月当空照不休', '二四六八成大势', '一三七九定春秋'], source: '刘伯温' },
  { lines: ['金乌西坠玉兔升', '昼夜轮回转不停', '四七相连看走势', '二三合五定输赢'], source: '曾道人' },
  { lines: ['乾坤有序万物生', '阴阳交替定分明', '三五七九藏妙理', '偶奇交替定功成'], source: '白小姐' },
  { lines: ['凤凰涅槃浴火生', '一鸣惊人动九城', '四六八数观大势', '二五七九定长生'], source: '曾道人' },
];

export function getDailyPoem(): DailyPoem {
  const today = new Date();
  const seed = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) + hash + seed.charCodeAt(i)) & 0x7fffffff;
  }
  return DAILY_POEMS[hash % DAILY_POEMS.length];
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
