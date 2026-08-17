import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Bazi from './pages/Bazi.jsx';
import Ziwei from './pages/Ziwei.jsx';
import Liuyao from './pages/Liuyao.jsx';
import Tarot from './pages/Tarot.jsx';
import Name from './pages/Name.jsx';
import Zodiac from './pages/Zodiac.jsx';
import Xiaoliuren from './pages/Xiaoliuren.jsx';
import Chat from './pages/Chat.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bazi" element={<Bazi />} />
        <Route path="/ziwei" element={<Ziwei />} />
        <Route path="/liuyao" element={<Liuyao />} />
        <Route path="/tarot" element={<Tarot />} />
        <Route path="/name" element={<Name />} />
        <Route path="/zodiac" element={<Zodiac />} />
        <Route path="/xiaoliuren" element={<Xiaoliuren />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
