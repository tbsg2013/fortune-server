import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import Loading from '../components/Loading.jsx';
import Markdown from '../components/Markdown.jsx';

const TYPE_ICON = { bazi: '八', ziwei: '紫', liuyao: '爻', tarot: '塔', name: '名', zodiac: '运', xiaoliuren: '六' };
const TYPE_NAME = { bazi: '八字排盘', ziwei: '紫微斗数', liuyao: '六爻占卜', tarot: '塔罗', name: '姓名测算', zodiac: '星座生肖', xiaoliuren: '小六壬' };

export default function History() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    api.get('/fortune/history', token).then((d) => { setRecords(d.records); setLoading(false); }).catch(() => setLoading(false));
  }, [token]);

  const open = async (id) => {
    const d = await api.get(`/fortune/history/${id}`, token);
    setDetail(d);
  };

  const remove = async (id) => {
    if (!window.confirm('确定删除这条测算记录吗？')) return;
    await api.del(`/fortune/history/${id}`, token);
    setRecords((rs) => rs.filter((r) => r.id !== id));
    setDetail(null);
  };

  if (loading) return <Loading text="正在翻阅命理档案…" />;

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">历 史 记 录</h1>
        <p className="mt-2 text-sm text-ink/55">您的每一次测算都保存在此</p>
      </div>
      {records.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-ink/50 mb-4">还没有测算记录，去试试吧</p>
          <button onClick={() => navigate('/bazi')} className="btn-cinnabar rounded-lg px-6 py-2">开始第一次测算</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_360px] gap-4 items-start">
          <div className="space-y-3">
            {records.map((r) => (
              <div key={r.id} className="card p-4 flex items-center gap-4 hover:border-gold/50">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#9e2b25] to-[#7a1f1a] text-rice flex items-center justify-center font-kai text-xl shrink-0">{TYPE_ICON[r.type] || '卜'}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold">{TYPE_NAME[r.type] || r.title}</div>
                  <div className="text-xs text-ink/50">{r.created_at}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => open(r.id)} className="text-sm text-[#8a1f1a] hover:underline">查看</button>
                  <button onClick={() => remove(r.id)} className="text-sm text-ink/40 hover:text-[#c0392b]">删除</button>
                </div>
              </div>
            ))}
          </div>
          {detail && (
            <div className="card p-5 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-3">
                <span className="font-kai text-xl text-[#8a1f1a]">{TYPE_NAME[detail.type] || detail.title}</span>
                <button onClick={() => setDetail(null)} className="text-ink/40">✕</button>
              </div>
              <div className="text-xs text-ink/50 mb-3">{detail.created_at}</div>
              <div className="max-h-[60vh] overflow-y-auto pr-1">
                <Markdown text={detail.resultData?.interpretation || '（无解读内容）'} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
