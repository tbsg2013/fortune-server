import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '', gender: '男', birthDate: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('密码至少 6 位'); return; }
    if (form.password !== form.confirm) { setError('两次密码不一致'); return; }
    setBusy(true);
    try {
      await register({ username: form.username, email: form.email || null, password: form.password, gender: form.gender, birthDate: form.birthDate || null });
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <span className="seal text-sm">玄机阁</span>
        <h1 className="font-kai text-3xl text-[#8a1f1a] mt-3 tracking-widest">注 册</h1>
        <p className="text-sm text-ink/50 mt-1">开启您的命理档案，测算结果自动保存</p>
      </div>
      <form onSubmit={submit} className="card p-6">
        <div className="mb-4">
          <label className="block text-sm text-ink/70 mb-1">用户名</label>
          <input className="input-gold" value={form.username} onChange={set('username')} placeholder="至少 2 个字符" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-ink/70 mb-1">邮箱（可选）</label>
          <input type="email" className="input-gold" value={form.email} onChange={set('email')} placeholder="用于找回账号" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="mb-4">
            <label className="block text-sm text-ink/70 mb-1">性别</label>
            <select className="input-gold" value={form.gender} onChange={set('gender')}>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-ink/70 mb-1">出生日期（可选）</label>
            <input type="date" className="input-gold" value={form.birthDate} onChange={set('birthDate')} />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-ink/70 mb-1">密码</label>
          <input type="password" className="input-gold" value={form.password} onChange={set('password')} placeholder="至少 6 位" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-ink/70 mb-1">确认密码</label>
          <input type="password" className="input-gold" value={form.confirm} onChange={set('confirm')} placeholder="再次输入密码" required />
        </div>
        {error && <p className="text-sm text-[#c0392b] mb-3">{error}</p>}
        <button type="submit" disabled={busy} className="w-full btn-cinnabar rounded-xl py-3 font-kai text-lg tracking-widest">{busy ? '注册中…' : '注 册'}</button>
        <p className="mt-4 text-center text-sm text-ink/60">
          已有账号？<Link to="/login" className="text-[#8a1f1a] font-bold hover:underline">直接登录</Link>
        </p>
      </form>
    </div>
  );
}
