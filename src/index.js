import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3001;

// Serve the built frontend when present (local dev / single-process deploy)
const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
try {
  const { existsSync } = await import('node:fs');
  if (existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }
} catch (e) { /* ignore */ }

app.listen(PORT, () => {
  console.log('Fortune API listening on http://localhost:' + PORT);
  console.log('AI model: ' + (process.env.SILICONFLOW_MODEL || 'Qwen/Qwen3-8B'));
});
