import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import BirthForm from '../components/BirthForm.jsx';
import ResultView from '../components/ResultView.jsx';
import BaziChart from '../components/BaziChart.jsx';
import Loading from '../components/Loading.jsx';

export default function Bazi() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (data) => {
    if (!token) { navigate('/login'); return; }
    setBusy(true); setError('');
    try {
      const r = await api.post('/fortune/bazi', data, token);
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  if (busy) return <Loading text="推演四柱八字…" />;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">八 字 排 盘</h1>
        <p className="mt-2 text-sm text-ink/55">以出生年月日时排出四柱，推演五行喜忌、十神格局、大运流年</p>
      </div>
      {!result && <BirthForm onSubmit={submit} />}
      {error && <p className="text-center text-[#c0392b] mt-4">{error}</p>}
      {result && (
        <ResultView title="八字命盘" chart={result.chart} interpretation={result.interpretation}>
          <BaziChart chart={result.chart} />
        </ResultView>
      )}
      {result && <div className="text-center mt-6"><button onClick={() => setResult(null)} className="btn-outline-gold rounded-lg px-6 py-2 text-sm">重新测算</button></div>}
    </div>
  );
}
