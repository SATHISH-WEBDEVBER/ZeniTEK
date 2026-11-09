import React from 'react';

// Wraps every word of a heading in its own span (class "hero-word", with its position as --i) so CSS
// can reveal the words one after another, keeping any markup around them (e.g. a highlighted part in
// a coloured <span>). The spaces stay as text, so the heading wraps exactly as before.
export default function SplitWords({ children }) {
  let index = 0;
  const split = (node) => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node).split(/(\s+)/).map((part) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return part;
        const i = index++;
        return <span key={`w${i}`} className="hero-word inline-block" style={{ '--i': i }}>{part}</span>;
      });
    }
    if (Array.isArray(node)) return node.map((child, i) => <React.Fragment key={i}>{split(child)}</React.Fragment>);
    if (React.isValidElement(node)) {
      if (node.type === React.Fragment) return split(node.props.children);
      // a highlighted part (e.g. a coloured <span>) remembers where its words start, so its underline
      // can draw in as they arrive
      const first = index;
      const children = split(node.props.children);
      return React.cloneElement(node, { style: { ...node.props.style, '--mark-i': first } }, children);
    }
    return node;
  };
  return <>{split(children)}</>;
}
