import React from 'react';

export default function Loading({ text = '玄机子正在推演天机…' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="taiji-spinner" />
      <p className="mt-6 font-kai text-lg text-[#8a1f1a] tracking-widest">{text}</p>
      <p className="mt-2 text-xs text-ink/50">AI 推演需要一些时间，请耐心等待</p>
    </div>
  );
}
