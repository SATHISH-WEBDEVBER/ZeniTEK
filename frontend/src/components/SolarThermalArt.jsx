import React from 'react';

// Simple schematic drawings of the three solar thermal collector types (no text, so they work in
// every site language). There are no photos of ZeniTEK's thermal installations yet, so these
// illustrate how each collector works instead of showing an unrelated dryer photo.
const SUN = '#F5B400';
const RAY = '#F59E0B';
const MIRROR = '#94A3B8';
const NAVY = '#123B92';

function Sun({ cx, cy, r = 16 }) {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * (r + 5)} y1={cy + Math.sin(a) * (r + 5)}
        x2={cx + Math.cos(a) * (r + 12)} y2={cy + Math.sin(a) * (r + 12)}
        stroke={SUN} strokeWidth="3" strokeLinecap="round"
      />
    );
  });
  return <g><circle cx={cx} cy={cy} r={r} fill={SUN} />{spokes}</g>;
}

// Parabolic trough (cross-section): parallel rays reflect off the curved mirror onto the receiver pipe.
function Trough() {
  const focus = [180, 95];
  // Mirror is the parabola y = 150 - (x - 180)^2 / 220 (vertex 180,150; focus 180,95)
  const rays = [125, 150, 210, 235].map(x => [x, 150 - ((x - 180) ** 2) / 220]);
  return (
    <>
      <Sun cx={58} cy={44} />
      {rays.map(([x, y]) => (
        <g key={x}>
          <line x1={x} y1={22} x2={x} y2={y} stroke={RAY} strokeWidth="2" strokeDasharray="5 4" />
          <line x1={x} y1={y} x2={focus[0]} y2={focus[1]} stroke={RAY} strokeWidth="2" />
        </g>
      ))}
      <path d="M110,127.7 Q180,172.3 250,127.7" fill="none" stroke={MIRROR} strokeWidth="7" strokeLinecap="round" />
      <path d="M110,127.7 Q180,172.3 250,127.7" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
      <line x1="180" y1="101" x2="180" y2="150" stroke={NAVY} strokeWidth="2" opacity="0.35" />
      <circle cx={focus[0]} cy={focus[1]} r="7" fill={NAVY} />
      <circle cx={focus[0]} cy={focus[1]} r="3" fill="#EF4444" />
      <line x1="180" y1="150" x2="180" y2="182" stroke="#64748B" strokeWidth="4" />
      <line x1="150" y1="184" x2="210" y2="184" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
    </>
  );
}

// Scheffler dish: the tracking reflector sends sunlight to a fixed focus inside a building (e.g. a cooking pot).
function Scheffler() {
  const focus = [196, 132];
  const hits = [[45, 85], [40, 115], [45, 145]];
  return (
    <>
      <Sun cx={278} cy={34} />
      {hits.map(([x, y]) => (
        <g key={y}>
          <line x1={x + 112} y1={y - 62} x2={x} y2={y} stroke={RAY} strokeWidth="2" strokeDasharray="5 4" />
          <line x1={x} y1={y} x2={focus[0]} y2={focus[1]} stroke={RAY} strokeWidth="2" />
        </g>
      ))}
      <path d="M60,55 Q20,115 60,175" fill="none" stroke={MIRROR} strokeWidth="8" strokeLinecap="round" />
      <path d="M60,55 Q20,115 60,175" fill="none" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="115" x2="28" y2="184" stroke="#64748B" strokeWidth="4" />
      <line x1="12" y1="186" x2="48" y2="186" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
      {/* Building with the fixed focus at its window */}
      <rect x="196" y="104" width="96" height="80" rx="4" fill="#F8FAFC" stroke={NAVY} strokeWidth="2" />
      <path d="M190,106 L244,78 L298,106" fill="none" stroke={NAVY} strokeWidth="2" strokeLinejoin="round" />
      <rect x="192" y="124" width="8" height="16" fill="#FDE68A" stroke={NAVY} strokeWidth="1.5" />
      <rect x="214" y="138" width="36" height="22" rx="4" fill="#475569" />
      <path d="M222,134 q4,-8 0,-14 M232,134 q4,-8 0,-14 M242,134 q4,-8 0,-14" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
      <line x1="196" y1="184" x2="292" y2="184" stroke="#64748B" strokeWidth="3" />
    </>
  );
}

// Evacuated tube collector: a row of glass vacuum tubes feeding an insulated hot-water tank.
function Tubes() {
  const tubes = Array.from({ length: 8 }, (_, i) => 66 + i * 24);
  return (
    <>
      <Sun cx={284} cy={34} />
      {[110, 160, 210].map(x => (
        <line key={x} x1={x + 70} y1={30} x2={x} y2={110} stroke={RAY} strokeWidth="2" strokeDasharray="5 4" />
      ))}
      <rect x="54" y="46" width="200" height="24" rx="12" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
      {tubes.map(x => (
        <g key={x}>
          <rect x={x} y="70" width="16" height="96" rx="8" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1.5" />
          <rect x={x + 5} y="74" width="6" height="88" rx="3" fill={NAVY} opacity="0.85" />
        </g>
      ))}
      <line x1="58" y1="168" x2="250" y2="168" stroke="#64748B" strokeWidth="3" />
      <line x1="70" y1="168" x2="62" y2="188" stroke="#64748B" strokeWidth="3" />
      <line x1="238" y1="168" x2="246" y2="188" stroke="#64748B" strokeWidth="3" />
      {/* Cold water in, hot water out */}
      <path d="M22,58 L50,58" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" />
      <path d="M44,52 L52,58 L44,64" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M258,58 L296,58" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
      <path d="M290,52 L298,58 L290,64" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const DRAWINGS = { trough: Trough, scheffler: Scheffler, tubes: Tubes };

export default function SolarThermalArt({ type = 'trough', className = '' }) {
  const Drawing = DRAWINGS[type] || Trough;
  return (
    <svg viewBox="0 0 320 200" className={className} role="presentation" aria-hidden="true">
      <rect x="0" y="0" width="320" height="200" rx="16" fill="#F0F4FD" />
      <Drawing />
    </svg>
  );
}
