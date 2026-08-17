import { Router } from 'express';
import { db } from '../db.js';
import { authRequired } from '../middleware.js';
import { chat, masterSystemPrompt } from '../ai.js';
import { calcBazi } from '../engines/bazi.js';
import { calcZiWei } from '../engines/ziwei.js';
import { calcLiuYao } from '../engines/liuyao.js';
import { drawTarot } from '../engines/tarot.js';
import { calcName } from '../engines/name.js';
import { zodiacInfo } from '../engines/zodiac.js';
import { calcXiaoLiuRen } from '../engines/xiaoliuren.js';

const router = Router();

const GENDER_TEXT = (g) => (g === '女' ? '女命' : '男命');

function baziPrompt(chart) {
  const p = chart.pillars;
  return `请根据以下八字命盘为这位${chart.gender}性用户做一份详尽的命理分析（约350-600字），结构清晰：
【出生信息】${chart.solar}，农历${chart.lunar}，属${chart.shengXiao}
【四柱】年柱${p.year.ganzhi}（${p.year.naYin}）、月柱${p.month.ganzhi}（${p.month.naYin}）、日柱${p.day.ganzhi}（${p.day.naYin}）、时柱${p.time.ganzhi}（${p.time.naYin}）
【十神】年干${p.year.shiShenGan}、月干${p.month.shiShenGan}、日干为日主、时干${p.time.shiShenGan}
【五行分布】金${chart.wuxing.金}木${chart.wuxing.木}水${chart.wuxing.水}火${chart.wuxing.火}土${chart.wuxing.土}，缺：${chart.wuxingMissing.join('、') || '无'}
【起运】出生后${chart.yunInfo.startYear}年${chart.yunInfo.startMonth}个月${chart.yunInfo.startDay}天起运（${chart.yunInfo.startSolar}），大运${chart.yunInfo.forward ? '顺行' : '逆行'}
【大运】${chart.daYun.map((d) => d.ganZhi + '(' + d.startYear + '-' + d.endYear + '岁' + d.startAge + '-' + d.endAge + ')').join('、')}
请依次分析：1)命局特点与日主强弱；2)五行喜用神与性格特质；3)事业财运；4)感情婚姻；5)健康提示；6)当前及未来几年大运流年走势与建议。语气亲切，避免绝对化结论。`;
}

function ziweiPrompt(chart) {
  const boxes = chart.boxes.map((b) => `${b.palace}(${b.ganZhi})[${b.stars.map((s) => s.name).join('、') || '空宫'}${b.sihua.length ? '四化:' + b.sihua.map((s) => s.kind + s.star).join('、') : ''}]大限${b.daXian}`).join('；');
  return `请根据以下紫微斗数命盘为这位${chart.gender}性用户做详尽解读（约500-800字）：
【出生】${chart.solar}，农历${chart.lunar}，${chart.hourZhi}时，生年${chart.yearGanZhi}
【命宫】${chart.mingGanZhi}，纳音${chart.naYin}，五行局${chart.juShu}局，大限${chart.forward ? '顺行' : '逆行'}
【命主】${chart.mingZhu}，身主${chart.shenZhu}
【四化】${Object.entries(chart.sihua).filter(([, v]) => v).map(([k, v]) => k + v.star + '(' + v.palace + '宫)').join('、') || '无'}
【十二宫】${boxes}
请依次解读：1)命盘格局总论（主星组合、命宫与身宫）；2)性格与天赋；3)十二宫重点（尤其财帛、官禄、夫妻、迁移）；4)四化影响；5)大限走势与当前所处大限的建议；6)趋吉避凶提示。语气亲切，深入浅出。`;
}

function liuyaoPrompt(r, question) {
  const lines = r.lines.map((l) => `${l.sixShen} ${l.line}${l.yang ? '阳' : '阴'}${l.moving ? '(动)' : ''} ${l.gan}${l.zhi} ${l.qinShen}${l.shi ? '[世]' : ''}${l.ying ? '[应]' : ''}`).join('\n');
  return `用户占问："${question || '心中所念之事'}"。请以六爻纳甲法为这位求测者解读（约400-650字）：
【卦象】${r.benHex.name}卦（${r.benHex.num}卦），上${r.benHex.guaci ? '' : ''}，卦辞："${r.gua.guaci}"；属${r.palace}宫${r.bianType}，世在${r.shi}爻、应在${r.ying}爻，卦宫五行为${r.gongWx}
【变卦】${r.bianHex.name}（${r.bianHex.guaci ? '' : ''}），卦辞："${r.bianGua.guaci}"
【六爻装卦】${lines}
请结合：1)卦象与卦辞直解；2)世应关系与用神（针对所问之事取用神）；3)动爻与变爻的吉凶生克；4)综合断语与行动建议。注意区分"命理参考"与"现实决策"。`;
}

function tarotPrompt(draw, question) {
  const cards = draw.cards.map((c) => `${c.position}：${c.name}${c.reversed ? '（逆位）' : '（正位）'}${c.kind === 'major' ? '，关键字：' + c.upright.join('、') : '，' + (c.suit ? c.suit + '牌面·' + c.theme : '')}`).join('\n');
  return `用户以「${draw.spreadName}」牌阵占问："${question || '心中所念之事'}"。请解读本次塔罗（约400-650字）：
【牌面】
${cards}
请依次：1)概述整体能量与核心信息；2)逐张解读每张牌在对应位置的含义（结合正/逆位）；3)串联牌阵讲一个完整的故事；4)给出具体可操作的建议。语气温和理性，避免宿命论。`;
}

function namePrompt(r) {
  const ge = r.ge;
  return `请为姓名"${r.fullName}"做五格剖象法详解（约500-800字）：
【笔画】姓"${r.surname}"${r.strokes.s1}画${r.strokes.s2 ? '、' + r.strokes.s2 + '画' : ''}，名"${r.given}"${r.strokes.g1}画${r.strokes.g2 ? '、' + r.strokes.g2 + '画' : ''}${r.strokes.unknown.length ? '（字' + r.strokes.unknown.join('、') + '不在常用笔画库，其数由AI推算）' : ''}
【五格】天格${ge['天格'].num}（${ge['天格'].ji}）、人格${ge['人格'].num}（${ge['人格'].ji}）、地格${ge['地格'].num}（${ge['地格'].ji}）、外格${ge['外格'].num}（${ge['外格'].ji}）、总格${ge['总格'].num}（${ge['总格'].ji}）
【三才】天格五行${r.sanCai.tian}、人格五行${r.sanCai.ren}、地格五行${r.sanCai.di}
请解读：1)五格吉凶与数理含义；2)三才配置对性格、健康、运途的影响；3)综合姓名评价与建议（改名/用名方向）。注意：姓名学仅供参考，不要夸大影响。`;
}

function zodiacPrompt(info, question) {
  return `用户是${info.sign}（${info.signElement}象，守护星${info.signRuler}），属${info.shengXiao}（${info.shengXiaoElement}）。请写一份${question ? `关于"${question}"的` : ''}综合运势分析（约400-650字），包含：
1)星座性格特质与本月/近期运势要点；2)生肖流年运势；3)事业、感情、财运、健康分项；4)幸运色、幸运数字与开运小建议。
语气亲切积极，结合用户问询方向。`;
}

function xiaoliurenPrompt(x, question) {
  return `用户以月${x.month}、日${x.day}、时${x.hourIndex}起小六壬，得「${x.result}」（${x.luck}，属${x.element}）。占问："${question || '心中所念之事'}"。
【断辞】${x.meaning}
请围绕用户所问之事展开解读（约200-400字）：1)此课的吉凶主象；2)针对问题的具体断语；3)应对与建议。`;
}

const ENGINES = {
  bazi: {
    title: '八字排盘',
    run: (input) => {
      const chart = calcBazi(input);
      return { chart, prompt: baziPrompt(chart), input };
    },
  },
  ziwei: {
    title: '紫微斗数',
    run: (input) => {
      const chart = calcZiWei(input);
      return { chart, prompt: ziweiPrompt(chart), input };
    },
  },
  liuyao: {
    title: '六爻占卜',
    run: (input) => {
      const r = calcLiuYao(input);
      return { chart: r, prompt: liuyaoPrompt(r, input.question), input };
    },
  },
  tarot: {
    title: '塔罗占卜',
    run: (input) => {
      const draw = drawTarot({ type: input.type || 'three', question: input.question });
      return { chart: draw, prompt: tarotPrompt(draw, input.question), input };
    },
  },
  name: {
    title: '姓名测算',
    run: (input) => {
      const r = calcName({ surname: input.surname, given: input.given });
      return { chart: r, prompt: namePrompt(r), input };
    },
  },
  zodiac: {
    title: '星座生肖',
    run: (input) => {
      const info = zodiacInfo(input);
      return { chart: info, prompt: zodiacPrompt(info, input.question), input };
    },
  },
  xiaoliuren: {
    title: '小六壬',
    run: (input) => {
      const x = calcXiaoLiuRen(input);
      return { chart: x, prompt: xiaoliurenPrompt(x, input.question), input };
    },
  },
};

function parseInput(type, body, user) {
  const base = { gender: (body.gender || user.gender || '男') === '女' ? '女' : '男' };
  if (type === 'bazi' || type === 'ziwei') {
    const [y, m, d] = (body.birthDate || '').split('-').map(Number);
    const h = body.birthHour != null ? Number(body.birthHour) : (user.birth_hour ?? 12);
    const mi = body.birthMinute != null ? Number(body.birthMinute) : (user.birth_minute ?? 0);
    if (!y || !m || !d) throw new Error('请提供出生日期');
    return { ...base, year: y, month: m, day: d, hour: h, minute: mi };
  }
  if (type === 'liuyao') {
    const now = new Date();
    const lines = Array.isArray(body.lines) && body.lines.length === 6 ? body.lines.map(Number) : null;
    return { ...base, lines, question: body.question || '', year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(), hour: now.getHours(), minute: now.getMinutes() };
  }
  if (type === 'tarot') return { type: body.type || 'three', question: body.question || '' };
  if (type === 'name') {
    if (!body.surname || !body.given) throw new Error('请提供姓和名');
    return { surname: String(body.surname), given: String(body.given) };
  }
  if (type === 'zodiac') {
    const [y, m, d] = (body.birthDate || '').split('-').map(Number);
    if (!y || !m || !d) throw new Error('请提供出生日期');
    return { ...base, year: y, month: m, day: d, question: body.question || '' };
  }
  if (type === 'xiaoliuren') {
    return {
      month: Number(body.month) || new Date().getMonth() + 1,
      day: Number(body.day) || new Date().getDate(),
      hourIndex: Number(body.hourIndex) || Math.ceil((new Date().getHours() + 1) / 2) % 12 || 12,
      question: body.question || '',
    };
  }
  throw new Error('未知的测算类型');
}

router.post('/:type', authRequired, async (req, res) => {
  const { type } = req.params;
  const engine = ENGINES[type];
  if (!engine) {
    res.status(404).json({ error: '不支持的测算类型' });
    return;
  }
  try {
    const input = parseInput(type, req.body || {}, req.user);
    const { chart, prompt, input: storedInput } = engine.run(input);
    let interpretation = '';
    try {
      interpretation = await chat([{ role: 'system', content: masterSystemPrompt('你是排盘与解盘的大师，请严格依据提供的命盘数据展开分析，不要虚构盘面信息。') }, { role: 'user', content: prompt }], { temperature: 0.85, maxTokens: 1500 });
    } catch (e) {
      interpretation = `（AI 解读暂不可用：${e.message}）`;
      console.error('AI 解读失败:', e.message);
    }
    const info = await db.run('INSERT INTO fortune_records (user_id, type, title, input_data, result_data) VALUES (?, ?, ?, ?, ?)', req.user.id, type, engine.title, JSON.stringify(storedInput), JSON.stringify({ chart, interpretation }));
    res.json({
      id: info.lastInsertRowid,
      type,
      title: engine.title,
      chart,
      interpretation,
      createdAt: (await db.get('SELECT created_at FROM fortune_records WHERE id = ?', info.lastInsertRowid)).created_at,
    });
  } catch (e) {
    console.error('测算失败:', e);
    res.status(400).json({ error: e.message || '测算失败' });
  }
});

router.get('/history', authRequired, async (req, res) => {
  const rows = await db.all('SELECT id, type, title, created_at FROM fortune_records WHERE user_id = ? ORDER BY id DESC LIMIT 100', req.user.id);
  res.json({ records: rows });
});

router.get('/history/:id', authRequired, async (req, res) => {
  const row = await db.get('SELECT * FROM fortune_records WHERE id = ? AND user_id = ?', Number(req.params.id), req.user.id);
  if (!row) {
    res.status(404).json({ error: '记录不存在' });
    return;
  }
  res.json({ ...row, inputData: JSON.parse(row.input_data || '{}'), resultData: JSON.parse(row.result_data || '{}') });
});

router.delete('/history/:id', authRequired, async (req, res) => {
  const info = await db.run('DELETE FROM fortune_records WHERE id = ? AND user_id = ?', Number(req.params.id), req.user.id);
  if (info.changes === 0) {
    res.status(404).json({ error: '记录不存在' });
    return;
  }
  res.json({ ok: true });
});

export default router;
