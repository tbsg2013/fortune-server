// 星座与生肖
const SIGNS = [
  { name: '摩羯座', from: [12, 22], to: [1, 19], element: '土', ruler: '土星' },
  { name: '水瓶座', from: [1, 20], to: [2, 18], element: '风', ruler: '天王星' },
  { name: '双鱼座', from: [2, 19], to: [3, 20], element: '水', ruler: '海王星' },
  { name: '白羊座', from: [3, 21], to: [4, 19], element: '火', ruler: '火星' },
  { name: '金牛座', from: [4, 20], to: [5, 20], element: '土', ruler: '金星' },
  { name: '双子座', from: [5, 21], to: [6, 21], element: '风', ruler: '水星' },
  { name: '巨蟹座', from: [6, 22], to: [7, 22], element: '水', ruler: '月亮' },
  { name: '狮子座', from: [7, 23], to: [8, 22], element: '火', ruler: '太阳' },
  { name: '处女座', from: [8, 23], to: [9, 22], element: '土', ruler: '水星' },
  { name: '天秤座', from: [9, 23], to: [10, 23], element: '风', ruler: '金星' },
  { name: '天蝎座', from: [10, 24], to: [11, 22], element: '水', ruler: '冥王星' },
  { name: '射手座', from: [11, 23], to: [12, 21], element: '火', ruler: '木星' },
];
const SHENGXIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 生肖五行（按立春/农历年）
const SHENGXIAO_WX = { 鼠: '水', 牛: '土', 虎: '木', 兔: '木', 龙: '土', 蛇: '火', 马: '火', 羊: '土', 猴: '金', 鸡: '金', 狗: '土', 猪: '水' };

function dateToNum(m, d) {
  return m * 100 + d;
}

export function getSign({ year, month, day }) {
  const n = dateToNum(month, day);
  for (const s of SIGNS) {
    const from = dateToNum(s.from[0], s.from[1]);
    const to = dateToNum(s.to[0], s.to[1]);
    if (s.from[0] === 12 && s.to[0] === 1) {
      if (n >= from || n <= to) return s;
    } else if (n >= from && n <= to) {
      return s;
    }
  }
  return SIGNS[0];
}

export function getShengXiao(year) {
  // 以公历年份近似（立春前后会有一周误差，正式以农历为准）
  return SHENGXIAO[(year - 4) % 12];
}

export function zodiacInfo({ year, month, day }) {
  const sign = getSign({ year, month, day });
  const sx = getShengXiao(year);
  return {
    sign: sign.name,
    signElement: sign.element,
    signRuler: sign.ruler,
    shengXiao: sx,
    shengXiaoElement: SHENGXIAO_WX[sx],
  };
}
