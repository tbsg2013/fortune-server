import { Router } from 'express';
import { db } from '../db.js';
import { authRequired } from '../middleware.js';
import { chat, masterSystemPrompt } from '../ai.js';

const router = Router();

const HISTORY_LIMIT = 30;

router.post('/sessions', authRequired, async (req, res) => {
  const title = (req.body || {}).title || '新对话';
  const info = await db.run('INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)', req.user.id, title);
  res.json({ id: info.lastInsertRowid, title, messages: [] });
});

router.get('/sessions', authRequired, async (req, res) => {
  const sessions = await db.all('SELECT id, title, created_at FROM chat_sessions WHERE user_id = ? ORDER BY id DESC', req.user.id);
  res.json({ sessions });
});

router.get('/sessions/:id/messages', authRequired, async (req, res) => {
  const s = await db.get('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?', Number(req.params.id), req.user.id);
  if (!s) {
    res.status(404).json({ error: '会话不存在' });
    return;
  }
  const messages = await db.all('SELECT id, role, content, created_at FROM chat_messages WHERE session_id = ? ORDER BY id', s.id);
  res.json({ session: s, messages });
});

router.post('/sessions/:id/messages', authRequired, async (req, res) => {
  const s = await db.get('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?', Number(req.params.id), req.user.id);
  if (!s) {
    res.status(404).json({ error: '会话不存在' });
    return;
  }
  const content = String((req.body || {}).content || '').trim();
  if (!content) {
    res.status(400).json({ error: '消息不能为空' });
    return;
  }
  await db.run('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)', s.id, 'user', content);
  if (s.title === '新对话' && content.length > 12) {
    await db.run('UPDATE chat_sessions SET title = ? WHERE id = ?', content.slice(0, 20), s.id);
  }
  try {
    const history = (await db.all('SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY id DESC LIMIT ?', s.id, HISTORY_LIMIT)).reverse();
    const messages = [{ role: 'system', content: masterSystemPrompt('你是一位可随时为用户排盘、解盘、答疑的命理顾问。若用户询问自身命运，请引导其在站内完成八字、紫微等排盘后再深入分析。') }, ...history];
    const reply = await chat(messages, { temperature: 0.85, maxTokens: 2000 });
    await db.run('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)', s.id, 'assistant', reply);
    const updated = await db.get('SELECT title FROM chat_sessions WHERE id = ?', s.id);
    res.json({ role: 'assistant', content: reply, title: updated.title });
  } catch (e) {
    console.error('AI 对话失败:', e.message);
    res.status(502).json({ error: 'AI 暂时无法响应，请稍后再试' });
  }
});

export default router;
