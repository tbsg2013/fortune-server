import { Solar } from 'lunar-javascript';

const TRIGRAM_BIT = { 乾: 0b111, 兑: 0b011, 离: 0b101, 震: 0b001, 巽: 0b110, 坎: 0b010, 艮: 0b100, 坤: 0b000 };
const BIT_TRIGRAM = {};
for (const [k, v] of Object.entries(TRIGRAM_BIT)) BIT_TRIGRAM[v] = k;

// 周易六十四卦：卦序 -> [名, 上卦, 下卦, 卦辞]
const HEXAGRAMS = {
  1: ['乾', '乾', '乾', '元亨利贞'],
  2: ['坤', '坤', '坤', '元亨，利牝马之贞'],
  3: ['屯', '坎', '震', '元亨利贞，勿用有攸往，利建侯'],
  4: ['蒙', '艮', '坎', '亨。匪我求童蒙，童蒙求我'],
  5: ['需', '坎', '乾', '有孚，光亨，贞吉。利涉大川'],
  6: ['讼', '乾', '坎', '有孚窒惕，中吉，终凶。利见大人，不利涉大川'],
  7: ['师', '坤', '坎', '贞，丈人吉，无咎'],
  8: ['比', '坎', '坤', '吉。原筮，元永贞，无咎'],
  9: ['小畜', '巽', '乾', '亨。密云不雨，自我西郊'],
  10: ['履', '乾', '兑', '履虎尾，不咥人，亨'],
  11: ['泰', '坤', '乾', '小往大来，吉亨'],
  12: ['否', '乾', '坤', '否之匪人，不利君子贞，大往小来'],
  13: ['同人', '乾', '离', '同人于野，亨。利涉大川，利君子贞'],
  14: ['大有', '离', '乾', '元亨'],
  15: ['谦', '坤', '艮', '亨，君子有终'],
  16: ['豫', '震', '坤', '利建侯行师'],
  17: ['随', '兑', '震', '元亨利贞，无咎'],
  18: ['蛊', '艮', '巽', '元亨，利涉大川。先甲三日，后甲三日'],
  19: ['临', '坤', '兑', '元亨利贞。至于八月有凶'],
  20: ['观', '巽', '坤', '盥而不荐，有孚颙若'],
  21: ['噬嗑', '离', '震', '亨。利用狱'],
  22: ['贲', '艮', '离', '亨。小利有攸往'],
  23: ['剥', '艮', '坤', '不利有攸往'],
  24: ['复', '坤', '震', '亨。出入无疾，朋来无咎'],
  25: ['无妄', '乾', '震', '元亨利贞。其匪正有眚，不利有攸往'],
  26: ['大畜', '艮', '乾', '利贞。不家食吉，利涉大川'],
  27: ['颐', '艮', '震', '贞吉。观颐，自求口实'],
  28: ['大过', '兑', '巽', '栋桡。利有攸往，亨'],
  29: ['坎', '坎', '坎', '习坎，有孚，维心亨，行有尚'],
  30: ['离', '离', '离', '利贞，亨。畜牝牛，吉'],
  31: ['咸', '兑', '艮', '亨，利贞。取女吉'],
  32: ['恒', '震', '巽', '亨，无咎，利贞。利有攸往'],
  33: ['遁', '乾', '艮', '亨。小利贞'],
  34: ['大壮', '震', '乾', '利贞'],
  35: ['晋', '离', '坤', '康侯用锡马蕃庶，昼日三接'],
  36: ['明夷', '坤', '离', '利艰贞'],
  37: ['家人', '巽', '离', '利女贞'],
  38: ['睽', '离', '兑', '小事吉'],
  39: ['蹇', '坎', '艮', '利西南，不利东北。利见大人，贞吉'],
  40: ['解', '震', '坎', '利西南。无所往，其来复吉。有攸往，夙吉'],
  41: ['损', '艮', '兑', '有孚，元吉，无咎，可贞，利有攸往'],
  42: ['益', '巽', '震', '利有攸往，利涉大川'],
  43: ['夬', '兑', '乾', '扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往'],
  44: ['姤', '乾', '巽', '女壮，勿用取女'],
  45: ['萃', '兑', '坤', '亨。王假有庙，利见大人，亨，利贞'],
  46: ['升', '坤', '巽', '元亨。用见大人，勿恤，南征吉'],
  47: ['困', '兑', '坎', '亨，贞，大人吉，无咎。有言不信'],
  48: ['井', '坎', '巽', '改邑不改井，无丧无得。往来井井'],
  49: ['革', '兑', '离', '巳日乃孚，元亨利贞，悔亡'],
  50: ['鼎', '离', '巽', '元吉，亨'],
  51: ['震', '震', '震', '亨。震来虩虩，笑言哑哑'],
  52: ['艮', '艮', '艮', '艮其背，不获其身；行其庭，不见其人，无咎'],
  53: ['渐', '巽', '艮', '女归吉，利贞'],
  54: ['归妹', '震', '兑', '征凶，无攸利'],
  55: ['丰', '震', '离', '亨，王假之。勿忧，宜日中'],
  56: ['旅', '离', '艮', '小亨，旅贞吉'],
  57: ['巽', '巽', '巽', '小亨。利有攸往，利见大人'],
  58: ['兑', '兑', '兑', '亨，利贞'],
  59: ['涣', '巽', '坎', '亨。王假有庙，利涉大川，利贞'],
  60: ['节', '坎', '兑', '亨。苦节，不可贞'],
  61: ['中孚', '巽', '兑', '豚鱼吉。利涉大川，利贞'],
  62: ['小过', '震', '艮', '亨，利贞。可小事，不可大事'],
  63: ['既济', '坎', '离', '亨小，利贞。初吉终乱'],
  64: ['未济', '离', '坎', '亨。小狐汔济，濡其尾，无攸利'],
};

// 纳支表：八卦 -> {内:[初,二,三], 外:[四,五,六]}（子=0索引）
const NAZHI = {
  乾: { 内: [0, 2, 4], 外: [6, 8, 10] },
  坤: { 内: [7, 5, 3], 外: [1, 11, 9] },
  震: { 内: [0, 2, 4], 外: [6, 8, 10] },
  巽: { 内: [1, 11, 9], 外: [7, 5, 3] },
  坎: { 内: [2, 4, 6], 外: [8, 10, 0] },
  离: { 内: [3, 1, 11], 外: [9, 7, 5] },
  艮: { 内: [4, 6, 8], 外: [10, 0, 2] },
  兑: { 内: [5, 3, 1], 外: [11, 9, 7] },
};
const NAGAN = { 乾: ['甲', '壬'], 坤: ['乙', '癸'], 震: ['庚', '庚'], 巽: ['辛', '辛'], 坎: ['戊', '戊'], 离: ['己', '己'], 艮: ['丙', '丙'], 兑: ['丁', '丁'] };
const GONG_WX = { 乾: '金', 兑: '金', 离: '火', 震: '木', 巽: '木', 坎: '水', 艮: '土', 坤: '土' };
const ZHI_WX = { 子: '水', 亥: '水', 寅: '木', 卯: '木', 巳: '火', 午: '火', 申: '金', 酉: '金', 辰: '土', 戌: '土', 丑: '土', 未: '土' };
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENG_WO = { 金: '土', 木: '水', 水: '金', 火: '木', 土: '火' };
const WO_SHENG = { 金: '水', 木: '火', 水: '木', 火: '土', 土: '金' };
const WO_KE = { 金: '木', 木: '土', 水: '火', 火: '金', 土: '水' };
const SHEN_SIX = {
  甲: ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'], 己: ['青龙', '朱雀', '勾陈', '螣蛇', '白虎', '玄武'],
  乙: ['朱雀', '勾陈', '螣蛇', '白虎', '玄武', '青龙'], 庚: ['朱雀', '勾陈', '螣蛇', '白虎', '玄武', '青龙'],
  丙: ['勾陈', '螣蛇', '白虎', '玄武', '青龙', '朱雀'], 辛: ['勾陈', '螣蛇', '白虎', '玄武', '青龙', '朱雀'],
  丁: ['螣蛇', '白虎', '玄武', '青龙', '朱雀', '勾陈'], 壬: ['螣蛇', '白虎', '玄武', '青龙', '朱雀', '勾陈'],
  戊: ['白虎', '玄武', '青龙', '朱雀', '勾陈', '螣蛇'], 癸: ['白虎', '玄武', '青龙', '朱雀', '勾陈', '螣蛇'],
};

function qin(gongWx, zhi) {
  const wz = ZHI_WX[zhi];
  if (wz === gongWx) return '兄弟';
  if (SHENG_WO[gongWx] === wz) return '父母';
  if (WO_SHENG[gongWx] === wz) return '子孙';
  if (WO_KE[gongWx] === wz) return '妻财';
  return '官鬼';
}

function tossLine() {
  const coins = [0, 1, 2].map(() => (Math.random() < 0.5 ? 3 : 2));
  return coins.reduce((a, b) => a + b, 0);
}

const SHI_MAP = { 0: 6, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 4, 7: 3 };
const BIAN_NAME = { 0: '本宫卦', 1: '一世卦', 2: '二世卦', 3: '三世卦', 4: '四世卦', 5: '五世卦', 6: '游魂卦', 7: '归魂卦' };

function genHex(p, type) {
  let h = TRIGRAM_BIT[p] | (TRIGRAM_BIT[p] << 3);
  const flip = (bits) => { for (const b of bits) h ^= 1 << b; };
  if (type === 1) flip([0]);
  else if (type === 2) flip([0, 1]);
  else if (type === 3) flip([0, 1, 2]);
  else if (type === 4) flip([0, 1, 2, 3]);
  else if (type === 5) flip([0, 1, 2, 3, 4]);
  else if (type === 6) flip([0, 1, 2, 4]);
  else if (type === 7) flip([4]);
  return h;
}

export function calcLiuYao({ lines, year, month, day, hour, minute = 0, question = '' }) {
  const liuYao = lines && lines.length === 6 ? lines : [0, 1, 2, 3, 4, 5].map(() => tossLine());
  let ben = 0;
  const baseLines = liuYao.map((v) => (v === 7 || v === 9 ? 1 : 0));
  for (let i = 0; i < 6; i++) if (baseLines[i]) ben |= 1 << i;
  let bian = ben;
  for (let i = 0; i < 6; i++) if (liuYao[i] === 6 || liuYao[i] === 9) bian ^= 1 << i;

  const lower = BIT_TRIGRAM[ben & 0b111];
  const upper = BIT_TRIGRAM[(ben >> 3) & 0b111];
  const lowerBian = BIT_TRIGRAM[bian & 0b111];
  const upperBian = BIT_TRIGRAM[(bian >> 3) & 0b111];

  const findHex = (u, l) => {
    for (const [num, h] of Object.entries(HEXAGRAMS)) {
      if (h[1] === u && h[2] === l) return { num: Number(num), name: h[0], guaci: h[3] };
    }
    return { num: 0, name: '', guaci: '' };
  };
  const benHex = findHex(upper, lower);
  const bianHex = findHex(upperBian, lowerBian);

  const palaceOrder = ['乾', '坎', '艮', '震', '巽', '离', '坤', '兑'];
  let palace = '';
  let shi = 6;
  let bianType = '';
  outer: for (const p of palaceOrder) {
    for (let t = 0; t < 8; t++) {
      if (genHex(p, t) === ben) {
        palace = p;
        shi = SHI_MAP[t];
        bianType = BIAN_NAME[t];
        break outer;
      }
    }
  }

  const ying = ((shi + 2) % 6) + 1;
  const gongWx = GONG_WX[palace] || '';
  const dayGan = year && month && day ? Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar().getDayGan() : '甲';
  const sixShen = SHEN_SIX[dayGan] || SHEN_SIX.甲;

  const lineInfo = [];
  for (let i = 0; i < 6; i++) {
    const pos = i; // 0=初爻
    const ganZhi = pos < 3 ? NAZHI[lower].内[pos] : NAZHI[upper].外[pos - 3];
    const gan = pos < 3 ? NAGAN[lower][0] : NAGAN[upper][1];
    lineInfo.push({
      line: ['初', '二', '三', '四', '五', '上'][pos] + (pos === 5 ? '爻' : '爻'),
      yang: baseLines[i] === 1,
      moving: liuYao[i] === 6 || liuYao[i] === 9,
      value: liuYao[i],
      gan,
      zhi: ZHI[ganZhi],
      qinShen: qin(gongWx, ZHI[ganZhi]),
      sixShen: sixShen[pos],
      shi: shi === pos + 1,
      ying: ying === pos + 1,
    });
  }

  return {
    question,
    benHex,
    bianHex,
    palace,
    bianType,
    shi,
    ying,
    gongWx,
    dayGan,
    movingLines: lineInfo.filter((l) => l.moving).map((l) => l.line),
    lines: lineInfo,
    gua: { name: benHex.name, guaci: benHex.guaci },
    bianGua: { name: bianHex.name, guaci: bianHex.guaci },
  };
}

