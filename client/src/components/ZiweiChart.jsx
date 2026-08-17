import React from 'react';

// 传统紫微斗数盘的排布：命宫起始按地支排布到 4x3 网格
const GRID_ORDER = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 寅=0 索引 -> 网格位置（传统式样：左上起巳）
// 巳午未 | 辰  申 | 卯  酉 | 寅丑子
const POS = { 巳: [0, 0], 午: [0, 1], 未: [0, 2], 辰: [1, 0], 申: [1, 2], 卯: [2, 0], 酉: [2, 2], 寅: [3, 0], 丑: [3, 1], 子: [3, 2] };

export default function ZiweiChart({ chart }) {
  const cells = [];
  for (const b of chart.boxes) {
    const zhi = b.ganZhi[1];
    const pos = POS[zhi];
    if (pos) cells.push({ ...b, row: pos[0], col: pos[1] });
  }
  const grid = [[], [], [], []];
  for (const c of cells) grid[c.row][c.col] = c;

  return (
    <div>
      <div className="bg-rice rounded-xl p-4 mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <span className="font-kai text-base text-[#8a1f1a]">命宫 {chart.mingGanZhi}</span>
        <span className="text-ink/60">五行局 {chart.juShu}局（{chart.naYin}）</span>
        <span className="text-ink/60">命主 {chart.mingZhu}</span>
        <span className="text-ink/60">身主 {chart.shenZhu}</span>
        <span className="text-ink/60">大限{chart.forward ? '顺行' : '逆行'}</span>
      </div>

      <div className="frame-border p-2 sm:p-3 bg-[#fffdf7]">
        <div className="grid grid-cols-3 gap-1.5">
          {grid.flat().map((c, i) => {
            if (!c) return <div key={i} className="min-h-[92px] rounded bg-rice/60 border border-dashed border-gold/30" />;
            return (
              <div key={i} className={`min-h-[92px] rounded border p-2 relative ${c.isMing ? 'bg-[#fbe9e0] border-[#9e2b25]/50' : 'bg-rice/70 border-gold/30'}`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-kai font-bold ${c.isMing ? 'text-[#9e2b25]' : 'text-[#8a6d1d]'}`}>{c.palace}{c.isShen ? '·身' : ''}</span>
                  <span className="text-ink/40">{c.ganZhi}</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-x-1 gap-y-0.5">
                  {c.stars.map((s, j) => (
                    <span key={j} className={`text-[11px] leading-tight ${s.kind === 'main' ? 'font-bold text-[#5d4037]' : 'text-[#795548]/80'}`}>{s.name}</span>
                  ))}
                </div>
                {c.sihua.length > 0 && (
                  <div className="mt-1 flex gap-1">
                    {c.sihua.map((s, j) => (
                      <span key={j} className="text-[10px] px-1 rounded bg-[#9e2b25] text-rice">{s.kind}·{s.star}</span>
                    ))}
                  </div>
                )}
                <div className="absolute bottom-1 right-2 text-[10px] text-ink/40">{c.daXian}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 card p-4">
        <div className="font-kai text-lg text-[#8a1f1a] mb-2 border-b border-gold/30 pb-2">四化</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {['禄', '权', '科', '忌'].map((k) => {
            const v = chart.sihua[k];
            return (
              <div key={k} className="flex items-center gap-2 bg-rice rounded-lg px-3 py-2">
                <span className="w-6 h-6 rounded-full bg-[#9e2b25] text-rice flex items-center justify-center text-xs font-bold">{k}</span>
                <span>{v ? `${v.star}（${v.palace}宫）` : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
