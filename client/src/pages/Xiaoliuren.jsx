import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import ResultView from '../components/ResultView.jsx';
import Loading from '../components/Loading.jsx';

const LUCK_STYLE = { 吉: 'text-[#2e7d32] bg-[#e8f5e9]', 凶: 'text-[#c0392b] bg-[#fdecea]' };

export default function Xiaoliuren() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [day, setDay] = useState(new Date().getDate());
  const [hourIndex, setHourIndex] = useState(Math.ceil((new Date().getHours() + 1) / 2) % 12 || 12);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    setBusy(true); setError('');
    try {
      const r = await api.post('/fortune/xiaoliuren', { month, day, hourIndex, question }, token);
      setResult(r);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  if (busy) return <Loading text="掐指一算…" />;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">小 六 壬</h1>
        <p className="mt-2 text-sm text-ink/55">六掌诀速断吉凶 · 出行问事宜用</p>
      </div>
      {!result && (
        <form onSubmit={submit} className="card p-6 max-w-xl mx-auto">
          <div className="font-kai text-xl text-[#8a1f1a] mb-4 flex items-center gap-2"><span className="seal">掌</span> 月日时起课</div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-ink/70 mb-1">农历月</label>
              <input type="number" min="1" max="12" className="input-gold" value={month} onChange={(e) => setMonth(Number(e.target.value))} required />
            </div>
            <div>
              <label className="block text-sm text-ink/70 mb-1">农历日</label>
              <input type="number" min="1" max="30" className="input-gold" value={day} onChange={(e) => setDay(Number(e.target.value))} required />
            </div>
            <div>
              <label className="block text-sm text-ink/70 mb-1">时辰</label>
              <select className="input-gold" value={hourIndex} onChange={(e) => setHourIndex(Number(e.target.value))}>
                {['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'].map((z, i) => (
                  <option key={z} value={i + 1}>{z}时</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm text-ink/70 mb-1">占问之事（可选）</label>
            <input className="input-gold" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="如：今日出行是否顺利？" />
          </div>
          <button type="submit" className="mt-5 w-full btn-cinnabar rounded-xl py-3 font-kai text-lg tracking-widest">起课占断</button>
        </form>
      )}
      {error && <p className="text-center text-[#c0392b] mt-4">{error}</p>}
      {result && (
        <ResultView title="小六壬断课" chart={result.chart} interpretation={result.interpretation}>
          <div className="card p-8 text-center">
            <div className="text-xs text-ink/50">月{result.chart.month} · 日{result.chart.day} · 时{result.chart.hourIndex} 起课得</div>
            <div className={`inline-block mt-4 px-8 py-3 rounded-xl font-kai text-3xl ${LUCK_STYLE[result.chart.luck]}`}>
              {result.chart.result}
            </div>
            <div className="mt-3 text-sm text-ink/70">属{result.chart.element} · {result.chart.luck}</div>
            <p className="mt-4 text-sm text-ink/60 leading-relaxed max-w-md mx-auto">{result.chart.meaning}</p>
          </div>
        </ResultView>
      )}
      {result && <div className="text-center mt-6"><button onClick={() => setResult(null)} className="btn-outline-gold rounded-lg px-6 py-2 text-sm">再占一课</button></div>}
    </div>
  );
}
