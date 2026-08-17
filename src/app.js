import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import fortuneRouter from './routes/fortune.js';
import chatRouter from './routes/chat.js';
import { db } from './db.js';

const ENV_CHECK = ['DATABASE_URL', 'DATABASE_AUTH_TOKEN', 'SILICONFLOW_API_KEY', 'SILICONFLOW_URL', 'SILICONFLOW_MODEL', 'JWT_SECRET'];
console.log('[env] 已注入变量:', ENV_CHECK.filter((k) => process.env[k]).join(', ') || '无（全部缺失，请检查环境变量配置）');
const app = express();
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || '*').split(','), credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (req, res) => {
  const count = (await db.get('SELECT COUNT(*) AS c FROM users')).c;
  res.json({ ok: true, time: new Date().toISOString(), users: count, model: process.env.SILICONFLOW_MODEL || 'Qwen/Qwen3-8B' });
});

app.use('/api/auth', authRouter);
app.use('/api/fortune', fortuneRouter);
app.use('/api/chat', chatRouter);

app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});
export default app;
