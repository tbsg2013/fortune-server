// 小六壬占卜：月上起日、日上起时
const POSITIONS = [
  { name: '大安', luck: '吉', element: '木', meaning: '身不动时，属木青龙。凡事主平安、顺遂，谋事可成，出行安稳，失物在东方。' },
  { name: '留连', luck: '凶', element: '水', meaning: '卒未归时，属水玄武。凡事主拖延、反复，去留难定，事宜缓不宜急。' },
  { name: '速喜', luck: '吉', element: '火', meaning: '人便至时，属火朱雀。凡事主快速、喜讯，谋事有成，行人有信，喜事在南方。' },
  { name: '赤口', luck: '凶', element: '金', meaning: '官事凶时，属金白虎。凡事主口舌、是非，官讼防凶，出行需慎，失物在西方。' },
  { name: '小吉', luck: '吉', element: '水', meaning: '人来喜时，属水六合。凡事主和合、顺利，谋事多利，行人立便至，失物在东方。' },
  { name: '空亡', luck: '凶', element: '土', meaning: '音信稀时，属土勾陈。凡事主落空、无果，谋事难成，行人有灾殃，失物难寻。' },
];

// 月/日/时均为1起始
export function calcXiaoLiuRen({ month = 1, day = 1, hourIndex = 1 } = {}) {
  let idx = (month - 1) % 6;
  idx = (idx + (day - 1)) % 6;
  idx = (idx + (hourIndex - 1)) % 6;
  const pos = POSITIONS[idx];
  return {
    month,
    day,
    hourIndex,
    result: pos.name,
    luck: pos.luck,
    element: pos.element,
    meaning: pos.meaning,
  };
}
