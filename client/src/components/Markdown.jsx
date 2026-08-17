import React from 'react';

// 轻量 Markdown 渲染（支持标题/粗体/斜体/列表/段落）
function renderInline(text) {
  let s = String(text);
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  return s;
}

export default function Markdown({ text }) {
  const lines = String(text || '').split('\n');
  const blocks = [];
  let list = [];
  const flushList = () => {
    if (list.length) {
      blocks.push({ type: 'ul', items: list });
      list = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^#{1,3}\s+/.test(line)) {
      flushList();
      const m = line.match(/^(#{1,3})\s+(.*)$/);
      blocks.push({ type: 'h' + m[1].length, text: renderInline(m[2]) });
    } else if (/^[-*]\s+/.test(line)) {
      list.push(renderInline(line.replace(/^[-*]\s+/, '')));
    } else if (/^\d+\.\s+/.test(line)) {
      flushList();
      blocks.push({ type: 'li', text: renderInline(line.replace(/^\d+\.\s+/, '')) });
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      blocks.push({ type: 'p', text: renderInline(line) });
    }
  }
  flushList();
  return (
    <div className="md-body">
      {blocks.map((b, i) => {
        if (b.type === 'ul') return <ul key={i}>{b.items.map((it, j) => <li key={j} dangerouslySetInnerHTML={{ __html: it }} />)}</ul>;
        if (b.type === 'li') return <p key={i} className="pl-5">• {<span dangerouslySetInnerHTML={{ __html: b.text }} />}</p>;
        if (b.type === 'h1') return <h1 key={i} dangerouslySetInnerHTML={{ __html: b.text }} />;
        if (b.type === 'h2') return <h2 key={i} dangerouslySetInnerHTML={{ __html: b.text }} />;
        if (b.type === 'h3') return <h3 key={i} dangerouslySetInnerHTML={{ __html: b.text }} />;
        return <p key={i} dangerouslySetInnerHTML={{ __html: b.text }} />;
      })}
    </div>
  );
}
