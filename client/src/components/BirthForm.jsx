import React from 'react';

// 出生信息表单（八字/紫微/星座共用）
export default function BirthForm({ onSubmit, busy, extra }) {
  const [gender, setGender] = React.useState('男');
  const [date, setDate] = React.useState('1990-05-15');
  const [hour, setHour] = React.useState(12);
  const [minute, setMinute] = React.useState(0);
  const [question, setQuestion] = React.useState('');

  const submit = (e) => {
    e.preventDefault();
    const [y, m, d] = date.split('-').map(Number);
    onSubmit({ year: y, month: m, day: d, birthDate: date, birthHour: hour, birthMinute: minute, hour, minute, gender, question });
  };

  return (
    <form onSubmit={submit} className="card p-6 max-w-xl mx-auto">
      <div className="font-kai text-xl text-[#8a1f1a] mb-4 flex items-center gap-2">
        <span className="seal">卜</span> 填写出生信息
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-ink/70 mb-1">性别</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className="input-gold">
            <option value="男">男</option>
            <option value="女">女</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1">出生日期</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-gold" required />
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1">出生时辰</label>
          <select value={hour} onChange={(e) => setHour(Number(e.target.value))} className="input-gold">
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-ink/70 mb-1">分钟</label>
          <select value={minute} onChange={(e) => setMinute(Number(e.target.value))} className="input-gold">
            {[0, 15, 30, 45].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      {extra && <div className="mt-4">{extra({ question, setQuestion })}</div>}
      <button type="submit" disabled={busy} className="mt-6 w-full btn-cinnabar rounded-xl py-3 font-kai text-lg tracking-widest">
        {busy ? '推演中…' : '开始测算'}
      </button>
    </form>
  );
}
