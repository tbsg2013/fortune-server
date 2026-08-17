# 玄机阁 · 算命网站

八字 / 紫微斗数 / 六爻 / 塔罗 / 姓名 / 星座生肖，AI 解读 + 聊天。

## 本地运行
```bash
npm install && cd client && npm install && npm run build
npm start   # http://localhost:3001
```

## 环境变量
| 变量 | 说明 |
|------|------|
| DATABASE_URL | Turso 数据库地址 |
| DATABASE_AUTH_TOKEN | Turso 访问令牌 |
| SILICONFLOW_API_KEY | SiliconFlow API Key |
| SILICONFLOW_URL | https://api.siliconflow.cn/v1/chat/completions |
| SILICONFLOW_MODEL | Qwen/Qwen3-8B |
| JWT_SECRET | JWT 密钥 |
