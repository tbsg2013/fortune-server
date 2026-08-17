import React from 'react';

const WX_COLOR = { 金: 'text-[#b8912e]', 木: 'text-[#2e7d32]', 水: 'text-[#1565c0]', 火: 'text-[#c0392b]', 土: 'text-[#8d6e63]' };

function PillarCell({ label, item }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[11px] text-ink/50 mb-1 tracking-widest">{label}</div>
      <div className="frame-border px-4 py-3 flex flex-col items-center gap-1">
        <div className="font-kai text-xl">{item.ganzhi}</div>
        <div className={`text-xs ${WX_COLOR[item.gan]} font-bold`}>{item.shiShenGan}</div>
        <div className="text-[11px] text-ink/60">{item.naYin}</div>
      </div>
      <div className="mt-1 text-center">
        <div className="text-xs font-bold">{item.zhi}</div>
        <div className="text-[11px] text-ink/50">{item.hideGan.join(' ')}</div>
        <div className="text-[11px] text-ink/50">{item.shiShenZhi.join(' ')}</div>
      </div>
    </div>
  );
}

export default function BaziChart({ chart }) {
  const p = chart.pillars;
  return (
    <div>
      <div className="bg-rice rounded-xl p-4 mb-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-kai text-base text-[#8a1f1a]">{chart.gender}命 · {chart.dayMaster}金日主</span>
        <span className="text-ink/60">生肖 {chart.shengXiao}</span>
        <span className="text-ink/60">农历 {chart.lunar}</span>
        <span className="text-ink/60">五行：
          {Object.entries(chart.wuxing).map(([k, v]) => (
            <span key={k} className={`inline-block ml-2 ${WX_COLOR[k]}`}>{k}{v}</span>
          ))}
        </span>
        {chart.wuxingMissing.length > 0 && <span className="text-[#c0392b]">缺 {chart.wuxingMissing.join('、')}</span>}
      </div>

      <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
        <PillarCell label="年柱" item={p.year} />
        <PillarCell label="月柱" item={p.month} />
        <PillarCell label="日柱" item={p.day} />
        <PillarCell label="时柱" item={p.time} />
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="font-kai text-lg text-[#8a1f1a] mb-2 border-b border-gold/30 pb-2">起运信息</div>
          <p className="text-sm text-ink/80">出生后 <b>{chart.yunInfo.startYear}</b> 年 <b>{chart.yunInfo.startMonth}</b> 个月 <b>{chart.yunInfo.startDay}</b> 天起运（{chart.yunInfo.startSolar}），大运{chart.yunInfo.forward ? '顺行' : '逆行'}。</p>
        </div>
        <div className="card p-4">
          <div className="font-kai text-lg text-[#8a1f1a] mb-2 border-b border-gold/30 pb-2">大运走势</div>
          <div className="flex flex-wrap gap-2">
            {chart.daYun.slice(0, 8).map((d, i) => (
              <span key={i} className="px-2 py-1 rounded bg-rice border border-gold/30 text-xs">
                <b>{d.ganZhi}</b> {d.startAge}-{d.endAge}岁
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
