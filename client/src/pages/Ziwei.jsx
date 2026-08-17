import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import BirthForm from '../components/BirthForm.jsx';
import ResultView from '../components/ResultView.jsx';
import ZiweiChart from '../components/ZiweiChart.jsx';
import Loading from '../components/Loading.jsx';

export default function Ziwei() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (data) => {
    if (!token) { navigate('/login'); return; }
    setBusy(true); setError('');
    try {
      const r = await api.post('/fortune/ziwei', data, token);
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  if (busy) return <Loading text="起盘紫微斗数…" />;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">紫 微 斗 数</h1>
        <p className="mt-2 text-sm text-ink/55">十四主星飞布十二宫，四化星曜揭示一生格局与运势起伏</p>
      </div>
      {!result && <BirthForm onSubmit={submit} />}
      {error && <p className="text-center text-[#c0392b] mt-4">{error}</p>}
      {result && (
        <ResultView title="紫微斗数命盘" chart={result.chart} interpretation={result.interpretation}>
          <ZiweiChart chart={result.chart} />
        </ResultView>
      )}
      {result && <div className="text-center mt-6"><button onClick={() => setResult(null)} className="btn-outline-gold rounded-lg px-6 py-2 text-sm">重新排盘</button></div>}
    </div>
  );
}
