import React from 'react';

// Renders translated text that may contain <b>…</b> (the only markup the product pages use).
export default function BoldText({ text }) {
  return String(text || '').split(/(<b>.*?<\/b>)/g).filter(Boolean).map((part, i) => (
    part.startsWith('<b>')
      ? <strong key={i} className="font-bold text-[#123B92]">{part.slice(3, -4)}</strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  ));
}
