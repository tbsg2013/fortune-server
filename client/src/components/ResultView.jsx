import React from 'react';
import Markdown from './Markdown.jsx';

export default function ResultView({ title, chart, interpretation, children }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="seal">玄机</span>
        <h2 className="font-kai text-2xl text-[#8a1f1a]">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-gold/60 to-transparent" />
      </div>
      {children}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="seal">解</span>
          <h3 className="font-kai text-xl text-[#8a1f1a]">玄机子解读</h3>
        </div>
        {interpretation && interpretation.startsWith('（AI') ? (
          <p className="text-ink/60 text-sm">{interpretation}</p>
        ) : (
          <Markdown text={interpretation} />
        )}
        <p className="mt-4 text-[11px] text-ink/40 border-t border-gold/20 pt-3">本解读由 AI 依据命盘数据生成，仅供参考，请理性看待。</p>
      </div>
    </div>
  );
}
