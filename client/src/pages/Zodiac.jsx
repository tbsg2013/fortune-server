import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import BirthForm from '../components/BirthForm.jsx';
import ResultView from '../components/ResultView.jsx';
import Loading from '../components/Loading.jsx';

export default function Zodiac() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (data) => {
    if (!token) { navigate('/login'); return; }
    setBusy(true); setError('');
    try {
      const r = await api.post('/fortune/zodiac', data, token);
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  if (busy) return <Loading text="推演星座运势…" />;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">星 座 生 肖</h1>
        <p className="mt-2 text-sm text-ink/55">星座性格 · 生肖流年 · 综合运势分析</p>
      </div>
      {!result && (
        <BirthForm onSubmit={submit} extra={({ question, setQuestion }) => (
          <div>
            <label className="block text-sm text-ink/70 mb-1">想了解哪方面？（可选）</label>
            <input className="input-gold" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="如：事业 / 感情 / 财运" />
          </div>
        )} />
      )}
      {error && <p className="text-center text-[#c0392b] mt-4">{error}</p>}
      {result && (
        <ResultView title="综合运势" chart={result.chart} interpretation={result.interpretation}>
          <div className="card p-4 flex items-center gap-6 justify-center">
            <div className="text-center">
              <div className="font-kai text-3xl text-[#8a1f1a]">{result.chart.sign}</div>
              <div className="text-xs text-ink/50 mt-1">{result.chart.signElement}象 · 守护星{result.chart.signRuler}</div>
            </div>
            <div className="w-px h-12 bg-gold/40" />
            <div className="text-center">
              <div className="font-kai text-3xl text-[#8a1f1a]">属{result.chart.shengXiao}</div>
              <div className="text-xs text-ink/50 mt-1">五行{result.chart.shengXiaoElement}</div>
            </div>
          </div>
        </ResultView>
      )}
      {result && <div className="text-center mt-6"><button onClick={() => setResult(null)} className="btn-outline-gold rounded-lg px-6 py-2 text-sm">重新测算</button></div>}
    </div>
  );
}
