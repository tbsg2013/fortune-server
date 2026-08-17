import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import Markdown from '../components/Markdown.jsx';

export default function Chat() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [panel, setPanel] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    api.get('/chat/sessions', token).then((d) => setSessions(d.sessions)).catch(() => {});
  }, [token]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const newSession = async () => {
    if (!token) { navigate('/login'); return; }
    const d = await api.post('/chat/sessions', { title: '新对话' }, token);
    setSessions((s) => [d, ...s]);
    setActiveId(d.id);
    setMessages([]);
    setPanel(false);
  };

  const openSession = async (id) => {
    if (!token) { navigate('/login'); return; }
    setActiveId(id);
    const d = await api.get(`/chat/sessions/${id}/messages`, token);
    setMessages(d.messages);
    setPanel(false);
  };

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy || !activeId) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text, temp: true }]);
    setBusy(true);
    try {
      const d = await api.post(`/chat/sessions/${activeId}/messages`, { content: text }, token);
      setMessages((m) => [...m.filter((x) => !x.temp), { role: 'assistant', content: d.content }]);
      setSessions((ss) => ss.map((s) => (s.id === activeId ? { ...s, title: d.title } : s)));
    } catch (err) {
      setMessages((m) => [...m.filter((x) => !x.temp), { role: 'assistant', content: '⚠️ ' + err.message }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">大 师 问 答</h1>
        <p className="mt-2 text-sm text-ink/55">AI 玄机子在线为您答疑解惑，命理、运势、人生皆可问</p>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-4">
        {/* 会话列表 */}
        <aside className="card p-4 h-fit lg:sticky lg:top-24">
          <button onClick={newSession} className="w-full btn-cinnabar rounded-lg py-2 text-sm mb-3">＋ 新对话</button>
          <div className="space-y-1 max-h-72 overflow-y-auto">
            {sessions.map((s) => (
              <button key={s.id} onClick={() => openSession(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate ${s.id === activeId ? 'bg-[#9e2b25]/10 border border-[#9e2b25]/30' : 'hover:bg-rice'}`}>
                {s.title}
              </button>
            ))}
            {sessions.length === 0 && <p className="text-xs text-ink/40 text-center py-4">暂无对话</p>}
          </div>
        </aside>

        {/* 聊天区 */}
        <div className="card flex flex-col h-[70vh]">
          <div className="px-4 py-3 border-b border-gold/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="seal">玄</span>
              <span className="font-kai text-lg text-[#8a1f1a]">玄机子 · AI 大师</span>
            </div>
            <button className="lg:hidden text-sm text-ink/50" onClick={() => setPanel(!panel)}>会话列表</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-rice/40">
            {messages.length === 0 && (
              <div className="text-center py-14">
                <div className="text-4xl mb-3">🀄</div>
                <p className="font-kai text-lg text-[#8a1f1a]">欢迎向玄机子提问</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                  {['我的八字怎么看', '今年事业运如何', '桃花运何时来', '这个名字好不好'].map((q) => (
                    <button key={q} onClick={() => { setInput(q); }} className="text-xs px-3 py-1.5 rounded-full border border-gold/40 hover:bg-gold/10">{q}</button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === 'user' ? 'bg-[#9e2b25] text-rice' : 'bg-white border border-gold/25'}`}>
                  {m.role === 'user' ? m.content : <Markdown text={m.content} />}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="bg-white border border-gold/25 rounded-2xl px-4 py-3 text-sm text-ink/50">
                  <span className="inline-flex items-center gap-2"><span className="taiji-spinner !w-4 !h-4 !border-2" style={{ width: 16, height: 16 }} /> 玄机子正在思考…</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="p-3 border-t border-gold/20 flex gap-2">
            <input className="input-gold flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入您的问题…" disabled={busy || !activeId} />
            <button type="submit" disabled={busy || !activeId} className="btn-cinnabar rounded-lg px-6 py-2 font-kai tracking-widest">发送</button>
          </form>
          {!activeId && <p className="text-center text-xs text-ink/40 pb-2">请先点击「＋ 新对话」开始</p>}
        </div>
      </div>

      {panel && (
        <div className="fixed inset-0 bg-black/40 z-50 lg:hidden" onClick={() => setPanel(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-rice p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={newSession} className="w-full btn-cinnabar rounded-lg py-2 text-sm mb-3">＋ 新对话</button>
            {sessions.map((s) => (
              <button key={s.id} onClick={() => openSession(s.id)} className="w-full text-left px-3 py-2 rounded-lg text-sm truncate hover:bg-riceDark">{s.title}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
