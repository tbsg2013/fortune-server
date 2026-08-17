import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
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
        <h1 className="font-kai text-3xl text-[#8a1f1a] mt-3 tracking-widest">登 录</h1>
        <p className="text-sm text-ink/50 mt-1">欢迎回来，继续您的命理之旅</p>
      </div>
      <form onSubmit={submit} className="card p-6">
        <div className="mb-4">
          <label className="block text-sm text-ink/70 mb-1">用户名 / 邮箱</label>
          <input className="input-gold" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="请输入用户名或邮箱" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-ink/70 mb-1">密码</label>
          <input type="password" className="input-gold" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" required />
        </div>
        {error && <p className="text-sm text-[#c0392b] mb-3">{error}</p>}
        <button type="submit" disabled={busy} className="w-full btn-cinnabar rounded-xl py-3 font-kai text-lg tracking-widest">{busy ? '登录中…' : '登 录'}</button>
        <p className="mt-4 text-center text-sm text-ink/60">
          还没有账号？<Link to="/register" className="text-[#8a1f1a] font-bold hover:underline">立即注册</Link>
        </p>
      </form>
    </div>
  );
}
