import { Solar, LunarUtil } from 'lunar-javascript';

const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ZHI_YIN0 = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const PALACES = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '仆役', '官禄', '田宅', '福德', '父母'];

const NAYIN_WX = {
  '海中金': '金', '剑锋金': '金', '白蜡金': '金', '沙中金': '金', '金箔金': '金', '钗钏金': '金',
  '大林木': '木', '杨柳木': '木', '松柏木': '木', '平地木': '木', '桑柘木': '木', '石榴木': '木',
  '涧下水': '水', '泉中水': '水', '长流水': '水', '天河水': '水', '大溪水': '水', '大海水': '水',
  '炉中火': '火', '山头火': '火', '霹雳火': '火', '山下火': '火', '佛灯火': '火', '天上火': '火',
  '壁上土': '土', '城头土': '土', '沙中土': '土', '路旁土': '土', '大驿土': '土', '屋上土': '土',
};
const JU_SHU = { 金: 4, 木: 3, 水: 2, 火: 6, 土: 5 };

// 五行局 -> [起始宫(寅=0), 每日步数]
const ZIWEI_START = { 2: 11, 3: 2, 4: 9, 5: 4, 6: 7 }; // 水二局丑、木三局辰、金四局亥、土五局午、火六局酉

// 紫微位置 -> 天府位置 (寅=0索引)
const ZIWEI_TIANFU = [0, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10, 11]; // 紫微在寅->天府寅...丑->丑

const MAIN_STARS = [
  { name: '紫微', offset: 0 }, { name: '天机', offset: 1 }, { name: '太阳', offset: 2 },
  { name: '武曲', offset: 3 }, { name: '天同', offset: 4 }, { name: '廉贞', offset: 6 },
  { name: '天府', offset: 0, reverse: true }, { name: '太阴', offset: 1, reverse: true },
  { name: '贪狼', offset: 2, reverse: true }, { name: '巨门', offset: 3, reverse: true },
  { name: '天相', offset: 4, reverse: true }, { name: '天梁', offset: 5, reverse: true },
  { name: '七杀', offset: 6, reverse: true }, { name: '破军', offset: 8, reverse: true },
];

const KUIYUE = { 甲: ['丑', '未'], 戊: ['丑', '未'], 庚: ['丑', '未'], 乙: ['子', '申'], 己: ['子', '申'], 丙: ['亥', '酉'], 丁: ['亥', '酉'], 壬: ['卯', '巳'], 癸: ['卯', '巳'], 辛: ['午', '寅'] };
const LU_CUN = { 甲: '寅', 乙: '卯', 丙: '巳', 丁: '午', 戊: '巳', 己: '午', 庚: '申', 辛: '酉', 壬: '亥', 癸: '子' };
const HUOXING_START = { 寅: 11, 午: 11, 戌: 11, 申: 0, 子: 0, 辰: 0, 巳: 1, 酉: 1, 丑: 1, 亥: 7, 卯: 7, 未: 7 };
const LINGXING_START = { 寅: 1, 午: 1, 戌: 1, 申: 8, 子: 8, 辰: 8, 巳: 8, 酉: 8, 丑: 8, 亥: 8, 卯: 8, 未: 8 };
const TIANMA = { 寅: 6, 午: 6, 戌: 6, 申: 0, 子: 0, 辰: 0, 巳: 9, 酉: 9, 丑: 9, 亥: 3, 卯: 3, 未: 3 };

const SIHUA = {
  甲: { 禄: '廉贞', 权: '破军', 科: '武曲', 忌: '太阳' },
  乙: { 禄: '天机', 权: '天梁', 科: '紫微', 忌: '太阴' },
  丙: { 禄: '天同', 权: '天机', 科: '文昌', 忌: '廉贞' },
  丁: { 禄: '太阴', 权: '天同', 科: '天机', 忌: '巨门' },
  戊: { 禄: '贪狼', 权: '太阴', 科: '右弼', 忌: '天机' },
  己: { 禄: '武曲', 权: '贪狼', 科: '天梁', 忌: '文曲' },
  庚: { 禄: '太阳', 权: '武曲', 科: '太阴', 忌: '天同' },
  辛: { 禄: '巨门', 权: '太阳', 科: '文曲', 忌: '文昌' },
  壬: { 禄: '天梁', 权: '紫微', 科: '左辅', 忌: '武曲' },
  癸: { 禄: '破军', 权: '巨门', 科: '太阴', 忌: '贪狼' },
};

const MING_ZHU = { 子: '贪狼', 丑: '巨门', 亥: '巨门', 寅: '禄存', 戌: '禄存', 卯: '文曲', 酉: '文曲', 辰: '廉贞', 申: '廉贞', 巳: '武曲', 未: '武曲', 午: '破军' };
const SHEN_ZHU = { 子: '火星', 午: '火星', 丑: '天相', 未: '天相', 寅: '天梁', 申: '天梁', 卯: '天同', 酉: '天同', 辰: '文昌', 戌: '文昌', 巳: '天机', 亥: '天机' };

function mod12(n) {
  return ((n % 12) + 12) % 12;
}

export function calcZiWei({ year, month, day, hour, minute = 0, gender = '男' }) {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const lm = lunar.getMonth();
  const ld = lunar.getDay();
  const hourIdx = Math.floor(((hour + 1) % 24) / 2) % 12; // 子时=0
  const yearGan = lunar.getYearGan();
  const yearZhi = lunar.getYearZhi();
  const isMale = gender === '男';

  // 命宫 / 身宫 (寅=0)
  const mingIdx = mod12(lm - 1 - hourIdx);
  const shenIdx = mod12(lm - 1 + hourIdx);

  // 命宫干支 -> 五行局
  const yinGanIdx = (GAN.indexOf(yearGan) * 2 + 2) % 10;
  const mingGan = GAN[(yinGanIdx + mingIdx) % 10];
  const mingGanZhi = mingGan + ZHI_YIN0[mingIdx];
  const naYin = LunarUtil.NAYIN[mingGanZhi] || '';
  const juShu = JU_SHU[NAYIN_WX[naYin]] || 5;

  // 紫微位置
  const ziweiIdx = mod12(ZIWEI_START[juShu] + (ld - 1) * juShu);
  const tianfuIdx = ZIWEI_TIANFU[ziweiIdx];

  // 十四主星
  const starMap = {};
  for (const s of MAIN_STARS) {
    const base = s.name === '天府' || s.reverse ? tianfuIdx : ziweiIdx;
    const pos = s.reverse ? mod12(base - s.offset) : mod12(ziweiIdx + s.offset);
    starMap[s.name] = pos;
  }

  // 辅星
  const kuiYue = KUIYUE[yearGan] || ['丑', '未'];
  const luCunZhi = LU_CUN[yearGan] || '寅';
  const luCunIdx = ZHI_YIN0.indexOf(luCunZhi);
  const huoStart = HUOXING_START[yearZhi] ?? 0;
  const lingStart = LINGXING_START[yearZhi] ?? 8;

  const minorStars = {
    左辅: mod12(2 + (lm - 1) + hourIdx),
    右弼: mod12(8 - (lm - 1) - hourIdx),
    文昌: mod12(8 - hourIdx),
    文曲: mod12(2 + hourIdx),
    地空: mod12(9 - hourIdx),
    地劫: mod12(9 + hourIdx),
    天魁: ZHI_YIN0.indexOf(kuiYue[0]),
    天钺: ZHI_YIN0.indexOf(kuiYue[1]),
    禄存: luCunIdx,
    擎羊: mod12(luCunIdx + 1),
    陀罗: mod12(luCunIdx - 1),
    火星: mod12(huoStart + hourIdx),
    铃星: mod12(lingStart - hourIdx),
    天马: TIANMA[yearZhi] ?? 0,
  };

  // 四化
  const sh = SIHUA[yearGan] || {};
  const sihuaMap = { 禄: null, 权: null, 科: null, 忌: null };
  for (const k of Object.keys(sihuaMap)) {
    const starName = sh[k];
    if (starName) sihuaMap[k] = { star: starName, idx: starMap[starName] ?? null };
  }

  // 命主 / 身主
  const mingZhu = MING_ZHU[yearZhi] || '';
  const shenZhu = SHEN_ZHU[yearZhi] || '';

  // 十二宫
  const palaceMap = [];
  for (let i = 0; i < 12; i++) {
    const idx = mod12(mingIdx - i);
    const gan = GAN[(yinGanIdx + idx) % 10];
    palaceMap.push({ palace: PALACES[i], zhi: ZHI_YIN0[idx], gan, ganZhi: gan + ZHI_YIN0[idx], idx });
  }

  // 大限
  const yangYear = GAN.indexOf(yearGan) % 2 === 0;
  const forward = (yangYear && isMale) || (!yangYear && !isMale);
  const daXian = [];
  for (let i = 0; i < 12; i++) {
    const idx = forward ? mod12(mingIdx + i) : mod12(mingIdx - i);
    const p = palaceMap.find((x) => x.idx === idx);
    daXian.push({
      palace: p.palace,
      startAge: i * juShu + 1,
      endAge: (i + 1) * juShu,
    });
  }

  const boxes = [];
  for (let i = 0; i < 12; i++) {
    const p = palaceMap[i];
    const stars = [];
    for (const [name, idx] of Object.entries(starMap)) {
      if (idx === p.idx) stars.push({ name, kind: 'main' });
    }
    for (const [name, idx] of Object.entries(minorStars)) {
      if (idx === p.idx) stars.push({ name, kind: 'minor' });
    }
    const sx = ['禄', '权', '科', '忌'].filter((k) => sihuaMap[k] && sihuaMap[k].idx === p.idx).map((k) => ({ kind: k, star: sihuaMap[k].star }));
    const dax = daXian.find((d) => d.palace === p.palace);
    boxes.push({
      palace: p.palace,
      ganZhi: p.ganZhi,
      stars,
      sihua: sx,
      isMing: p.palace === '命宫',
      isShen: p.idx === shenIdx,
      daXian: dax ? dax.startAge + '-' + dax.endAge + '岁' : '',
    });
  }

  return {
    solar: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    lunar: `${lm}月${ld}日`,
    gender: isMale ? '男' : '女',
    hourZhi: ZHI[hourIdx],
    yearGanZhi: yearGan + yearZhi,
    mingGanZhi,
    naYin,
    juShu,
    mingZhu,
    shenZhu,
    forward,
    sihua: {
      禄: sihuaMap.禄 ? { star: sihuaMap.禄.star, palace: boxes.find((b) => b.stars.some((s) => s.name === sihuaMap.禄.star))?.palace || '' } : null,
      权: sihuaMap.权 ? { star: sihuaMap.权.star, palace: boxes.find((b) => b.stars.some((s) => s.name === sihuaMap.权.star))?.palace || '' } : null,
      科: sihuaMap.科 ? { star: sihuaMap.科.star, palace: boxes.find((b) => b.stars.some((s) => s.name === sihuaMap.科.star))?.palace || '' } : null,
      忌: sihuaMap.忌 ? { star: sihuaMap.忌.star, palace: boxes.find((b) => b.stars.some((s) => s.name === sihuaMap.忌.star))?.palace || '' } : null,
    },
    boxes,
  };
}

