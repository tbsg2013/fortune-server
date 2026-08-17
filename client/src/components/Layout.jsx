import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const NAV = [
  { to: '/bazi', label: '八字排盘' },
  { to: '/ziwei', label: '紫微斗数' },
  { to: '/liuyao', label: '六爻占卜' },
  { to: '/tarot', label: '塔罗' },
  { to: '/name', label: '姓名测算' },
  { to: '/zodiac', label: '星座生肖' },
  { to: '/xiaoliuren', label: '小六壬' },
  { to: '/chat', label: '大师问答' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const onLogout = () => { logout(); navigate('/'); };

  return (
    <div className="min-h-screen bg-clouds flex flex-col">
      {/* 顶部 */}
      <header className="bg-gradient-to-r from-[#7a1f1a] via-[#9e2b25] to-[#7a1f1a] text-rice sticky top-0 z-40 shadow-lg">
        <div className="gold-line" />
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-rice/10 border border-gold/50 flex items-center justify-center font-kai text-xl text-goldLight group-hover:rotate-6 transition-transform">玄</div>
            <div>
              <div className="font-kai text-2xl leading-none tracking-widest">玄机阁</div>
              <div className="text-[10px] text-goldLight/80 tracking-[0.3em] mt-1">传 统 命 理 馆</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) => 'px-3 py-2 text-sm rounded-lg transition-colors ' + (isActive ? 'bg-rice/15 text-goldLight' : 'hover:bg-rice/10')}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/history" className="hidden sm:block text-sm hover:text-goldLight">历史记录</Link>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rice/10 hover:bg-rice/15">
                  <span className="w-6 h-6 rounded-full bg-gold text-ink flex items-center justify-center text-xs font-bold">{user.username[0]}</span>
                  <span className="text-sm">{user.username}</span>
                </Link>
                <button onClick={onLogout} className="text-xs px-2 py-1 rounded border border-rice/30 hover:bg-rice/10">退出</button>
              </div>
            ) : (
              <Link to="/login" className="px-4 py-1.5 rounded-lg bg-gold text-ink text-sm font-bold hover:brightness-110">登录 / 注册</Link>
            )}
            <button className="lg:hidden text-2xl" onClick={() => setOpen(!open)}>☰</button>
          </div>
        </div>
        {/* 移动端菜单 */}
        {open && (
          <nav className="lg:hidden bg-[#8a2420] px-4 py-3 grid grid-cols-2 gap-1">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm rounded-lg hover:bg-rice/10">{n.label}</NavLink>
            ))}
            <NavLink to="/history" onClick={() => setOpen(false)} className="px-3 py-2 text-sm rounded-lg hover:bg-rice/10">历史记录</NavLink>
          </nav>
        )}
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">{children}</main>

      {/* 页脚 */}
      <footer className="bg-[#2b2118] text-rice/70 mt-12">
        <div className="gold-line" />
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-kai text-xl text-goldLight mb-2">玄机阁</div>
            <p className="text-sm leading-relaxed">汇聚八字、紫微斗数、六爻、塔罗等传统术数，AI 大师为您推演天机、指点迷津。</p>
          </div>
          <div>
            <div className="text-sm text-goldLight mb-2 font-bold">特别提示</div>
            <p className="text-xs leading-relaxed">命理测算仅供参考，请理性看待。人生的主动权始终掌握在您自己手中。</p>
          </div>
          <div>
            <div className="text-sm text-goldLight mb-2 font-bold">服务</div>
            <div className="text-xs space-y-1">
              <p>八字排盘 · 紫微斗数 · 六爻 · 塔罗</p>
              <p>姓名测算 · 星座生肖 · 小六壬 · AI 问答</p>
            </div>
          </div>
        </div>
        <div className="border-t border-rice/10 py-4 text-center text-xs">© 2026 玄机阁 · 以古法推演，以新知解惑</div>
      </footer>
    </div>
  );
}
