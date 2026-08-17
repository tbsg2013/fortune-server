import { Solar } from 'lunar-javascript';

function pillar(p, ec) {
  const g = ec['get' + p + 'Gan']();
  const z = ec['get' + p + 'Zhi']();
  return {
    gan: g,
    zhi: z,
    ganzhi: g + z,
    hideGan: ec['get' + p + 'HideGan'](),
    shiShenGan: ec['get' + p + 'ShiShenGan'](),
    shiShenZhi: ec['get' + p + 'ShiShenZhi'](),
    naYin: ec['get' + p + 'NaYin'](),
  };
}

export function calcBazi({ year, month, day, hour, minute = 0, gender = '男' }) {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const isMale = gender === '男';

  const pillars = {
    year: pillar('Year', ec),
    month: pillar('Month', ec),
    day: pillar('Day', ec),
    time: pillar('Time', ec),
  };

  const GAN_WX = { 甲: '木', 乙: '木', 丙: '火', 丁: '火', 戊: '土', 己: '土', 庚: '金', 辛: '金', 壬: '水', 癸: '水' };
  const ZHI_WX = { 寅: '木', 卯: '木', 巳: '火', 午: '火', 申: '金', 酉: '金', 亥: '水', 子: '水', 辰: '土', 戌: '土', 丑: '土', 未: '土' };
  const wuxing = { 金: 0, 木: 0, 水: 0, 火: 0, 土: 0 };
  for (const p of Object.values(pillars)) {
    wuxing[GAN_WX[p.gan]]++;
    wuxing[ZHI_WX[p.zhi]]++;
    for (const hg of p.hideGan) wuxing[GAN_WX[hg]] += 0.5;
  }
  for (const k of Object.keys(wuxing)) wuxing[k] = Math.round(wuxing[k]);

  const yun = ec.getYun(isMale ? 1 : 0);
  const daYun = yun.getDaYun().map((d) => ({
    startYear: d.getStartYear(),
    endYear: d.getEndYear(),
    startAge: d.getStartAge(),
    endAge: d.getEndAge(),
    ganZhi: d.getGanZhi(),
    liuNian: d.getLiuNian().map((l) => ({
      year: l.getYear(),
      age: l.getAge(),
      ganZhi: l.getGanZhi(),
    })),
  }));

  return {
    solar: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    lunar: lunar.toString(),
    shengXiao: lunar.getYearShengXiao(),
    dayMaster: pillars.day.gan,
    gender: isMale ? '男' : '女',
    pillars,
    wuxing,
    wuxingMissing: Object.entries(wuxing).filter(([, v]) => v === 0).map(([k]) => k),
    yunInfo: {
      startYear: yun.getStartYear(),
      startMonth: yun.getStartMonth(),
      startDay: yun.getStartDay(),
      startSolar: yun.getStartSolar().toYmd(),
      forward: yun.isForward(),
    },
    daYun,
  };
}

