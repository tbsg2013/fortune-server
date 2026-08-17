import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const sign = (user) => jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

function publicUser(u) {
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    birthDate: u.birth_date,
    birthHour: u.birth_hour,
    birthMinute: u.birth_minute,
    gender: u.gender,
    createdAt: u.created_at,
  };
}

router.post('/register', async (req, res) => {
  const { username, email, password, gender = '男', birthDate = null, birthHour = null, birthMinute = null } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: '用户名和密码不能为空' });
    return;
  }
  if (String(username).length < 2 || String(password).length < 6) {
    res.status(400).json({ error: '用户名至少2个字符，密码至少6位' });
    return;
  }
  const hash = bcrypt.hashSync(String(password), 10);
  try {
    const info = await db.run('INSERT INTO users (username, email, password_hash, gender, birth_date, birth_hour, birth_minute) VALUES (?, ?, ?, ?, ?, ?, ?)', username, email || null, hash, gender, birthDate, birthHour, birthMinute);
    const user = await db.get('SELECT * FROM users WHERE id = ?', info.lastInsertRowid);
    res.json({ token: sign(user), user: publicUser(user) });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) res.status(409).json({ error: '用户名或邮箱已存在' });
    else { console.error(e); res.status(500).json({ error: '注册失败' }); }
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: '请输入用户名和密码' });
    return;
  }
  const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', username, username);
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    res.status(401).json({ error: '用户名或密码错误' });
    return;
  }
  res.json({ token: sign(user), user: publicUser(user) });
});

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) { res.status(401).json({ error: '未登录' }); return; }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await db.get('SELECT * FROM users WHERE id = ?', payload.id);
    if (!user) { res.status(404).json({ error: '用户不存在' }); return; }
    res.json({ user: publicUser(user) });
  } catch (e) {
    res.status(401).json({ error: '登录已过期，请重新登录' });
  }
});

router.put('/me', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) { res.status(401).json({ error: '未登录' }); return; }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { gender, birthDate, birthHour, birthMinute } = req.body || {};
    await db.run('UPDATE users SET gender = ?, birth_date = ?, birth_hour = ?, birth_minute = ? WHERE id = ?', gender ?? null, birthDate ?? null, birthHour ?? null, birthMinute ?? null, payload.id);
    const user = await db.get('SELECT * FROM users WHERE id = ?', payload.id);
    res.json({ user: publicUser(user) });
  } catch (e) {
    res.status(401).json({ error: '登录已过期，请重新登录' });
  }
});

export default router;
export { sign, publicUser };
