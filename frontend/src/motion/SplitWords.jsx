import React from 'react';

// Wraps every word of a heading in its own span (class "hero-word") so the words can be revealed one
// after another, keeping any markup around them (e.g. a highlighted part in a coloured <span>).
// The spaces stay as text, so the heading wraps exactly as before.
export default function SplitWords({ children }) {
  let index = 0;
  const split = (node) => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node).split(/(\s+)/).map((part) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return part;
        const i = index++;
        return <span key={`w${i}`} className="hero-word inline-block">{part}</span>;
      });
    }
    if (Array.isArray(node)) return node.map((child, i) => <React.Fragment key={i}>{split(child)}</React.Fragment>);
    if (React.isValidElement(node)) {
      if (node.type === React.Fragment) return split(node.props.children);
      return React.cloneElement(node, undefined, split(node.props.children));
    }
    return node;
  };
  return <>{split(children)}</>;
}
