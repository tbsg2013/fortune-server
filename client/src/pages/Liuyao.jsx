import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import ResultView from '../components/ResultView.jsx';
import Loading from '../components/Loading.jsx';

function Hexagram({ lines, moving }) {
  return (
    <div className="flex flex-col gap-1.5 py-2">
      {lines.map((yang, i) => (
        <div key={i} className={yang ? 'yao-line w-20' : 'yao-yin w-20'}>
          {!yang && <><div className="part" /><div className="part" /></>}
          {moving && moving.includes(i + 1) && <span className="ml-1 text-[#c0392b] text-[10px]">○</span>}
        </div>
      ))}
    </div>
  );
}

export default function Liuyao() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const toss = async () => {
    if (!token) { navigate('/login'); return; }
    setBusy(true); setError('');
    try {
      const r = await api.post('/fortune/liuyao', { question }, token);
      setResult(r);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  if (busy) return <Loading text="铜钱落地，卦象将成…" />;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">六 爻 占 卜</h1>
        <p className="mt-2 text-sm text-ink/55">心怀一念，三枚铜钱摇六次，纳甲装卦断吉凶</p>
      </div>
      {!result && (
        <div className="card p-6 max-w-xl mx-auto">
          <div className="font-kai text-xl text-[#8a1f1a] mb-4 flex items-center gap-2"><span className="seal">占</span> 心中所念</div>
          <input className="input-gold" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="请输入您要占问之事，如：今年事业运如何？" />
          <div className="mt-4 text-xs text-ink/50 leading-relaxed">提示：占卦前请凝神静气，默念所问之事，心诚则灵。</div>
          <button onClick={toss} className="mt-5 w-full btn-cinnabar rounded-xl py-3 font-kai text-lg tracking-widest">摇 卦</button>
        </div>
      )}
      {error && <p className="text-center text-[#c0392b] mt-4">{error}</p>}
      {result && (
        <ResultView title="六爻卦象" chart={result.chart} interpretation={result.interpretation}>
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-center gap-10">
              <div className="text-center">
                <div className="font-kai text-lg text-[#8a1f1a] mb-2">本卦 · {result.chart.benHex.name}</div>
                <Hexagram lines={result.chart.lines.map((l) => l.yang)} moving={result.chart.lines.map((l, i) => (l.moving ? i + 1 : 0)).filter(Boolean)} />
                <div className="text-xs text-ink/50 mt-2">「{result.chart.gua.guaci}」</div>
              </div>
              {result.chart.movingLines.length > 0 && (
                <>
                  <div className="w-px h-24 bg-gold/40" />
                  <div className="text-center">
                    <div className="font-kai text-lg text-[#8a6d1d] mb-2">变卦 · {result.chart.bianHex.name}</div>
                    <Hexagram lines={result.chart.lines.map((l) => (l.moving ? !l.yang : l.yang))} moving={[]} />
                    <div className="text-xs text-ink/50 mt-2">「{result.chart.bianGua.guaci}」</div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-5 border-t border-gold/20 pt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-ink/50 text-xs">
                    <th className="text-left py-1">六神</th><th className="text-left">爻</th><th>五行</th><th>六亲</th><th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {[...result.chart.lines].reverse().map((l, i) => (
                    <tr key={i} className="border-t border-gold/10">
                      <td className="py-1.5">{l.sixShen}</td>
                      <td className="font-kai">{l.line}{l.shi ? '（世）' : ''}{l.ying ? '（应）' : ''}</td>
                      <td className="text-center">{l.gan}{l.zhi}</td>
                      <td className="text-center">{l.qinShen}</td>
                      <td className="text-center">{l.moving ? <span className="text-[#c0392b]">动</span> : <span className="text-ink/40">静</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 text-xs text-ink/50">卦属{result.chart.palace}宫{result.chart.bianType}，{result.chart.gongWx}五行 · 卦宫</div>
          </div>
        </ResultView>
      )}
      {result && <div className="text-center mt-6"><button onClick={() => setResult(null)} className="btn-outline-gold rounded-lg px-6 py-2 text-sm">再占一卦</button></div>}
    </div>
  );
}
