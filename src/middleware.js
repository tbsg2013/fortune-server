import jwt from 'jsonwebtoken';
import { db } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export async function authRequired(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: '未登录' });
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await db.get('SELECT * FROM users WHERE id = ?', payload.id);
    if (!user) {
      res.status(404).json({ error: '用户不存在' });
      return;
    }
    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ error: '登录已过期，请重新登录' });
  }
}
