import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import ResultView from '../components/ResultView.jsx';
import Loading from '../components/Loading.jsx';

const JI_COLOR = { 大吉: 'text-[#2e7d32]', 吉: 'text-[#2e7d32]', 半吉: 'text-[#8a6d1d]', 凶: 'text-[#c0392b]' };

export default function Name() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [surname, setSurname] = useState('');
  const [given, setGiven] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    setBusy(true); setError('');
    try {
      const r = await api.post('/fortune/name', { surname, given }, token);
      setResult(r);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  if (busy) return <Loading text="推演姓名数理…" />;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">姓 名 测 算</h1>
        <p className="mt-2 text-sm text-ink/55">五格剖象 · 三才配置 · 数理吉凶</p>
      </div>
      {!result && (
        <form onSubmit={submit} className="card p-6 max-w-xl mx-auto">
          <div className="font-kai text-xl text-[#8a1f1a] mb-4 flex items-center gap-2"><span className="seal">名</span> 输入姓名</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-ink/70 mb-1">姓氏</label>
              <input className="input-gold" value={surname} onChange={(e) => setSurname(e.target.value)} placeholder="如：李 / 欧阳" required />
            </div>
            <div>
              <label className="block text-sm text-ink/70 mb-1">名字</label>
              <input className="input-gold" value={given} onChange={(e) => setGiven(e.target.value)} placeholder="如：明轩" required />
            </div>
          </div>
          <button type="submit" className="mt-5 w-full btn-cinnabar rounded-xl py-3 font-kai text-lg tracking-widest">开始测算</button>
        </form>
      )}
      {error && <p className="text-center text-[#c0392b] mt-4">{error}</p>}
      {result && (
        <ResultView title="姓名五格" chart={result.chart} interpretation={result.interpretation}>
          <div className="card p-6">
            <div className="text-center mb-5">
              <span className="font-kai text-4xl text-[#8a1f1a] tracking-widest">{result.chart.fullName}</span>
              {result.chart.strokes.unknown.length > 0 && <p className="text-xs text-ink/50 mt-1">（字 {result.chart.strokes.unknown.join('、')} 笔画由 AI 推算）</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(result.chart.ge).map(([k, v]) => (
                <div key={k} className="bg-rice rounded-xl p-3 text-center border border-gold/25">
                  <div className="text-xs text-ink/50">{k}</div>
                  <div className="font-kai text-2xl text-[#8a1f1a] my-1">{v.num}</div>
                  <div className={`text-xs font-bold ${JI_COLOR[v.ji] || 'text-ink/60'}`}>{v.ji}</div>
                  <div className="text-[10px] text-ink/50 mt-1 leading-snug">{v.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-ink/70">
              三才配置：天格<span className="font-bold">{result.chart.sanCai.tian}</span> · 人格<span className="font-bold">{result.chart.sanCai.ren}</span> · 地格<span className="font-bold">{result.chart.sanCai.di}</span>
            </div>
          </div>
        </ResultView>
      )}
      {result && <div className="text-center mt-6"><button onClick={() => setResult(null)} className="btn-outline-gold rounded-lg px-6 py-2 text-sm">重新测算</button></div>}
    </div>
  );
}
