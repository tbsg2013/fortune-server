import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import ResultView from '../components/ResultView.jsx';
import Loading from '../components/Loading.jsx';

const SPREADS = [
  { value: 'single', name: '单张指引', desc: '一张牌，直指当下核心' },
  { value: 'three', name: '时间之流', desc: '过去 · 现在 · 未来' },
  { value: 'cross', name: '凯尔特十字', desc: '十张牌深度剖析（简版）' },
];

export default function Tarot() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState('three');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const draw = async () => {
    if (!token) { navigate('/login'); return; }
    setBusy(true); setError('');
    try {
      const r = await api.post('/fortune/tarot', { type, question }, token);
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  if (busy) return <Loading text="洗牌中…牌灵苏醒…" />;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">塔 罗 占 卜</h1>
        <p className="mt-2 text-sm text-ink/55">78 张塔罗牌，映照潜意识，指引当下抉择</p>
      </div>
      {!result && (
        <div className="card p-6 max-w-xl mx-auto">
          <div className="font-kai text-xl text-[#8a1f1a] mb-4 flex items-center gap-2"><span className="seal">灵</span> 选择牌阵</div>
          <div className="grid gap-3">
            {SPREADS.map((s) => (
              <button key={s.value} onClick={() => setType(s.value)}
                className={`text-left px-4 py-3 rounded-xl border transition-all ${type === s.value ? 'border-[#9e2b25] bg-[#fbe9e0] shadow' : 'border-gold/30 hover:border-gold/60'}`}>
                <div className="font-bold text-sm">{s.name}</div>
                <div className="text-xs text-ink/50 mt-0.5">{s.desc}</div>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <label className="block text-sm text-ink/70 mb-1">想问什么？（可选）</label>
            <input className="input-gold" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="如：这段感情的发展方向？" />
          </div>
          <button onClick={draw} className="mt-5 w-full btn-cinnabar rounded-xl py-3 font-kai text-lg tracking-widest">洗牌 · 抽牌</button>
        </div>
      )}
      {error && <p className="text-center text-[#c0392b] mt-4">{error}</p>}
      {result && (
        <ResultView title={'塔罗牌阵 · ' + result.chart.spreadName} chart={result.chart} interpretation={result.interpretation}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {result.chart.cards.map((c, i) => (
              <div key={i} className={`card p-4 text-center ${c.reversed ? 'border-[#c0392b]/40' : ''}`}>
                <div className={`w-12 h-16 mx-auto rounded-lg flex items-center justify-center font-kai text-2xl shadow ${c.reversed ? 'bg-gradient-to-br from-[#7a1f1a] to-[#4a1512] text-rice' : 'bg-gradient-to-br from-[#d4af37] to-[#b8912e] text-[#3a2a10]'}`}>{c.kind === 'major' ? c.name[0] : c.suit[0]}</div>
                <div className="mt-2 text-sm font-bold">{c.name || c.fullName}</div>
                <div className="text-[10px] text-ink/50 mt-0.5">{c.position} · {c.reversed ? '逆位' : '正位'}</div>
                {c.kind === 'minor' && <div className="text-[10px] text-[#8a6d1d] mt-1">{c.theme}</div>}
                {c.kind === 'major' && (
                  <div className="mt-1 text-[10px] text-ink/55 leading-snug">
                    {c.reversed ? c.reversed.join(' · ') : c.upright.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ResultView>
      )}
      {result && <div className="text-center mt-6"><button onClick={() => setResult(null)} className="btn-outline-gold rounded-lg px-6 py-2 text-sm">再抽一次</button></div>}
    </div>
  );
}
