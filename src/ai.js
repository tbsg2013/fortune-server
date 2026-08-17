import 'dotenv/config';

const API_URL = process.env.SILICONFLOW_URL || 'https://api.siliconflow.cn/v1/chat/completions';
const API_KEY = process.env.SILICONFLOW_API_KEY;
const MODEL = process.env.SILICONFLOW_MODEL || 'Qwen/Qwen3-8B';

const MASTER_PROFILE = `你是一位精通中国传统命理学的资深算命大师，名号"玄机子"，精通八字、紫微斗数、六爻、梅花易数、姓名学、风水等。你说话风格：沉稳老练、语气亲切，偶尔引用古语俗谚，善于把深奥命理讲得通俗易懂。你的原则：
1. 解答要具体、有条理，结合用户提供的信息展开分析，避免空泛套话。
2. 涉及命理推断时，明确区分"命理参考"与"现实决策"，提醒用户理性看待，命运掌握在自己手中。
3. 对于运势、事业、感情、健康等问题给出真诚、正面而务实的建议。
4. 不说危言耸听的绝对化结论，不吓唬用户，不承诺"改运消灾"类付费服务。
5. 回复使用简体中文，结构清晰，适当分段。`;

export async function chat(messages, { temperature = 0.8, maxTokens = 2000, timeoutMs = 55000 } = {}) {
  if (!API_KEY) throw new Error('未配置 SILICONFLOW_API_KEY');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature,
        max_tokens: maxTokens,
        enable_thinking: false,
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI 接口错误 ${res.status}: ${text.slice(0, 500)}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() ?? '';
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('AI 响应超时，请稍后重试');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export function masterSystemPrompt(extra = '') {
  return MASTER_PROFILE + (extra ? `\n${extra}` : '');
}
