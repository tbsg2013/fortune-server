import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('fortune_token') || '');
  const [loading, setLoading] = useState(!!localStorage.getItem('fortune_token'));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    api.get('/auth/me', token)
      .then((d) => { if (!cancelled) { setUser(d.user); setLoading(false); } })
      .catch(() => { if (!cancelled) { localStorage.removeItem('fortune_token'); setToken(''); setUser(null); setLoading(false); } });
    return () => { cancelled = true; };
  }, [token]);

  const login = async (username, password) => {
    const d = await api.post('/auth/login', { username, password });
    localStorage.setItem('fortune_token', d.token);
    setToken(d.token);
    setUser(d.user);
    return d.user;
  };

  const register = async (data) => {
    const d = await api.post('/auth/register', data);
    localStorage.setItem('fortune_token', d.token);
    setToken(d.token);
    setUser(d.user);
    return d.user;
  };

  const logout = () => {
    localStorage.removeItem('fortune_token');
    setToken('');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const d = await api.put('/auth/me', data, token);
    setUser(d.user);
    return d.user;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
