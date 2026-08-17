import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Profile() {
  const { user, token, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [gender, setGender] = useState(user?.gender || '男');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [birthHour, setBirthHour] = useState(user?.birthHour ?? 12);
  const [birthMinute, setBirthMinute] = useState(user?.birthMinute ?? 0);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const save = async (e) => {
    e.preventDefault();
    setBusy(true); setMsg('');
    try {
      await updateProfile({ gender, birthDate: birthDate || null, birthHour, birthMinute });
      setMsg('保存成功 ✓');
    } catch (err) {
      setMsg('保存失败：' + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-kai text-4xl text-[#8a1f1a] tracking-widest">个 人 中 心</h1>
        <p className="mt-2 text-sm text-ink/55">完善出生信息，测算时自动带入</p>
      </div>
      <div className="card p-6 mb-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#9e2b25] to-[#7a1f1a] text-rice flex items-center justify-center font-kai text-2xl">{user.username[0]}</div>
        <div>
          <div className="font-kai text-xl">{user.username}</div>
          <div className="text-xs text-ink/50">{user.email || '未绑定邮箱'} · 注册于 {user.createdAt}</div>
        </div>
      </div>
      <form onSubmit={save} className="card p-6">
        <div className="font-kai text-xl text-[#8a1f1a] mb-4 flex items-center gap-2"><span className="seal">档</span> 命理档案</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-ink/70 mb-1">性别</label>
            <select className="input-gold" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-ink/70 mb-1">出生日期</label>
            <input type="date" className="input-gold" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-ink/70 mb-1">出生时辰</label>
            <select className="input-gold" value={birthHour} onChange={(e) => setBirthHour(Number(e.target.value))}>
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-ink/70 mb-1">分钟</label>
            <select className="input-gold" value={birthMinute} onChange={(e) => setBirthMinute(Number(e.target.value))}>
              {[0, 15, 30, 45].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" disabled={busy} className="mt-6 btn-cinnabar rounded-xl px-8 py-2.5 font-kai tracking-widest">{busy ? '保存中…' : '保存资料'}</button>
        {msg && <p className="mt-3 text-sm text-[#2e7d32]">{msg}</p>}
      </form>
    </div>
  );
}
