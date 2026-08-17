import React from 'react';
import { Link } from 'react-router-dom';

const SERVICES = [
  { to: '/bazi', icon: '八', title: '八字排盘', desc: '四柱推演 · 五行喜忌 · 大运流年', tag: '经典' },
  { to: '/ziwei', icon: '紫', title: '紫微斗数', desc: '十四主星 · 十二宫位 · 四化飞星', tag: '高级' },
  { to: '/liuyao', icon: '爻', title: '六爻占卜', desc: '铜钱摇卦 · 纳甲装卦 · 卦象断吉凶', tag: '传统' },
  { to: '/tarot', icon: '塔', title: '塔罗占卜', desc: '78张塔罗 · 多种牌阵 · 情感指引', tag: '西洋' },
  { to: '/name', icon: '名', title: '姓名测算', desc: '五格剖象 · 三才配置 · 数理吉凶', tag: '易学' },
  { to: '/zodiac', icon: '运', title: '星座生肖', desc: '十二星座 · 生肖流年 · 每日运势', tag: '轻松' },
  { to: '/xiaoliuren', icon: '六', title: '小六壬', desc: '掌上占卜 · 速断吉凶 · 出行问事', tag: '速占' },
  { to: '/chat', icon: '问', title: '大师问答', desc: 'AI 玄机子在线解惑 · 有问必答', tag: '智能' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="text-center py-14">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="h-px w-16 bg-gold/60" />
          <span className="font-kai text-lg text-[#8a6d1d] tracking-[0.4em]">知 命 而 不 认 命</span>
          <div className="h-px w-16 bg-gold/60" />
        </div>
        <h1 className="font-kai text-5xl sm:text-6xl text-[#8a1f1a] tracking-widest mb-4">玄 机 阁</h1>
        <p className="text-ink/70 max-w-xl mx-auto leading-relaxed">
          融合传统术数与 AI 智能，为您推演八字命盘、紫微斗数、六爻卦象，解读姓名数理与每日运势。
          以古法为骨，以新知为翼。
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/bazi" className="btn-cinnabar px-8 py-3 rounded-xl font-kai text-lg tracking-widest">八字排盘</Link>
          <Link to="/chat" className="btn-gold px-8 py-3 rounded-xl font-kai text-lg tracking-widest">问玄机子</Link>
        </div>
        <div className="mt-6 flex justify-center gap-6 text-xs text-ink/50">
          <span>7 种测算</span><span>AI 智能解读</span><span>历史记录保存</span>
        </div>
      </section>

      {/* 服务卡片 */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SERVICES.map((s) => (
          <Link key={s.to} to={s.to} className="card card-hover p-5 group">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9e2b25] to-[#7a1f1a] text-rice flex items-center justify-center font-kai text-2xl shadow-md group-hover:rotate-6 transition-transform">{s.icon}</div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/15 text-[#8a6d1d] border border-gold/30">{s.tag}</span>
            </div>
            <h3 className="mt-4 font-kai text-xl text-ink">{s.title}</h3>
            <p className="mt-1 text-xs text-ink/55 leading-relaxed">{s.desc}</p>
            <div className="mt-3 text-sm text-[#8a6d1d] group-hover:translate-x-1 transition-transform">前往测算 →</div>
          </Link>
        ))}
      </section>

      {/* 理念 */}
      <section className="mt-14 grid md:grid-cols-3 gap-4">
        {[
          ['易', '以易为纲', '八字、紫微、六爻皆源于《周易》阴阳五行之道，排盘严谨，皆有古法可循。'],
          ['智', '以智为翼', 'AI 大师在严谨盘面基础上，为您做深入浅出的个性化解读，有问必答。'],
          ['诚', '以诚为本', '命理仅供参考，绝不危言耸听。我们更愿意帮您认清自己，把握主动。'],
        ].map(([icon, t, d]) => (
          <div key={t} className="card p-5 text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-rice border-2 border-gold/50 flex items-center justify-center font-kai text-lg text-[#8a1f1a]">{icon}</div>
            <h3 className="mt-3 font-kai text-lg text-[#8a1f1a]">{t}</h3>
            <p className="mt-2 text-xs text-ink/60 leading-relaxed">{d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
